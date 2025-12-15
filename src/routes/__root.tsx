/// <reference types="vite/client" />

import {
	HeadContent,
	Outlet,
	Scripts,
	useRouter,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

import appCss from '../styles/app.css?url';

import '@fontsource-variable/roboto';
import '@fontsource/poppins';
import '@fontsource/crimson-pro';
import '@fontsource/red-hat-mono';
import '@fontsource/red-hat-mono';
import '@fontsource-variable/rethink-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { NotFoundComponent } from '@/components/not-found';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import { Toaster } from '@/components/ui/sonner';
import { DICTIONARY } from '@/shared/dictionary';
import { CLIENT_ENV } from '@/shared/env.client';
import { seo } from '@/shared/seo';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		title: `${DICTIONARY.BRAND_NAME} ${DICTIONARY.SEO_POSTFIX}`,
		links: [{ rel: 'stylesheet', href: appCss }],
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				name: 'robots',
				content:
					'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
			},
			...seo({
				title: `${DICTIONARY.BRAND_NAME} ${DICTIONARY.SEO_POSTFIX}`,
				description: `${DICTIONARY.DEFAULT_PAGE_DESCRIPTION}`,
				url: CLIENT_ENV.VITE_BASE_URL,
			}),
		],
	}),
	component: RootComponent,
	notFoundComponent: () => {
		return <NotFoundComponent />;
	},
});

function RootComponent() {
	const router = useRouter();
	const { queryClient } = router.options.context;

	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<RootDocument>
					<Outlet />
					{/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
					<TanStackRouterDevtools position="bottom-right" />
				</RootDocument>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<ThemeScript cookieName="theme" defaultTheme="system" />
			</head>
			<body>
				<Toaster />
				{children}
				<Scripts />
			</body>
		</html>
	);
}
