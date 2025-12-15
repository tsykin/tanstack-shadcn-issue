import { InferSelectModel } from 'drizzle-orm';
import { userRoleEnum } from '@/db/schema';

// For schema

export type Cookie = {
	name: string;
	value: string;
	expires?: Date;
	httpOnly?: boolean;
};

export type CookiesArray = Cookie[];

// Enum types and values

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const userRoleValues = Object.fromEntries(
	userRoleEnum.enumValues.map((role) => [role, role])
) as Record<UserRole, UserRole>;
