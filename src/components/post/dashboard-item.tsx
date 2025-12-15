import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPosts } from '@/features/post/actions';

type Post = Awaited<ReturnType<typeof getPosts>>[0];

interface DashboardPostItemProps {
	post: Post;
}

export function DashboardPostItem({ post }: DashboardPostItemProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarImage src={post.user?.image || undefined} />
					<AvatarFallback>
						{post.user?.name?.charAt(0).toUpperCase() || 'U'}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<div className="font-semibold">{post.user?.name || 'Anonymous'}</div>
					<div className="text-muted-foreground text-sm">
						{new Date(post.createdAt)
							.toISOString()
							.slice(0, 16)
							.replace('T', ' ')}
					</div>
				</div>
			</div>
			<p className="whitespace-pre-wrap break-words">{post.content}</p>
		</div>
	);
}
