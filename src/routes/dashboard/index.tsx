import { createFileRoute, useRouter } from '@tanstack/react-router';
import { LoaderCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardPosts } from '@/components/dashboard/posts';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { SectionWrapper } from '@/components/wrappers';
import { useSession } from '@/features/auth/client';
import { getUserSession } from '@/features/auth/server';
import { createPost, getPosts } from '@/features/post/actions';

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	loader: async () => {
		const session = await getUserSession();
		const myPosts = await getPosts({
			data: {
				limit: 10,
				userId: session?.user?.id,
			},
		});
		return { myPosts };
	},
});

function RouteComponent() {
	const { myPosts } = Route.useLoaderData();
	const { data: session } = useSession();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [postContent, setPostContent] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCreatePost = async () => {
		if (!session?.user?.id) {
			toast.error('Please login to create a post');
			return;
		}

		if (!postContent.trim()) {
			toast.error('Post content cannot be empty');
			return;
		}

		setIsSubmitting(true);
		try {
			await createPost({
				data: {
					content: postContent,
				},
			});

			toast.success('Post created successfully!');
			setPostContent('');
			setIsDialogOpen(false);
			await router.invalidate();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to create post: ${error.message}`);
			} else {
				toast.error('Failed to create post');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const newPostButton = (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					New Post
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Post</DialogTitle>
					<DialogDescription>
						Share your thoughts with the community (max 500 characters)
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Textarea
						placeholder="What's on your mind?"
						value={postContent}
						onChange={(e) => setPostContent(e.target.value)}
						className="min-h-[150px]"
						maxLength={500}
					/>
					<div className="flex justify-between text-muted-foreground text-sm">
						<span>{postContent.length}/500 characters</span>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(false);
								setPostContent('');
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreatePost}
							disabled={isSubmitting || !postContent.trim()}
						>
							{isSubmitting ? (
								<>
									<LoaderCircle className="animate-spin" />
									Posting...
								</>
							) : (
								'Post'
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);

	return (
		<SectionWrapper
			width="4xl"
			title="My Posts"
			description={`Welcome back, ${session?.user?.name || 'User'}!`}
			headerActions={newPostButton}
			titleSize="3xl"
			isH1
		>
			<DashboardPosts myPosts={myPosts} />
		</SectionWrapper>
	);
}
