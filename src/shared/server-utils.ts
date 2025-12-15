import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import slugify from 'slugify/slugify';
import { db } from '@/db';
import { generateRandomNumber } from '@/shared/utils';

export const getRequestData = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getRequest();
		if (!request) {
			return null;
		}

		// Extract only serializable properties
		const headers: Record<string, string> = {};
		request.headers.forEach((value, key) => {
			headers[key] = value;
		});

		return {
			url: request.url,
			method: request.method,
			headers,
		};
	}
);

// Helper function to log payload size
interface LogPayloadSizeInput {
	label: string;
	data: unknown;
}

export const logPayloadSize = createServerFn({ method: 'POST' })
	.inputValidator((data: LogPayloadSizeInput) => data)
	.handler(async ({ data }) => {
		try {
			const payload = JSON.stringify(data.data ?? null);
			if (typeof payload === 'string') {
				const bytes = Buffer.byteLength(payload);
				console.log(
					`[loader:${data.label}] payload bytes=${bytes} (~${(bytes / 1024).toFixed(1)}kB)`
				);
			}
		} catch (error) {
			console.error(`[loader:${data.label}] failed to log payload size`, error);
		}

		return {};
	});

export const resolveSlugFromEmail = createServerFn({
	method: 'POST',
})
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const email = data;
		const [localPart] = email.split('@');
		const baseSlug = slugify(localPart, { lower: true, strict: true });
		if (!baseSlug) {
			return `user-${generateRandomNumber(1000, 9999)}`;
		}

		let candidate = baseSlug;
		let attempt = 0;

		// Try a few times before giving up to avoid an infinite loop.
		while (attempt < 5) {
			const existingUser = await db.query.user.findFirst({
				where: (users, { eq }) => eq(users.slug, candidate),
			});

			if (!existingUser) {
				return candidate;
			}

			attempt += 1;
			candidate = `${baseSlug}-${generateRandomNumber(1000, 9999)}`;
		}

		return `${baseSlug}-${generateRandomNumber(1000, 9999)}`;
	});
