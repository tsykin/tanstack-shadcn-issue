import { Link, useRouter } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { useSession } from '@/features/auth/client';
import { createPost } from '@/features/post/actions';

export function PostsHeader() {
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

		if (postContent.length > 500) {
			toast.error('Post must be less than 500 characters');
			return;
		}

		setIsSubmitting(true);
		try {
			await createPost({
				data: {
					content: postContent,
				},
			});
			setPostContent('');
			setIsDialogOpen(false);
			await router.invalidate();
			toast.success('Post created successfully!');
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

	return (
		<>
			{session?.user?.id ? (
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
									{isSubmitting ? 'Posting...' : 'Post'}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			) : (
				<div className="flex gap-2">
					<Button asChild variant="outline">
						<Link to="/login">Login</Link>
					</Button>
					<Button asChild>
						<Link to="/register">Sign Up</Link>
					</Button>
				</div>
			)}
		</>
	);
}
