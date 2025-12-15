import { Link } from '@tanstack/react-router';
import { CircleAlert, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function AlertNotAdmin() {
	return (
		<Alert variant="destructive">
			<CircleAlert />
			<AlertTitle>Access blocked</AlertTitle>
			<AlertDescription>
				You dont have access to this content because you are not an
				administrator.
			</AlertDescription>
			<Button
				asChild
				variant="secondary"
				className="mt-4 flex w-fit flex-row items-center gap-2"
			>
				<Link to="/">
					<Home />
					Back to homepage
				</Link>
			</Button>
		</Alert>
	);
}
