import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from '@/shared/cookies';

export const THEME_COOKIE_NAME = 'theme';
export const DEFAULT_THEME = 'system';
export const THEME_COOKIE_EXPIRATION = 365 * 24 * 60 * 60; // 1 year

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	cookieName?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: 'system',
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Get theme from cookies or system preference
function getInitialTheme(cookieName: string, defaultTheme: Theme): Theme {
	// Server-side: return default to prevent hydration mismatch
	if (typeof window === 'undefined') {
		return defaultTheme;
	}

	// Client-side: check cookie first, then default
	const storedTheme = getCookie(cookieName) as Theme;
	return storedTheme && ['dark', 'light', 'system'].includes(storedTheme)
		? storedTheme
		: defaultTheme;
}

// Get the actual theme to apply (resolve 'system' to 'dark' or 'light')
function getResolvedTheme(theme: Theme): 'dark' | 'light' {
	if (theme === 'system') {
		if (typeof window === 'undefined') {
			return 'dark'; // Default for SSR
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}
	return theme;
}

/**
 * ThemeProvider wraps your app in a context that provides the current theme,
 * automatically detecting the user's preferred color scheme and updating
 * the theme when it changes.
 *
 * It also sets a CSS custom property (`--theme`) to the current theme,
 * which can be used in your CSS to style your app based on the theme.
 *
 * The theme is stored in a cookie, which is automatically set when the user
 * changes the theme using the `setTheme` function from the context.
 *
 * The theme can be one of the following values:
 * - `'dark'`: dark theme
 * - `'light'`: light theme
 * - `'system'`: current system theme
 *
 * @prop {React.ReactNode} children The content to render.
 * @prop {Theme} defaultTheme The default theme to use if no cookie is set.
 * @prop {string} cookieName The name of the cookie to store the theme in.
 * @example
 */

export function ThemeProvider({
	children,
	defaultTheme = DEFAULT_THEME,
	cookieName = THEME_COOKIE_NAME,
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() =>
		getInitialTheme(cookieName, defaultTheme)
	);
	const [mounted, setMounted] = useState(false);

	// Handle mounting to prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
		// Re-read the cookie after mounting in case it differs from SSR default
		const cookieTheme = getInitialTheme(cookieName, defaultTheme);
		if (cookieTheme !== theme) {
			setThemeState(cookieTheme);
		}
	}, [cookieName, defaultTheme, theme]);

	// Apply theme to document
	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		const resolvedTheme = getResolvedTheme(theme);

		root.classList.remove('light', 'dark');
		root.classList.add(resolvedTheme);

		// Set CSS custom property for theme detection
		root.style.setProperty('--theme', resolvedTheme);
	}, [theme, mounted]);

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted || theme !== 'system') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			const resolvedTheme = getResolvedTheme('system');
			const root = document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(resolvedTheme);
			root.style.setProperty('--theme', resolvedTheme);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme, mounted]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		setCookie(cookieName, newTheme, THEME_COOKIE_EXPIRATION);
	};

	const value = {
		theme,
		setTheme,
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider');

	return context;
};
