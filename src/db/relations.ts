import { relations } from 'drizzle-orm/relations';
import { account, post, postLike, session, user } from '@/db/schema';

// User relations

export const sessionRelations = relations(session, ({ one }) => ({
	appUser: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	posts: many(post),
	postLikes: many(postLike),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const postRelations = relations(post, ({ one, many }) => ({
	user: one(user, {
		fields: [post.userId],
		references: [user.id],
	}),
	parentPost: one(post, {
		fields: [post.parentPostId],
		references: [post.id],
		relationName: 'parentPost',
	}),
	replies: many(post, {
		relationName: 'parentPost',
	}),
	likes: many(postLike),
}));

export const postLikeRelations = relations(postLike, ({ one }) => ({
	post: one(post, {
		fields: [postLike.postId],
		references: [post.id],
	}),
	user: one(user, {
		fields: [postLike.userId],
		references: [user.id],
	}),
}));
