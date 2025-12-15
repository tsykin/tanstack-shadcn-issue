import { createServerOnlyFn } from '@tanstack/react-start';
import * as z from 'zod';

export const serverEnvSchema = z.object({
	NODE_ENV: z.enum(['production', 'development']),
	VITE_BASE_URL: z.string(),
	DATABASE_URL: z.string(),
	BETTER_AUTH_SECRET: z.string().min(1),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	VITE_AWS_REGION: z.string().min(1),
	AWS_ACCESS_KEY: z.string().min(1),
	AWS_SECRET_ACCESS_KEY: z.string().min(1),
	VITE_AWS_BUCKET_NAME: z.string().min(1),
});

const getServerEnv = createServerOnlyFn(() => {
	const serverEnv = {
		NODE_ENV: process.env.NODE_ENV,
		VITE_BASE_URL: process.env.VITE_BASE_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		VITE_AWS_REGION: process.env.VITE_AWS_REGION,
		AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		VITE_AWS_BUCKET_NAME: process.env.VITE_AWS_BUCKET_NAME,
	};

	return serverEnvSchema.parse(serverEnv);
});

export const SERVER_ENV = getServerEnv();
