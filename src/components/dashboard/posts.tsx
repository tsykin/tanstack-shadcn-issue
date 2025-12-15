import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardPostItem } from '@/components/post/dashboard-item';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { deletePost, getPosts, updatePost } from '@/features/post/actions';

type Posts = Awaited<ReturnType<typeof getPosts>>;

interface DashboardPostsProps {
	myPosts: Posts;
}

export function DashboardPosts({ myPosts }: DashboardPostsProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingPostId, setEditingPostId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState('');

	const handleEditPost = async (postId: string) => {
		if (!editContent.trim()) {
			toast.error('Post content cannot be empty');
			return;
		}

		setIsSubmitting(true);
		try {
			await updatePost({
				data: {
					id: postId,
					content: editContent,
				},
			});

			toast.success('Post updated successfully!');
			setEditingPostId(null);
			setEditContent('');
			await router.invalidate();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to update post: ${error.message}`);
			} else {
				toast.error('Failed to update post');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeletePost = async (postId: string) => {
		if (!confirm('Are you sure you want to delete this post?')) {
			return;
		}

		setIsSubmitting(true);
		try {
			await deletePost({
				data: {
					id: postId,
				},
			});

			toast.success('Post deleted successfully!');
			await router.invalidate();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to delete post: ${error.message}`);
			} else {
				toast.error('Failed to delete post');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			{myPosts.length > 0 ? (
				myPosts.map((post) => (
					<Card key={post.id} className="relative">
						{editingPostId === post.id ? (
							<CardContent className="space-y-4 pt-6">
								<Textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									className="min-h-[100px]"
									maxLength={500}
								/>
								<div className="flex justify-between text-muted-foreground text-sm">
									<span>{editContent.length}/500 characters</span>
								</div>
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setEditingPostId(null);
											setEditContent('');
										}}
									>
										Cancel
									</Button>
									<Button
										size="sm"
										onClick={() => handleEditPost(post.id)}
										disabled={isSubmitting || !editContent.trim()}
									>
										{isSubmitting ? 'Saving...' : 'Save'}
									</Button>
								</div>
							</CardContent>
						) : (
							<>
								<CardHeader>
									<DashboardPostItem post={post} />
								</CardHeader>
								<CardFooter className="flex justify-end gap-2 border-t">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setEditingPostId(post.id);
											setEditContent(post.content);
										}}
									>
										Edit
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDeletePost(post.id)}
										disabled={isSubmitting}
									>
										Delete
									</Button>
								</CardFooter>
							</>
						)}
					</Card>
				))
			) : (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-muted-foreground">
							No posts yet. Create your first post!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
