import { Link } from '@tanstack/react-router';
import {
	Check,
	CircleX,
	Clipboard,
	LinkIcon,
	Pin,
	TriangleAlert,
} from 'lucide-react';
import React, { useState } from 'react';
import {
	AccordionContent,
	AccordionItem,
	Accordion as AccordionPrimitive,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// YouTube embed video component for MDX content
export function YouTubeVideo({ videoId }: { videoId: string }) {
	return (
		<div className="my-6">
			<div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
				<iframe
					className="absolute top-0 left-0 h-full w-full rounded-lg"
					src={`https://www.youtube.com/embed/${videoId}`}
					title="YouTube video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</div>
		</div>
	);
}

// Fallback component for missing components
export function FallbackComponent({
	componentName,
	children,
	...props
}: {
	componentName: string;
	children?: React.ReactNode;
	[key: string]: any;
}) {
	return (
		<div
			className="my-2 rounded border border-yellow-300 bg-yellow-100 p-3 dark:border-yellow-700 dark:bg-yellow-900/20"
			{...props}
		>
			<div className="mb-2 flex items-center gap-2">
				<span className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
					⚠️ Missing Component: {componentName}
				</span>
			</div>
			{children && (
				<div className="text-gray-700 dark:text-gray-300">{children}</div>
			)}
		</div>
	);
}

export type AccordionProps = {
	title: string;
	children: React.ReactNode;
};

export function Accordion({ title, children, ...props }: AccordionProps) {
	return (
		<div className="my-2 rounded-md border px-4">
			<AccordionPrimitive type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>{title}</AccordionTrigger>
					<AccordionContent>{children}</AccordionContent>
				</AccordionItem>
			</AccordionPrimitive>
		</div>
	);
}

export type CalloutProps = {
	children: React.ReactNode;
	variant: 'info' | 'success' | 'warning' | 'error';
};

const variantStyles = {
	info: 'bg-muted/20 border border-border text-foreground',
	success: 'bg-primary-muted border border-primary text-primary',
	warning: 'bg-muted/20 border border-border text-foreground',
	error: 'bg-primary-muted border border-destructive text-destructive',
};

export const Callout = ({ children, variant }: CalloutProps) => {
	if (!variant) {
		variant = 'info';
	}

	return (
		<div
			className={`my-2 flex items-center gap-4 rounded-lg border p-3.5 ${variantStyles[variant]}`}
		>
			<div className="flex items-center rounded-full bg-card-foreground/5 p-2">
				{!variant && <Pin size={24} />}
				{variant === 'info' && <Pin size={24} />}
				{variant === 'success' && <Check size={24} />}
				{variant === 'warning' && <TriangleAlert size={24} />}
				{variant === 'error' && <CircleX size={24} />}
			</div>
			<div className="text-base">{children}</div>
		</div>
	);
};

// Convert children to a string by mapping over the array and joining
const getNestedString = (children: any): any => {
	const childrenArray = React.Children.toArray(children);
	return childrenArray.reduce((code, child) => {
		if (typeof child === 'string' || typeof child === 'number') {
			return code + String(child); // Convert number to string
		} else if (React.isValidElement(child)) {
			// Type assertion to access children property safely
			const element = child as React.ReactElement<{
				children?: React.ReactNode;
			}>;
			return code + getNestedString(element.props.children);
		}
		return code;
	}, '');
};

export const CodeBlock = ({
	children,
	filename,
	language,
}: {
	children: any;
	filename?: string;
	language?: string;
}) => {
	const codeString = getNestedString(children.props.children);

	// State to manage the icon display
	const [icon, setIcon] = useState(<Clipboard />);

	const handleCopy = () => {
		navigator.clipboard.writeText(codeString);
		setIcon(<Check />); // Show OK icon

		// Reset icon back to Clipboard after 2 seconds
		setTimeout(() => {
			setIcon(<Clipboard />);
		}, 2000);
	};

	return (
		<div className="relative mt-4 font-mono">
			{filename && (
				<div className="inline-block rounded-t-lg border-border border-x border-t bg-card px-4 py-2 text-sm">
					{filename}
				</div>
			)}
			<div
				className={`relative rounded-lg border border-border bg-card p-4 ${filename ? 'rounded-tl-none' : ''}`}
			>
				<Button
					variant="ghost"
					onClick={handleCopy}
					className="absolute top-3 right-4 h-8 w-8 bg-background/50 hover:bg-background/80"
					size="icon"
					aria-label="Copy code"
				>
					{icon}
				</Button>
				<pre className="overflow-y-auto">{children.props.children}</pre>
			</div>
		</div>
	);
};

export const A = ({
	href,
	children,
	...props
}: {
	href?: string;
	children?: React.ReactNode;
	[key: string]: any;
}) => {
	const linkText = getNestedString(children);

	const isExternal = href && !href.startsWith('/') && !href.startsWith('#');
	const isScroll = href?.startsWith('#');

	const commonProps = {
		className: 'text-blue-500 hover:text-blue-700 font-medium hover:underline',
		...props,
	};

	// If the link is external, open it in a new tab
	if (isExternal) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
				{children}
			</a>
		);
	} else {
		return (
			<a href={href} {...commonProps}>
				{children}
			</a>
		);
	}
};

export type QuizProps = {
	question: string;
	options: string[];
	correctAnswer: string;
};

export const Quiz = ({ question, options, correctAnswer }) => {
	const [selectedOption, setSelectedOption] = useState<string | undefined>(
		undefined
	);
	const [showResult, setShowResult] = useState<boolean>(false);

	const handleOptionSelect = (option: string) => {
		setSelectedOption(option);
		setShowResult(false);
	};

	const handleSubmit = () => {
		setShowResult(true);
	};

	const renderResult = () => {
		if (showResult) {
			return (
				<div className="mt-4">
					{selectedOption === correctAnswer ? (
						<div className="flex flex-row items-center gap-1 text-foreground">
							<Check size={24} />
							<p className="font-semibold">Correct!</p>
						</div>
					) : (
						<div className="flex flex-row items-center gap-1 text-destructive">
							<CircleX size={24} />
							<p className="font-semibold">Incorrect, try again.</p>
						</div>
					)}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="my-4 rounded-md border border-muted bg-card p-4">
			<p className="mb-4 font-semibold text-xl">{question}</p>
			<RadioGroup
				value={selectedOption}
				onValueChange={handleOptionSelect}
				className="space-y-2"
			>
				{options.map((option) => (
					<div key={option} className="flex items-center space-x-2">
						<RadioGroupItem value={option} id={option} aria-label={option} />
						<Label htmlFor={option}>{option}</Label>
					</div>
				))}
			</RadioGroup>
			<Button
				type="button"
				onClick={handleSubmit}
				className="mt-4 w-full bg-primary transition duration-300 hover:bg-primary-hover"
			>
				Check your answer
			</Button>
			{renderResult()}
		</div>
	);
};
