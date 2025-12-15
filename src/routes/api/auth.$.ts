import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/features/auth/base';

export const Route = createFileRoute('/api/auth/$')({
	server: {
		handlers: {
			GET: ({ request }) => {
				console.log(`Auth GET: ${request.url}`);
				console.log(`Request body: ${JSON.stringify(request.body)}`);
				return auth.handler(request);
			},
			POST: ({ request }) => {
				console.log(`Auth POST: ${request.url}`);
				console.log(`Request body: ${JSON.stringify(request.body)}`);
				return auth.handler(request);
			},
		},
	},
});
