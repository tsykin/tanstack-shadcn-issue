import { PostCard } from '@/components/post/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPosts } from '@/features/post/actions';

type Posts = Awaited<ReturnType<typeof getPosts>>;

interface PostsFeedProps {
	posts: Posts;
	onUpdate?: () => void;
}

export function PostsFeed({ posts, onUpdate }: PostsFeedProps) {
	return (
		<div className="space-y-4">
			{posts && posts.length > 0 ? (
				posts.map((post) => (
					<PostCard key={post.id} post={post} onUpdate={onUpdate} />
				))
			) : (
				<Card>
					<CardHeader>
						<CardTitle>No posts yet</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Be the first to share your thoughts!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
