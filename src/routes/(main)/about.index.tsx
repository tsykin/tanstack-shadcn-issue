import { createFileRoute } from '@tanstack/react-router';
import { SectionWrapper } from '@/components/wrappers';
import { DICTIONARY } from '@/shared/dictionary';
import { customDecrypt, customEncrypt } from '@/shared/encrypt';
import { CLIENT_ENV } from '@/shared/env.client';
import { seo } from '@/shared/seo';

export const Route = createFileRoute('/(main)/about/')({
	component: Page,
	loader: async () => {},
	head: () => {
		const url = `${CLIENT_ENV.VITE_BASE_URL}/about`;
		return {
			meta: [
				...seo({
					title: `About ${DICTIONARY.SEO_POSTFIX}`,
				}),
			],
			links: [{ rel: 'canonical', href: url }],
		};
	},
});

function Page() {
	const h1 = `About ${DICTIONARY.BRAND_NAME}`;
	return (
		<>
			<SectionWrapper title={h1} align="left" isH1 cssId="overview">
				<div className="max-w-3xl">
					<div className="prose prose-invert max-w-none space-y-6 text-left">
						<p className="leading-relaxed">
							Welcome to our platform. We are dedicated to providing the best
							experience for our users.
						</p>
					</div>
				</div>
			</SectionWrapper>
			<SectionWrapper title="Our Mission" align="left" cssId="mission">
				<div className="max-w-3xl">
					<div className="prose prose-invert max-w-none space-y-6 text-left">
						<p className="leading-relaxed">
							Our mission is to create innovative solutions that make a
							difference in people's lives. We believe in the power of
							technology to transform the world.
						</p>
					</div>
				</div>
			</SectionWrapper>
			<SectionWrapper title="Our Values" align="left" cssId="values">
				<div className="max-w-3xl">
					<div className="prose prose-invert max-w-none space-y-6 text-left">
						<p className="leading-relaxed">
							We value integrity, innovation, and excellence in everything we
							do. These core principles guide our decisions and actions every
							day.
						</p>
					</div>
				</div>
			</SectionWrapper>
			<SectionWrapper title="Contact Us" align="left" cssId="contact">
				<div className="max-w-3xl">
					<div className="prose prose-invert max-w-none space-y-6 text-left">
						<p className="leading-relaxed">
							Have questions or want to get in touch? We'd love to hear from
							you. Reach out to us through our contact form or email.
						</p>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
