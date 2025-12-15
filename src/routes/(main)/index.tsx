import { createFileRoute } from '@tanstack/react-router';
import { DICTIONARY } from '@/shared/dictionary';
import { CLIENT_ENV } from '@/shared/env.client';
import { seo } from '@/shared/seo';

export const Route = createFileRoute('/(main)/')({
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
			<div className="bg-background" id="overview">
				<div className="container mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-12 md:pt-16 md:pb-16">
					<div className="flex w-full flex-col">
						<section className="flex flex-col pt-0 pb-8">
							<div className="w-full">
								<div className="flex flex-col gap-2 md:flex-row md:items-center">
									<div className="flex w-full flex-col items-start gap-3 text-left">
										<h1 className="font-regular text-2xl tracking-tight md:text-4xl">
											{h1}
										</h1>
									</div>
								</div>
							</div>
						</section>
						<div className="max-w-3xl">
							<div className="prose prose-invert max-w-none space-y-6 text-left">
								<p className="leading-relaxed">
									Welcome to our platform. We are dedicated to providing the
									best experience for our users.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-background" id="mission">
				<div className="container mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-12 md:pt-16 md:pb-16">
					<div className="flex w-full flex-col">
						<section className="flex flex-col pt-0 pb-8">
							<div className="w-full">
								<div className="flex flex-col gap-2 md:flex-row md:items-center">
									<div className="flex w-full flex-col items-start gap-3 text-left">
										<h2 className="font-regular text-2xl tracking-tight md:text-4xl">
											Our Mission
										</h2>
									</div>
								</div>
							</div>
						</section>
						<div className="max-w-3xl">
							<div className="prose prose-invert max-w-none space-y-6 text-left">
								<p className="leading-relaxed">
									Our mission is to create innovative solutions that make a
									difference in people's lives. We believe in the power of
									technology to transform the world.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-background" id="values">
				<div className="container mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-12 md:pt-16 md:pb-16">
					<div className="flex w-full flex-col">
						<section className="flex flex-col pt-0 pb-8">
							<div className="w-full">
								<div className="flex flex-col gap-2 md:flex-row md:items-center">
									<div className="flex w-full flex-col items-start gap-3 text-left">
										<h2 className="font-regular text-2xl tracking-tight md:text-4xl">
											Our Values
										</h2>
									</div>
								</div>
							</div>
						</section>
						<div className="max-w-3xl">
							<div className="prose prose-invert max-w-none space-y-6 text-left">
								<p className="leading-relaxed">
									We value integrity, innovation, and excellence in everything
									we do. These core principles guide our decisions and actions
									every day.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-background" id="contact">
				<div className="container mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-12 md:pt-16 md:pb-16">
					<div className="flex w-full flex-col">
						<section className="flex flex-col pt-0 pb-8">
							<div className="w-full">
								<div className="flex flex-col gap-2 md:flex-row md:items-center">
									<div className="flex w-full flex-col items-start gap-3 text-left">
										<h2 className="font-regular text-2xl tracking-tight md:text-4xl">
											Contact Us
										</h2>
									</div>
								</div>
							</div>
						</section>
						<div className="max-w-3xl">
							<div className="prose prose-invert max-w-none space-y-6 text-left">
								<p className="leading-relaxed">
									Have questions or want to get in touch? We'd love to hear from
									you. Reach out to us through our contact form or email.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
