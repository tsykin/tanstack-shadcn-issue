import { createServerOnlyFn } from '@tanstack/react-start';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as relations from '@/db/relations';
import * as tables from '@/db/schema';
import { SERVER_ENV } from '@/shared/env.server';

const driver = postgres(SERVER_ENV.DATABASE_URL);
const schema = { ...tables, ...relations } as const;

const getDatabase = createServerOnlyFn(() =>
	drizzle({ client: driver, schema })
);

export const db = getDatabase();
