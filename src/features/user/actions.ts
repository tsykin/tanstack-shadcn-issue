import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/schema';
import { getUserSession } from '@/features/auth/server';

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
	const users = await db.query.user.findMany();
	// const users = await db.select().from(schema.appUser);
	return users;
});

interface UpdateUserInput {
	name?: string;
	firstName?: string;
	lastName?: string;
}

export const updateUser = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdateUserInput) => data)
	.handler(async ({ data }) => {
		const authSession = await getUserSession();
		if (!authSession?.user?.id) {
			throw new Error('Unauthorized');
		}

		const foundUser = await db.query.user.findFirst({
			where: eq(user.id, authSession.user.id),
		});

		if (!foundUser) {
			throw new Error(`User not found`);
		}

		// Build update object with only provided fields
		const updateData: Partial<typeof user.$inferInsert> = {};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.firstName !== undefined)
			updateData.firstName = data.firstName || null;
		if (data.lastName !== undefined)
			updateData.lastName = data.lastName || null;

		// Update user
		const [updatedUser] = await db
			.update(user)
			.set(updateData)
			.where(eq(user.id, authSession.user.id))
			.returning();

		console.log(`Successfully updated user ${authSession.user.id}`);
		return updatedUser;
	});
