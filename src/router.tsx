import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from '@/components/default-catch-boundary';
import { NotFoundComponent } from '@/components/not-found';
import { routeTree } from '@/routeTree.gen';

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: false,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFoundComponent />,
		scrollRestoration: true,
		scrollToTopSelectors: ['#top'],
	});

	return router;
}
declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
