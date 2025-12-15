import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
		() => new Date()
	),
};
