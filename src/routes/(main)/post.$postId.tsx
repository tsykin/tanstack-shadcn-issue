import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { PostDetail } from '@/components/post/detail';
import { SectionWrapper } from '@/components/wrappers';
import { getPost } from '@/features/post/actions';
import { DICTIONARY } from '@/shared/dictionary';
import { CLIENT_ENV } from '@/shared/env.client';
import { seo } from '@/shared/seo';

export const Route = createFileRoute('/(main)/post/$postId')({
	component: Page,
	loader: async ({ params }) => {
		const post = await getPost({ data: { id: params.postId } });
		return { post };
	},
	head: ({ loaderData, params }) => {
		if (!loaderData) {
			return {
				meta: [
					...seo({
						title: `Post ${DICTIONARY.SEO_POSTFIX}`,
						url: `${CLIENT_ENV.VITE_BASE_URL}/post/${params.postId}`,
					}),
				],
			};
		}
		const { post } = loaderData;
		const url = `${CLIENT_ENV.VITE_BASE_URL}/post/${params.postId}`;
		const content = post.content.slice(0, 160);
		return {
			meta: [
				...seo({
					title: `Post by ${post.user.name} ${DICTIONARY.SEO_POSTFIX}`,
					description: content,
					url,
				}),
			],
			links: [{ rel: 'canonical', href: url }],
		};
	},
});

function Page() {
	const { post } = Route.useLoaderData();

	return (
		<SectionWrapper>
			<div className="space-y-6">
				<Link
					to="/"
					className="flex flex-row items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
				>
					<ArrowLeft />
					Back to posts
				</Link>
				<PostDetail post={post} />
			</div>
		</SectionWrapper>
	);
}
