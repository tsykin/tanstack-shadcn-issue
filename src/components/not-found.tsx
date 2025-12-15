import { Link } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundComponent() {
	return (
		<div className="flex h-fit flex-col items-center justify-center bg-background px-4 py-16">
			<div className="w-full max-w-md space-y-8 text-center">
				<AlertCircle className="mx-auto h-24 w-24 text-destructive" />
				<h1 className="mt-6 font-extrabold text-4xl text-foreground">
					Page not found - 404
				</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					We're sorry, but the page you're looking for doesn't exist or has been
					moved.
				</p>
				<div className="mt-8 space-y-4">
					<Button
						asChild
						variant="default"
						className="flex w-full flex-row items-center gap-2"
					>
						<Link to="/">
							<Home />
							Home page
						</Link>
					</Button>
					<Button
						onClick={() => window.history.back()}
						variant="outline"
						className="flex w-full flex-row items-center gap-2"
					>
						<ArrowLeft />
						Go back
					</Button>
				</div>
			</div>
		</div>
	);
}
