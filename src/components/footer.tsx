import { Link } from '@tanstack/react-router';
import { Hexagon } from 'lucide-react';
import { ModeToggle } from '@/components/theme/theme-toggle';
import { SectionWrapper } from '@/components/wrappers';
import { DICTIONARY } from '@/shared/dictionary';

export function Footer() {
	return (
		<footer className="mb-8 w-full border-t">
			<SectionWrapper width="6xl">
				<div className="flex flex-col gap-2">
					<Link to="/" className="flex items-center gap-1">
						<Hexagon className="text-foreground" />
						<p className="mt-[2px] font-logo font-semibold text-lg">
							{DICTIONARY.BRAND_NAME}
						</p>
					</Link>
					<p className="max-w-lg text-left text-foreground leading-relaxed tracking-tight">
						{DICTIONARY.SLOGAN}
					</p>
					<ModeToggle />
				</div>
			</SectionWrapper>
		</footer>
	);
}
