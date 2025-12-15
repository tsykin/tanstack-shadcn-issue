import { createFileRoute } from '@tanstack/react-router';
import { db } from '@/db';
import { post } from '@/db/schema';
import {
	generateSitemapIndexXml,
	getLastmodDate,
	type SitemapIndexEntry,
	SitemapUrlEntry,
} from '@/shared/sitemap-utils';

export const Route = createFileRoute('/sitemap.xml')({
	server: {
		handlers: {
			GET: async () => {
				try {
					const now = new Date();
					const today = now.toISOString().split('T')[0];

					const posts = await db.query.post.findMany();

					const sitemapEntries: SitemapUrlEntry[] = [
						{
							loc: '/',
							lastmod: today,
							changefreq: 'daily',
							priority: 1.0,
						},
						{
							loc: '/blog',
							lastmod: today,
							changefreq: 'daily',
							priority: 1.0,
						},
						...posts.map((post) => ({
							loc: `/post/${post.id}`,
							lastmod: getLastmodDate(post.createdAt, null, today),
							changefreq: 'monthly' as const,
							priority: 0.8,
						})),
					];

					const xml = generateSitemapIndexXml(sitemapEntries);

					return new Response(xml, {
						headers: {
							'Content-Type': 'application/xml; charset=utf-8',
							'Cache-Control': 'public, max-age=3600',
						},
					});
				} catch (error) {
					return new Response(
						JSON.stringify({
							error: 'Sitemap index error',
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
