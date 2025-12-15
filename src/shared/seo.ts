import { DICTIONARY } from '@/shared/dictionary';

export const seo = ({
	title,
	description,
	keywords,
	image,
	url,
	imageAlt,
	imageWidth,
	imageHeight,
	type = 'website',
	locale = 'en_US',
	siteName = DICTIONARY.SITE_NAME,
	author,
	themeColor,
}: {
	title: string;
	description?: string;
	image?: string;
	keywords?: string;
	url?: string;
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	type?: 'website' | 'article' | 'profile';
	locale?: string;
	siteName?: string;
	author?: string;
	themeColor?: string;
}) => {
	const tags = [
		{ title },
		{ name: 'description', content: description },
		...(keywords ? [{ name: 'keywords', content: keywords }] : []),
		...(author ? [{ name: 'author', content: author }] : []),
		...(themeColor ? [{ name: 'theme-color', content: themeColor }] : []),
		// Open Graph tags
		{ name: 'og:type', content: type },
		{ name: 'og:title', content: title },
		{ name: 'og:description', content: description },
		{ name: 'og:locale', content: locale },
		{ name: 'og:site_name', content: siteName },
		...(url ? [{ name: 'og:url', content: url }] : []),
		...(image
			? [
					{ name: 'og:image', content: image },
					...(imageAlt ? [{ name: 'og:image:alt', content: imageAlt }] : []),
					...(imageWidth
						? [{ name: 'og:image:width', content: String(imageWidth) }]
						: []),
					...(imageHeight
						? [{ name: 'og:image:height', content: String(imageHeight) }]
						: []),
					{ name: 'og:image:type', content: 'image/webp' },
				]
			: []),
		...(image
			? [
					{ name: 'twitter:image', content: image },
					...(imageAlt
						? [{ name: 'twitter:image:alt', content: imageAlt }]
						: []),
				]
			: []),
	];

	return tags;
};
