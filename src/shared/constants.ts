export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const STATIC_IMAGES = {
	OPEN_GRAPH: '/og-image.webp',
	FAVICON_ICO: '/favicon/favicon.ico',
	FAVICON_SVG: '/favicon/favicon.svg',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif',
] as const;
