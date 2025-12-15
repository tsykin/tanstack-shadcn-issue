import {
	DEFAULT_THEME,
	THEME_COOKIE_NAME,
} from '@/components/theme/theme-provider';

/**
 * Theme script that prevents flicker by applying the theme from cookies
 * before React hydration. This should be included in the document head.
 */
export function ThemeScript({
	cookieName = THEME_COOKIE_NAME,
	defaultTheme = DEFAULT_THEME,
}: {
	cookieName?: string;
	defaultTheme?: 'dark' | 'light' | 'system';
} = {}) {
	const script = `
		(function() {
			function getCookie(name) {
				const value = '; ' + document.cookie;
				const parts = value.split('; ' + name + '=');
				if (parts.length === 2) {
					return parts.pop().split(';').shift();
				}
				return null;
			}
			
			function getResolvedTheme(theme) {
				if (theme === 'system') {
					return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
				}
				return theme;
			}
			
			try {
				const cookieTheme = getCookie('${cookieName}');
				const theme = cookieTheme && ['dark', 'light', 'system'].includes(cookieTheme) 
					? cookieTheme 
					: '${defaultTheme}';
				const resolvedTheme = getResolvedTheme(theme);
				
				const root = document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(resolvedTheme);
				root.style.setProperty('--theme', resolvedTheme);
			} catch (e) {
				// Fallback to default theme if anything goes wrong
				document.documentElement.classList.add('${defaultTheme === 'system' ? 'dark' : defaultTheme}');
			}
		})();
	`;

	return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
