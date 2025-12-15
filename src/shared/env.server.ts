import { createServerOnlyFn } from '@tanstack/react-start';
import * as z from 'zod';

export const serverEnvSchema = z.object({
	NODE_ENV: z.enum(['production', 'development']),
	VITE_BASE_URL: z.string(),
});

const getServerEnv = createServerOnlyFn(() => {
	const serverEnv = {
		NODE_ENV: process.env.NODE_ENV,
		VITE_BASE_URL: process.env.VITE_BASE_URL,
	};

	return serverEnvSchema.parse(serverEnv);
});

export const SERVER_ENV = getServerEnv();
