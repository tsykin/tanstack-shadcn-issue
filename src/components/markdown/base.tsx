import { LinkIcon } from 'lucide-react';
import React, { useState } from 'react';
import slugify from 'slugify';
import { A, CodeBlock } from '@/components/markdown/custom';

// Helper to extract plain text from any React node structure
function toPlainText(node: React.ReactNode): string {
	if (node == null) return '';
	if (typeof node === 'string' || typeof node === 'number') return String(node);
	if (Array.isArray(node)) return node.map(toPlainText).join(' ');
	// Handle React elements by traversing their children
	if (typeof node === 'object' && 'props' in (node as any)) {
		return toPlainText((node as any).props?.children);
	}
	return '';
}

function makeSlug(children: React.ReactNode): string {
	const text = toPlainText(children).trim();
	if (!text) return '';
	return slugify(text, { lower: true, strict: true });
}

// Headings
interface HeadingProps {
	children: React.ReactNode;
	isSmallFont?: boolean;
}

const headerVariants = [
	{
		level: 1,
		styles: 'text-4xl font-bold',
		smallStyles: 'text-xl font-bold',
	},
	{
		level: 2,
		styles: 'text-3xl font-bold',
		smallStyles: 'text-lg font-bold',
	},
	{
		level: 3,
		styles: 'text-2xl font-semibold',
		smallStyles: 'text-lg font-bold',
	},
	{
		level: 4,
		styles: 'text-xl font-semibold',
		smallStyles: 'text-lg font-bold',
	},
	{
		level: 5,
		styles: 'text-lg font-semibold',
		smallStyles: 'text-lg font-bold',
	},
	{
		level: 6,
		styles: 'text-base font-medium',
		smallStyles: 'text-lg font-bold',
	},
];

