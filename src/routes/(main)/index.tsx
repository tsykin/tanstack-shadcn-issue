import { createFileRoute, useRouter } from '@tanstack/react-router';
import { PostsFeed } from '@/components/post/feed';
import { PostsHeader } from '@/components/post/posts-header';
import { SectionWrapper } from '@/components/wrappers';
import { getPosts } from '@/features/post/actions';
import { DICTIONARY } from '@/shared/dictionary';
import { CLIENT_ENV } from '@/shared/env.client';
import { seo } from '@/shared/seo';

export const Route = createFileRoute('/(main)/')({
	component: RouteComponent,
	loader: async () => {
		const posts = await getPosts({ data: { limit: 10 } });
		return { posts };
	},
	head: () => {
		const url = `${CLIENT_ENV.VITE_BASE_URL}/`;
		return {
			meta: [
				...seo({
					title: `Home ${DICTIONARY.SEO_POSTFIX}`,
					url,
				}),
			],
			links: [{ rel: 'canonical', href: url }],
		};
	},
});

function RouteComponent() {
	const { posts } = Route.useLoaderData();
	const router = useRouter();

	const handleUpdate = async () => {
		await router.invalidate();
	};

	return (
		<>
			<SectionWrapper
				paddingB="sm"
				title="Global Feed"
				headerActions={<PostsHeader />}
				isH1
			/>
			<SectionWrapper paddingT="none">
				<PostsFeed posts={posts} onUpdate={handleUpdate} />
			</SectionWrapper>
		</>
	);
}
