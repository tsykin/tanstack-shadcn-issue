import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { post } from '@/db/schema';
import { userRoleValues } from '@/db/types';
import { auth } from '@/features/auth/base';

/**
 * Middleware to check if the user is authenticated.
 */
export const isAuthenticated = createMiddleware({ type: 'function' }).server(
	async ({ next }) => {
		const request = getRequest();

		if (!request?.headers) {
			throw redirect({ to: '/' });
		}

		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			throw redirect({ to: '/' });
		}

		return next({
			context: {
				...session,
			},
		});
	}
);

/**
 * Middleware to check if the user is authenticated and is the owner of the post or an admin.
 * Expects input data with an `id` field (post ID).
 */
export const canUpdatePost = createMiddleware({ type: 'function' }).server(
	async ({ next, data }) => {
		const request = getRequest();

		if (!request?.headers) {
			throw new Error('Unauthorized');
		}

		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user?.id) {
			throw new Error('Unauthorized');
		}

		// Get post ID from input data
		const inputData = data as unknown as { id?: string };
		const postId = inputData?.id;
		if (!postId) {
			throw new Error('Post ID is required');
		}

		// Fetch the post to check ownership
		const foundPost = await db.query.post.findFirst({
			where: eq(post.id, postId),
		});

		if (!foundPost) {
			throw new Error('Post not found');
		}

		// Check if user is the owner or an admin
		const isOwner = foundPost.userId === session.user.id;
		const isAdmin = session.user.role === userRoleValues.admin;

		if (!isOwner && !isAdmin) {
			throw new Error('You do not have permission to update this post');
		}

		return next({
			context: {
				...session,
			},
		});
	}
);
