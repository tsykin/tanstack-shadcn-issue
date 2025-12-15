import { run } from '@mdx-js/mdx';
import { Fragment, useEffect, useMemo, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import {
	a,
	blockquote,
	code,
	del,
	em,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	hr,
	img,
	li,
	ol,
	p,
	pre,
	strong,
	table,
	tbody,
	td,
	th,
	thead,
	tr,
	ul,
} from '@/components/markdown/base';

const baseComponents = {
	Accordion,
	YouTubeVideo,
	Quiz,
	a,
	ul,
	ol,
	li,
	blockquote,
	code,
	pre,
	img,
	hr,
	table,
	thead,
	tbody,
	tr,
	th,
	td,
	strong,
	em,
	del,
	Callout,
};
import '@/components/markdown/code-highlighting.css';
import {
	Accordion,
	Callout,
	Quiz,
	YouTubeVideo,
} from '@/components/markdown/custom';

// Cache compiled components to avoid re-running on re-renders
const componentCache = new Map<string, React.ComponentType>();

function buildComponents(isSmallFont?: boolean) {
	return {
		...baseComponents,
		h1: (props: Parameters<typeof h1>[0]) => h1({ ...props, isSmallFont }),
		h2: (props: Parameters<typeof h2>[0]) => h2({ ...props, isSmallFont }),
		h3: (props: Parameters<typeof h3>[0]) => h3({ ...props, isSmallFont }),
		h4: (props: Parameters<typeof h4>[0]) => h4({ ...props, isSmallFont }),
		h5: (props: Parameters<typeof h5>[0]) => h5({ ...props, isSmallFont }),
		h6: (props: Parameters<typeof h6>[0]) => h6({ ...props, isSmallFont }),
		p: (props: Parameters<typeof p>[0]) => p({ ...props, isSmallFont }),
		ul: (props: Parameters<typeof ul>[0]) => ul({ ...props, isSmallFont }),
		ol: (props: Parameters<typeof ol>[0]) => ol({ ...props, isSmallFont }),
		li: (props: Parameters<typeof li>[0]) => li({ ...props, isSmallFont }),
	};
}

export function MarkdownWrapper({
	compiledMDX,
	isSmallFont,
}: {
	compiledMDX: string | null;
	isSmallFont?: boolean;
}) {
	const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
		null
	);
	const [compilationError, setCompilationError] = useState<string | null>(null);

	useEffect(() => {
		if (!compiledMDX) {
			setMDXContent(null);
			setCompilationError(null);
			return;
		}

		// At this point compiledMDX is guaranteed to be non-null
		const mdxString = compiledMDX;

		// Check cache first
		const cached = componentCache.get(mdxString);
		if (cached) {
			setMDXContent(() => cached);
			return;
		}

		async function compileMDX() {
			try {
				setCompilationError(null);
				// Run the compiled MDX to get a React component
				const { default: Component } = await run(mdxString, {
					...runtime,
					Fragment,
				});

				// Cache the component
				componentCache.set(mdxString, Component);
				setMDXContent(() => Component);
			} catch (err) {
				console.error('Error running MDX:', err);
				setCompilationError(
					err instanceof Error ? err.message : 'Failed to compile MDX'
				);
			}
		}

		compileMDX();
	}, [compiledMDX]);

	const mdxComponents = useMemo(
		() => buildComponents(isSmallFont),
		[isSmallFont]
	);

	if (compilationError) {
		return (
			<div className="flex min-h-[200px] items-center justify-center">
				<div className="text-primary">Error: {compilationError}</div>
			</div>
		);
	}

	if (!MDXContent) {
		return null;
	}

	return (
		<div className="space-y-4">
			<MDXContent
				// @ts-expect-error - MDX component accepts components prop
				components={mdxComponents}
			/>
		</div>
	);
}
