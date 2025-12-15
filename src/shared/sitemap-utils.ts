import { SERVER_ENV } from '@/shared/env.server';

export type SitemapUrlEntry = {
	loc: string;
	lastmod: string;
	changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: number;
};

export type SitemapIndexEntry = {
	loc: string;
	lastmod: string;
};

export function generateSitemapXml(entries: SitemapUrlEntry[]) {
	const urls = entries
		.map((entry) => {
			const changefreq = entry.changefreq
				? `<changefreq>${entry.changefreq}</changefreq>`
				: '';
			const priority = entry.priority
				? `<priority>${entry.priority}</priority>`
				: '';
			return `\n<url><loc>${SERVER_ENV.VITE_BASE_URL}${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod>${changefreq}${priority}</url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;
}

export function generateSitemapIndexXml(entries: SitemapIndexEntry[]) {
	const sitemaps = entries
		.map((entry) => {
			return `\n<sitemap><loc>${SERVER_ENV.VITE_BASE_URL}${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod></sitemap>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}\n</sitemapindex>`;
}

export function getLastmodDate(
	updatedAt: string | Date | null | undefined,
	createdAt: string | Date | null | undefined,
	fallback: string = '2025-11-07'
): string {
	if (updatedAt) {
		const date = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
		return date.toISOString().split('T')[0];
	}
	if (createdAt) {
		const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
		return date.toISOString().split('T')[0];
	}
	return fallback;
}
