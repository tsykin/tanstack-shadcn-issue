import { createAuthClient } from 'better-auth/react';
import { CLIENT_ENV } from '@/shared/env.client';

export const { useSession, signIn, signOut, signUp, getSession } =
	createAuthClient({
		baseURL: CLIENT_ENV.VITE_BASE_URL,
		redirectTo: '/',
	});
