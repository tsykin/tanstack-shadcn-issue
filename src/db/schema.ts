import {
	boolean,
	decimal,
	foreignKey,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from '@/db/helpers';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const user = pgTable(
	'user',
	{
		id: text().primaryKey().notNull(),
		name: text().notNull(),
		slug: varchar({ length: 100 }).notNull().unique(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		email: text().notNull(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		image: text(),
		passwordResetToken: text('password_reset_token'),
		role: userRoleEnum().default('user').notNull(),
		...timestamps,
	},
	(table) => [
		uniqueIndex('app_user_email_key').using(
			'btree',
			table.email.asc().nullsLast().op('text_ops')
		),
	]
);

export const session = pgTable(
	'session',
	{
		id: text().primaryKey().notNull(),
		expiresAt: timestamp('expires_at', {
			precision: 3,
			mode: 'date',
		}).notNull(),
		token: text().notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id').notNull(),
		...timestamps,
	},
	(table) => [
		uniqueIndex('session_token_key').using(
			'btree',
			table.token.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'session_user_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	]
);

export const account = pgTable(
	'account',
	{
		id: text().primaryKey().notNull(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id').notNull(),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at', {
			precision: 3,
			mode: 'date',
		}),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
			precision: 3,
			mode: 'date',
		}),
		scope: text(),
		password: text(),
		...timestamps,
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'account_user_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	]
);

export const verification = pgTable('verification', {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp('expires_at', {
		precision: 3,
		mode: 'date',
	}).notNull(),
	...timestamps,
});

export const post = pgTable(
	'post',
	{
		id: text().primaryKey().notNull(),
		content: text().notNull(),
		userId: text('user_id').notNull(),
		parentPostId: text('parent_post_id'),
		...timestamps,
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'post_user_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.parentPostId],
			foreignColumns: [table.id],
			name: 'post_parent_post_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
	]
);

export const postLikeEnum = pgEnum('post_like_type', ['like', 'dislike']);

export const postLike = pgTable(
	'post_like',
	{
		id: text().primaryKey().notNull(),
		postId: text('post_id').notNull(),
		userId: text('user_id').notNull(),
		type: postLikeEnum().notNull(),
		...timestamps,
	},
	(table) => [
		foreignKey({
			columns: [table.postId],
			foreignColumns: [post.id],
			name: 'post_like_post_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'post_like_user_id_fkey',
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		uniqueIndex('post_like_user_post_key').using(
			'btree',
			table.userId.asc().nullsLast().op('text_ops'),
			table.postId.asc().nullsLast().op('text_ops')
		),
	]
);
