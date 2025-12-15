import { createFileRoute } from '@tanstack/react-router';
import { CLIENT_ENV } from '@/shared/env.client';

export const Route = createFileRoute('/api/hello')({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const clientEnv = CLIENT_ENV;
					return new Response(JSON.stringify(`Hello world!`), {
						headers: { 'Content-Type': 'application/json' },
					});
				} catch (error) {
					return new Response(
						JSON.stringify({
							error: 'Hello endpoint failed',
							message: error instanceof Error ? error.message : 'Unknown error',
						}),
						{
							status: 500,
							headers: { 'Content-Type': 'application/json' },
						}
					);
				}
			},
		},
	},
});
