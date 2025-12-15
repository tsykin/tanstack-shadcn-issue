import fs from 'node:fs/promises';
import { compile } from '@mdx-js/mdx';
import { createServerFn } from '@tanstack/react-start';
import rehypeHighlight from 'rehype-highlight'; // Code block syntax highlighting
import rehypeMdxCodeProps from 'rehype-mdx-code-props'; // Interpret markdown code block metadata as JSX props.
import remarkGfm from 'remark-gfm'; // Tables, footnotes, strikethrough, task lists, literal URLs.

const sampleMarkdown = 'public/markdown.mdx';

export const getSampleMarkdown = createServerFn({
	method: 'GET',
}).handler(async () => {
	const rawMarkdown = await fs.readFile(sampleMarkdown, 'utf-8');
	return String(rawMarkdown);
});

export const compileMarkdown = createServerFn({
	method: 'POST',
})
	.inputValidator((input: string | null | undefined) => input ?? null)
	.handler(async ({ data: input }) => {
		if (!input) {
			return null;
		}
		const markdownString = String(input);

		const compiled = await compile(markdownString, {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [rehypeHighlight, rehypeMdxCodeProps],
			outputFormat: 'function-body',
			development: false,
		});

		return String(compiled);
	});
