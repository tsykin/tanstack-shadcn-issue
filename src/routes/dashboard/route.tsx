import {
	createFileRoute,
	Outlet,
	redirect,
	useLoaderData,
} from '@tanstack/react-router';
import { AlertNotAdmin } from '@/components/dashboard/alerts';
import { AppSidebar } from '@/components/dashboard/sidebar';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { userRoleValues } from '@/db/types';
import { getUserSession } from '@/features/auth/server';

export const Route = createFileRoute('/dashboard')({
	component: Page,
	loader: async () => {
		const session = await getUserSession();
		if (!session) {
			throw redirect({ to: '/login' });
		}
		const authSession = await getUserSession();
		return { authSession };
	},
});

function Page() {
	const { authSession } = Route.useLoaderData();
	if (!authSession) {
		return <AlertNotAdmin />;
	}
	return (
		<SidebarProvider>
			<AppSidebar session={authSession} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger />
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
