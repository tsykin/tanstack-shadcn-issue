import { Link, useLocation } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { RoutePath } from '@/shared/types';

export function NavBar() {
	type NavLink = {
		href: RoutePath;
		title: string;
	};

	const links: NavLink[] = [
		{
			href: '/',
			title: 'Homepage',
		},
	];

	const location = useLocation();

	const aboutSections = [
		{ id: 'overview', title: 'Overview' },
		{ id: 'mission', title: 'Our Mission' },
		{ id: 'values', title: 'Our Values' },
		{ id: 'contact', title: 'Contact Us' },
	];

	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<div className="mx-auto mt-6 flex max-w-6xl rounded-xl border p-4">
			<div className="flex w-full flex-row items-center justify-between gap-10">
				<div className="flex flex-row gap-10">
					{links.map((link, index) => (
						<Link to={link.href} key={index}>
							{link.title}
						</Link>
					))}
					{aboutSections.map((section) => (
						<a
							key={section.id}
							href={`/#${section.id}`}
							className="transition-colors hover:text-primary"
						>
							{section.title}
						</a>
					))}
				</div>
				{
					<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<MenuIcon className="size-4" />
								<span className="sr-only">Open navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<SheetHeader>
								<SheetTitle>Page Navigation</SheetTitle>
							</SheetHeader>
							<nav className="mt-6 flex flex-col gap-2">
								{aboutSections.map((section) => (
									<a
										key={section.id}
										href={`/#${section.id}`}
										onClick={() => setSheetOpen(false)}
										className="rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
									>
										{section.title}
									</a>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				}
			</div>
		</div>
	);
}
