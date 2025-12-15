import { createServerFn } from '@tanstack/react-start';
import { and, eq, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '@/db';
import { post, postLike } from '@/db/schema';
import { getUserSession } from '@/features/auth/server';
import { canUpdatePost } from '@/shared/middleware';

const createPostSchema = z.object({
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Content must be less than 500 characters'),
	parentPostId: z.string().optional(),
});

const updatePostSchema = z.object({
	id: z.string().min(1, 'Post ID is required'),
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Content must be less than 500 characters'),
});

const toggleLikeSchema = z.object({
	postId: z.string().min(1, 'Post ID is required'),
	type: z.enum(['like', 'dislike']),
});

const getPostsSchema = z.object({
	limit: z.number().int().positive().optional(),
	userId: z.string().optional(),
});

export const getPosts = createServerFn({ method: 'GET' })
	.inputValidator((data: unknown) => getPostsSchema.parse(data))
	.handler(async ({ data }) => {
		const whereConditions = data.userId
			? and(isNull(post.parentPostId), eq(post.userId, data.userId))
			: isNull(post.parentPostId);

		const posts = await db.query.post.findMany({
			where: whereConditions,
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
			limit: data.limit,
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						slug: true,
						image: true,
					},
				},
				replies: {
					with: {
						user: {
							columns: {
								id: true,
								name: true,
								slug: true,
								image: true,
							},
						},
					},
					orderBy: (replies, { asc }) => [asc(replies.createdAt)],
				},
				likes: true,
			},
		});

		return posts;
	});

export const getPost = createServerFn({ method: 'GET' })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const foundPost = await db.query.post.findFirst({
			where: eq(post.id, data.id),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						slug: true,
						image: true,
					},
				},
				replies: {
					with: {
						user: {
							columns: {
								id: true,
								name: true,
								slug: true,
								image: true,
							},
						},
					},
					orderBy: (replies, { asc }) => [asc(replies.createdAt)],
				},
				likes: true,
			},
		});

		if (!foundPost) {
			throw new Error('Post not found');
		}

		return foundPost;
	});

export const createPost = createServerFn({ method: 'POST' })
	.inputValidator((data: unknown) => createPostSchema.parse(data))
	.handler(async ({ data }) => {
		const authSession = await getUserSession();
		if (!authSession?.user?.id) {
			throw new Error('Unauthorized');
		}

		const [newPost] = await db
			.insert(post)
			.values({
				id: nanoid(),
				content: data.content,
				userId: authSession.user.id,
				parentPostId: data.parentPostId || null,
			})
			.returning();

		return newPost;
	});

export const updatePost = createServerFn({ method: 'POST' })
	.inputValidator((data: unknown) => updatePostSchema.parse(data))
	.middleware([canUpdatePost])
	.handler(async ({ data }) => {
		const [updatedPost] = await db
			.update(post)
			.set({
				content: data.content,
			})
			.where(eq(post.id, data.id))
			.returning();

		return updatedPost;
	});

export const deletePost = createServerFn({ method: 'POST' })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		const authSession = await getUserSession();
		if (!authSession?.user?.id) {
			throw new Error('Unauthorized');
		}

		const foundPost = await db.query.post.findFirst({
			where: and(eq(post.id, data.id), eq(post.userId, authSession.user.id)),
		});

		if (!foundPost) {
			throw new Error(
				'Post not found or you do not have permission to delete it'
			);
		}

		await db.delete(post).where(eq(post.id, data.id));

		return { success: true };
	});

export const toggleLike = createServerFn({ method: 'POST' })
	.inputValidator((data: unknown) => toggleLikeSchema.parse(data))
	.handler(async ({ data }) => {
		const authSession = await getUserSession();
		if (!authSession?.user?.id) {
			throw new Error('Unauthorized');
		}

		// Check if post exists
		const foundPost = await db.query.post.findFirst({
			where: eq(post.id, data.postId),
		});

		if (!foundPost) {
			throw new Error('Post not found');
		}

		// Check if user already has a like/dislike on this post
		const existingLike = await db.query.postLike.findFirst({
			where: and(
				eq(postLike.postId, data.postId),
				eq(postLike.userId, authSession.user.id)
			),
		});

		if (existingLike) {
			if (existingLike.type === data.type) {
				// Remove like/dislike if clicking the same type
				await db
					.delete(postLike)
					.where(
						and(
							eq(postLike.postId, data.postId),
							eq(postLike.userId, authSession.user.id)
						)
					);
				return { success: true, action: 'removed' };
			} else {
				// Update to the new type
				await db
					.update(postLike)
					.set({ type: data.type })
					.where(
						and(
							eq(postLike.postId, data.postId),
							eq(postLike.userId, authSession.user.id)
						)
					);
				return { success: true, action: 'updated' };
			}
		} else {
			// Create new like/dislike
			await db.insert(postLike).values({
				id: nanoid(),
				postId: data.postId,
				userId: authSession.user.id,
				type: data.type,
			});
			return { success: true, action: 'created' };
		}
	});
