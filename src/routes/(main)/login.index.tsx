import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth/form';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/wrappers';
import { signIn, signOut, useSession } from '@/features/auth/client';
import { getUserSession } from '@/features/auth/server';

export const Route = createFileRoute('/(main)/login/')({
	component: Page,
	loader: async () => {
		const serverSession = await getUserSession();
		if (serverSession) {
			throw redirect({ to: '/dashboard' });
		}
	},
});

function Page() {
	const { data: session } = useSession();
	return (
		<SectionWrapper width="md">
			<AuthForm type="login" />
		</SectionWrapper>
	);
}
