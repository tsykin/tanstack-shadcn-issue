// Browser utilities
export function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null;
	}
	return null;
}

export function setCookie(
	name: string,
	value: string,
	expirationSeconds = 365 * 24 * 60 * 60
) {
	if (typeof document === 'undefined') return;

	const expires = new Date();
	expires.setTime(expires.getTime() + expirationSeconds * 1000);
	document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

// Server utilities
export function parseCookiesFromHeaders(cookies: string) {
	return cookies
		.split(';')
		.map((cookie) => cookie.trim().split('='))
		.reduce(
			(acc, [key, value]) => {
				// Handle URL-encoded values
				acc[key] = value ? decodeURIComponent(value) : '';
				return acc;
			},
			{} as Record<string, string>
		);
}

export function getCookieByName(
	cookieString: string | undefined,
	name: string
): string | undefined {
	if (!cookieString) return undefined;

	const cookies = parseCookiesFromHeaders(cookieString);
	return cookies[name];
}

/**
 * Convert JSON cookies to cookie string format
 * Input: Array of cookie objects or single cookie object
 * Output: Cookie string in "name=value; name2=value2" format
 */
export function jsonToCookieString(jsonCookies: any) {
	// Handle single object or array
	const cookies = Array.isArray(jsonCookies) ? jsonCookies : [jsonCookies];

	// Convert each cookie to "name=value" format
	const cookieStrings = cookies
		.map((cookie) => {
			// Handle different JSON formats
			const name = cookie.name || cookie.key;
			const value = cookie.value;

			if (!name || value === undefined) {
				console.warn('Skipping invalid cookie:', cookie);
				return null;
			}

			return `${name}=${value}`;
		})
		.filter(Boolean); // Remove null entries

	// Join with "; " separator
	return cookieStrings.join('; ');
}
