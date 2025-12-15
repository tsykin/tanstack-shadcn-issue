import { createFileRoute } from '@tanstack/react-router';
import { SERVER_ENV } from '@/shared/env.server';

export const Route = createFileRoute('/robots.txt')({
	server: {
		handlers: {
			GET: async () => {
				try {
					const baseUrl = SERVER_ENV.VITE_BASE_URL;
					const robotsContent = `User-Agent: *
Allow: /
Disallow: /dashboard/*

Sitemap: ${baseUrl}/sitemap.xml
`;

					return new Response(robotsContent, {
						headers: {
							'Content-Type': 'text/plain; charset=utf-8',
							'Cache-Control': 'public, max-age=3600',
						},
					});
				} catch (error) {
					return new Response(
						JSON.stringify({
							error: 'Robots.txt error',
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
