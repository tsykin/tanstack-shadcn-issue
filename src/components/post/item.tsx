import { Link, useRouter } from '@tanstack/react-router';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/features/auth/client';
import { createPost, getPosts, toggleLike } from '@/features/post/actions';

type Post = Awaited<ReturnType<typeof getPosts>>[0];

interface PostCardProps {
	post: Post;
	onUpdate?: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const [isReplying, setIsReplying] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [isSubmittingReply, setIsSubmittingReply] = useState(false);
	const [isLiking, setIsLiking] = useState(false);

	const userLike = post.likes?.find(
		(like) => like.userId === session?.user?.id
	);
	const likeCount =
		post.likes?.filter((like) => like.type === 'like').length || 0;
	const dislikeCount =
		post.likes?.filter((like) => like.type === 'dislike').length || 0;
	const isOwnPost = post.userId === session?.user?.id;

	const handleLike = async (type: 'like' | 'dislike') => {
		if (!session?.user?.id) {
			toast.error('Please login to like posts');
			return;
		}

		setIsLiking(true);
		try {
			await toggleLike({
				data: {
					postId: post.id,
					type,
				},
			});
			await router.invalidate();
			onUpdate?.();
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to ${type}: ${error.message}`);
			} else {
				toast.error(`Failed to ${type}`);
			}
		} finally {
			setIsLiking(false);
		}
	};

	const handleReply = async () => {
		if (!session?.user?.id) {
			toast.error('Please login to reply');
			return;
		}

		if (!replyContent.trim()) {
			toast.error('Reply cannot be empty');
			return;
		}

		setIsSubmittingReply(true);
		try {
			await createPost({
				data: {
					content: replyContent,
					parentPostId: post.id,
				},
			});
			setReplyContent('');
			setIsReplying(false);
			await router.invalidate();
			onUpdate?.();
			toast.success('Reply posted!');
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to post reply: ${error.message}`);
			} else {
				toast.error('Failed to post reply');
			}
		} finally {
			setIsSubmittingReply(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={post.user?.image || undefined} />
						<AvatarFallback>
							{post.user?.name?.charAt(0).toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="font-semibold">
							{post.user?.name || 'Anonymous'}
						</div>
						<CardDescription>
							{new Date(post.createdAt)
								.toISOString()
								.slice(0, 16)
								.replace('T', ' ')}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="whitespace-pre-wrap break-words">{post.content}</p>
			</CardContent>
			<CardFooter className="flex flex-col gap-4">
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Button
							variant={userLike?.type === 'like' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => handleLike('like')}
							disabled={isLiking}
						>
							<ThumbsUp className="h-4 w-4" />
							{likeCount > 0 && <span className="ml-1">{likeCount}</span>}
						</Button>
						<Button
							variant={userLike?.type === 'dislike' ? 'destructive' : 'ghost'}
							size="sm"
							onClick={() => handleLike('dislike')}
							disabled={isLiking}
						>
							<ThumbsDown className="h-4 w-4" />
							{dislikeCount > 0 && <span className="ml-1">{dislikeCount}</span>}
						</Button>
					</div>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/post/$postId" params={{ postId: post.id }}>
							<MessageCircle className="h-4 w-4" />
							{post.replies?.length > 0 && (
								<span className="ml-1">{post.replies.length}</span>
							)}
						</Link>
					</Button>
				</div>

				{isReplying && (
					<div className="w-full space-y-2">
						<Textarea
							placeholder="Write a reply..."
							value={replyContent}
							onChange={(e) => setReplyContent(e.target.value)}
							className="min-h-[100px]"
							maxLength={500}
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsReplying(false);
									setReplyContent('');
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleReply}
								disabled={isSubmittingReply || !replyContent.trim()}
							>
								{isSubmittingReply ? 'Posting...' : 'Reply'}
							</Button>
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
