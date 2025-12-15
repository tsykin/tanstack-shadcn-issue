import React from 'react';

interface SectionWrapperProps {
	width?: 'container' | 'full' | '2xl' | 'md' | '4xl' | '6xl';
	paddingT?: 'default' | 'md' | 'sm' | 'none' | 'big';
	paddingB?: 'default' | 'md' | 'sm' | 'none' | 'big';
	children?: React.ReactNode;
	cssId?: string;
	// Header props - if provided, SectionHeader will be rendered automatically
	title?: string;
	description?: string;
	headerActions?: React.ReactNode;
	isH1?: boolean;
	align?: 'left' | 'center' | 'right';
	titleSize?: 'default' | 'lg' | 'xl' | '2xl' | '3xl';
	headerPaddingT?: 'default' | 'md' | 'sm' | 'none' | 'big';
	headerPaddingB?: 'default' | 'md' | 'sm' | 'none' | 'big';
}

// Wrapper used for sections
export const SectionWrapper = ({
	width = '6xl',
	paddingT = 'default',
	paddingB = 'default',
	children,
	cssId,
	// Header props
	title,
	description,
	headerActions,
	isH1 = false,
	align = 'left',
	titleSize = 'default',
	headerPaddingT,
	headerPaddingB,
}: SectionWrapperProps) => {
	const widthClass =
		width === 'container'
			? 'container flex flex-col'
			: width === 'full'
				? 'flex flex-col'
				: width === 'md'
					? 'container max-w-md flex flex-col items-center mx-auto px-4'
					: width === '2xl'
						? 'container max-w-2xl flex flex-col items-center mx-auto px-4'
						: width === '4xl'
							? 'container max-w-4xl flex flex-col items-center mx-auto px-4'
							: width === '6xl'
								? 'container max-w-6xl flex flex-col items-center mx-auto px-4'
								: 'container flex flex-col';

	const paddingTClass =
		paddingT === 'default'
			? 'pt-12 md:pt-16'
			: paddingT === 'md'
				? 'pt-8'
				: paddingT === 'sm'
					? 'pt-4'
					: paddingT === 'big'
						? 'pt-16 md:pt-24'
						: paddingT === 'none'
							? 'pt-0'
							: 'pt-12 md:pt-16';

	const paddingBClass =
		paddingB === 'default'
			? 'pb-12 md:pb-16'
			: paddingB === 'md'
				? 'pb-8'
				: paddingB === 'sm'
					? 'pb-4'
					: paddingB === 'big'
						? 'pb-16 md:pb-24'
						: paddingB === 'none'
							? 'pb-0'
							: 'pb-12 md:pb-16';

	const hasHeader = title || description || headerActions;

	return (
		<div className="bg-background" id={cssId}>
			<div className={`${widthClass} ${paddingTClass} ${paddingBClass}`}>
				<div className="flex w-full flex-col">
					{hasHeader && (
						<SectionHeader
							title={title}
							description={description}
							actions={headerActions}
							isH1={isH1}
							align={align}
							titleSize={titleSize}
							paddingT={headerPaddingT}
							paddingB={headerPaddingB}
						/>
					)}
					{children}
				</div>
			</div>
		</div>
	);
};

interface SectionHeaderProps {
	title?: string;
	description?: string;
	actions?: React.ReactNode;
	backUrl?: string;
	isH1?: boolean;
	align?: 'left' | 'center' | 'right';
	titleSize?: 'default' | 'lg' | 'xl' | '2xl' | '3xl';
	paddingT?: 'default' | 'md' | 'sm' | 'none' | 'big';
	paddingB?: 'default' | 'md' | 'sm' | 'none' | 'big';
}

export const SectionHeader = ({
	title,
	description,
	actions,
	backUrl,
	isH1 = false,
	align = 'left',
	titleSize = 'default',
	paddingT = 'default',
	paddingB = 'default',
}: SectionHeaderProps) => {
	const alignmentClasses = {
		left: 'items-start text-left',
		center: 'items-center text-center',
		right: 'items-end text-right',
	};

	const titleSizeClasses = {
		default: 'font-regular text-2xl tracking-tight md:text-4xl',
		lg: 'font-regular text-xl md:text-2xl',
		xl: 'font-regular text-2xl md:text-3xl',
		'2xl': 'font-regular text-3xl md:text-4xl',
		'3xl': 'font-bold text-3xl',
	};

	const paddingTClass =
		paddingT === 'md'
			? 'pt-6'
			: paddingT === 'sm'
				? 'pt-4'
				: paddingT === 'big'
					? 'pt-12'
					: paddingT === 'none'
						? 'pt-0'
						: 'pt-0';

	const paddingBClass =
		paddingB === 'default'
			? 'pb-8'
			: paddingB === 'md'
				? 'pb-6'
				: paddingB === 'sm'
					? 'pb-4'
					: paddingB === 'big'
						? 'pb-12'
						: paddingB === 'none'
							? 'pb-0'
							: 'pb-8';

	const titleClass = titleSizeClasses[titleSize];
	const descClass = 'text-base';

	return (
		<section className={`flex flex-col ${paddingTClass} ${paddingBClass}`}>
			<div className="w-full">
				<div
					className={`flex flex-col gap-2 md:flex-row md:items-center ${
						actions ? 'md:justify-between' : ''
					}`}
				>
					<div
						className={`flex w-full flex-col gap-3 ${alignmentClasses[align]} ${
							actions ? 'md:flex-1' : ''
						}`}
					>
						{title &&
							(isH1 ? (
								<h1 className={titleClass}>{title}</h1>
							) : (
								<h2 className={titleClass}>{title}</h2>
							))}
						{description && <p className={descClass}>{description}</p>}
					</div>
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			</div>
		</section>
	);
};