export const LinkedHeader = ({
	level = 2,
	slug,
	children,
	isSmallFont,
}: {
	level: number;
	slug: string;
	children: React.ReactNode;
	isSmallFont?: boolean;
}) => {
	const [isHovered, setIsHovered] = useState(false);

	// Find the corresponding styles for the specified header level
	const headerVariant = headerVariants.find(
		(variant) => variant.level === level
	);

	const baseStyles = headerVariant
		? headerVariant.styles
		: 'text-2xl font-bold';
	const smallStyles = headerVariant
		? headerVariant.smallStyles
		: 'text-lg font-semibold';
	const headerStyles = isSmallFont ? smallStyles : baseStyles;

	// Determine the correct heading tag based on the level
	const HeadingTag = `h${Math.max(1, Math.min(6, level))}` as
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6';

	const marginClass = isSmallFont ? 'mt-4 mb-2' : 'mt-8 mb-4';

	return (
		<div
			className={`${marginClass} flex flex-row items-center gap-3`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{React.createElement(
				HeadingTag,
				{ className: headerStyles, id: slug },
				children
			)}
			<a
				href={`#${slug}`}
				className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
				aria-label="Link to heading"
			>
				<LinkIcon size={20} className="text-primary" />
			</a>
		</div>
	);
};

export function h1({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={1} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

export function h2({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={2} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

export function h3({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={3} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

export function h4({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={4} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

export function h5({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={5} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

export function h6({ children, isSmallFont }: HeadingProps) {
	const slug = makeSlug(children);
	return (
		<LinkedHeader level={6} slug={slug} isSmallFont={isSmallFont}>
			{children}
		</LinkedHeader>
	);
}

// Paragraph
interface ParagraphProps {
	children: React.ReactNode;
	isSmallFont?: boolean;
}

export function p({ children, isSmallFont }: ParagraphProps) {
	const normalClass = 'my-3 leading-relaxed';
	const smallClass = 'my-3 leading-relaxed !text-sm';
	return <p className={isSmallFont ? smallClass : normalClass}>{children}</p>;
}

// Anchor
export function a({ href, children, ...props }: any) {
	const isExternal = href?.startsWith('http');
	return (
		<A href={href} {...props}>
			{children}
		</A>
	);
}

// Lists
interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
	children?: React.ReactNode;
	isSmallFont?: boolean;
}

interface OrderedListProps extends React.OlHTMLAttributes<HTMLOListElement> {
	children?: React.ReactNode;
	isSmallFont?: boolean;
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	children?: React.ReactNode;
	isSmallFont?: boolean;
}

export function ul({ children, className, isSmallFont, ...props }: ListProps) {
	const baseClass = 'list-disc pl-4';
	const smallClass = 'list-disc pl-4 text-sm leading-relaxed';
	return (
		<ul
			className={`${isSmallFont ? smallClass : baseClass}${className ? ` ${className}` : ''}`}
			{...props}
		>
			{children}
		</ul>
	);
}

export function ol({
	children,
	className,
	isSmallFont,
	...props
}: OrderedListProps) {
	const baseClass = 'my-4 list-decimal pl-6';
	const smallClass = 'my-3 list-decimal pl-5 text-sm leading-relaxed';
	return (
		<ol
			className={`${isSmallFont ? smallClass : baseClass}${className ? ` ${className}` : ''}`}
			{...props}
		>
			{children}
		</ol>
	);
}

export function li({
	children,
	className,
	isSmallFont,
	...props
}: ListItemProps) {
	const baseClass = 'my-3';
	const smallClass = 'my-2 text-sm';
	return (
		<li
			className={`${isSmallFont ? smallClass : baseClass}${className ? ` ${className}` : ''}`}
			{...props}
		>
			{children}
		</li>
	);
}

// Blockquote
export function blockquote({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<blockquote
			className="rounded-r border-gray-300 border-l-4 bg-gray-50 py-1 pl-4 italic dark:border-gray-600 dark:bg-gray-800/50"
			{...props}
		>
			{children}
		</blockquote>
	);
}

// Code (inline) and Pre (code blocks)
export function code({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<code
			className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800"
			{...props}
		>
			{children}
		</code>
	);
}

type PreProps = {
	children?: React.ReactNode;
	filename?: string;
};

// Type guard to check if a React node has props with className
function hasClassNameProp(
	node: React.ReactNode
): node is React.ReactElement<{ className: string }> {
	return (
		React.isValidElement(node) &&
		typeof node.props === 'object' &&
		node.props !== null &&
		'className' in node.props &&
		typeof node.props.className === 'string'
	);
}

export function pre(props: PreProps) {
	// Handle potential null/undefined children with proper type checking
	const className = hasClassNameProp(props.children)
		? props.children.props.className
		: '';
	const codeLanguage = className ? className.split('-')[1] : '';
	const filename = props.filename;
	return (
		<CodeBlock filename={filename} language={codeLanguage}>
			{props.children}
		</CodeBlock>
	);
}

// Image
export function img({
	src = '',
	alt = '',
	...props
}: {
	src?: string;
	alt?: string;
	[key: string]: any;
}) {
	return (
		<img
			src={src}
			alt={alt}
			title={alt}
			className="my-4 h-auto max-w-full rounded-lg"
			{...props}
		/>
	);
}

// Horizontal rule
export function hr(props: any) {
	return (
		<hr
			className="my-8 border-gray-200 border-t dark:border-gray-700"
			{...props}
		/>
	);
}

// Tables
export function table({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<div className="my-4 w-full overflow-x-auto">
			<table className="w-full border-collapse" {...props}>
				{children}
			</table>
		</div>
	);
}

export function thead({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<thead className="bg-gray-50 dark:bg-gray-800/60" {...props}>
			{children}
		</thead>
	);
}

export function tbody({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return <tbody {...props}>{children}</tbody>;
}

export function tr({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<tr className="border-gray-200 border-b dark:border-gray-700" {...props}>
			{children}
		</tr>
	);
}

export function th({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<th className="px-3 py-2 text-left align-top font-semibold" {...props}>
			{children}
		</th>
	);
}

export function td({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<td className="px-3 py-2 align-top" {...props}>
			{children}
		</td>
	);
}

// Inline text semantics
export function strong({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<strong className="font-semibold" {...props}>
			{children}
		</strong>
	);
}

export function em({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<em className="italic" {...props}>
			{children}
		</em>
	);
}

export function del({
	children,
	...props
}: {
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<del className="line-through" {...props}>
			{children}
		</del>
	);
}
