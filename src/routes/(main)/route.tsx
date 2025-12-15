import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Footer } from '@/components/footer';
import { NavBar } from '@/components/navbar';

export const Route = createFileRoute('/(main)')({
	component: MainLayout,
});

function MainLayout() {
	return (
		<main id="top">
			<NavBar />
			{/* <Breadcrumbs /> */}
			<Outlet />
			<Footer />
		</main>
	);
}
