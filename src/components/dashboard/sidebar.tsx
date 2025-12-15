import { Link, useLocation } from '@tanstack/react-router';
import {
	ArrowLeft,
	Building2,
	Calendar,
	ChevronUp,
	CircleDotDashed,
	File,
	Hexagon,
	Home,
	Image,
	Inbox,
	ListOrdered,
	Lock,
	Search,
	Settings,
	SquircleDashed,
	Tag,
	Undo,
	User2,
	UserStar,
	Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { userRoleValues } from '@/db/types';
import { signOut } from '@/features/auth/client';
import { GetUserSessionResponse } from '@/features/auth/server';

const userItems = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: Home,
	},
];

const adminItems = [
	{
		title: 'Admin panel',
		url: '/dashboard/admin',
		icon: Lock,
	},
];

export function AppSidebar({ session }: { session: GetUserSessionResponse }) {
	const {
		state,
		open,
		setOpen,
		openMobile,
		setOpenMobile,
		isMobile,
		toggleSidebar,
	} = useSidebar();

	const location = useLocation();
	const pathname = location.pathname;

	const isAdmin = false;

	// Combine all menu items to check for exact matches
	const allMenuItems = [...userItems, ...(isAdmin ? adminItems : [])];

	function isActive(url: string): boolean {
		// Exact match is always active
		if (pathname === url) return true;

		// Check if there's a more specific menu item that matches exactly
		// If so, don't mark parent routes as active
		const hasExactMatch = allMenuItems.some((item) => item.url === pathname);

		// For parent routes, check if current path starts with the item URL + '/'
		// This allows /dashboard/admin to be active when on /dashboard/admin/queue
		// But only if there's no exact match (to avoid /dashboard being active on /dashboard/settings)
		if (!hasExactMatch && pathname.startsWith(`${url}/`)) return true;

		return false;
	}

	function handleLinkClick() {
		if (isMobile) {
			setOpenMobile(false);
		}
	}

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup className="flex h-16 shrink-0 items-center justify-center gap-2 border-b px-4">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<Link
										to="/"
										className="flex flex-row items-center gap-2"
										onClick={handleLinkClick}
									>
										<Undo />
										<span>Back to homepage</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{userItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={isActive(item.url)}>
										<Link to={item.url} onClick={handleLinkClick}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{isAdmin && (
					<SidebarGroup>
						<SidebarGroupLabel>Admin</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{adminItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive(item.url)}>
											<Link to={item.url} onClick={handleLinkClick}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 />
									{session?.user.name}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								{/* <DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Billing</span>
								</DropdownMenuItem> */}
								<DropdownMenuItem className="justify-center">
									<Button
										variant="destructive"
										onClick={() =>
											signOut({
												fetchOptions: {
													onSuccess: () => {
														window.location.href = '/login';
													},
												},
											})
										}
									>
										Log out
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
