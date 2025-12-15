import { createServerOnlyFn } from '@tanstack/react-start';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { reactStartCookies } from 'better-auth/react-start';
import slugify from 'slugify/slugify';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { SERVER_ENV } from '@/shared/env.server';
import { resolveSlugFromEmail } from '@/shared/server-utils';
import { generateRandomNumber } from '@/shared/utils';

const getAuthConfig = createServerOnlyFn(() =>
	betterAuth({
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema,
		}),
		baseURL: SERVER_ENV.VITE_BASE_URL,
		basePath: '/api/auth',
		secret: SERVER_ENV.BETTER_AUTH_SECRET,
		usePlural: false,

		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
		},

		socialProviders: {
			google: {
				enabled: true,
				prompt: 'select_account',
				clientId: SERVER_ENV.GOOGLE_CLIENT_ID as string,
				clientSecret: SERVER_ENV.GOOGLE_CLIENT_SECRET as string,
				mapProfileToUser: (profile) => {
					const slug = slugify(profile.name, { lower: true, strict: true });
					const number = generateRandomNumber(1000, 9999);
					const fullSlug = `${slug}-${number}`;
					return {
						firstName: profile.given_name,
						lastName: profile.family_name,
						slug: fullSlug,
					};
				},
			},
		},

		user: {
			modelName: 'user',
			additionalFields: {
				slug: {
					type: 'string',
					required: false,
					input: false,
				},
				role: {
					type: 'string',
					required: false,
					input: false,
				},
				firstName: {
					type: 'string',
					required: false,
					input: false,
				},
				lastName: {
					type: 'string',
					required: false,
					input: false,
				},
			},
		},

		rateLimit: {
			enabled: false,
		},

		plugins: [reactStartCookies()],
		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						if (user.slug) {
							return;
						}

						const email = user.email;
						if (!email) {
							return;
						}

						const slug = await resolveSlugFromEmail({ data: email });
						return { data: { slug } };
					},
				},
			},
		},
	})
);

export const auth = getAuthConfig();
