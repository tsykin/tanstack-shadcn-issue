import { InferSelectModel } from 'drizzle-orm';
import { user } from '@/db/schema';

type User = InferSelectModel<typeof user>;

export function UserItem({ user }: { user: User }) {
	return (
		<div className="flex items-center justify-between rounded-md border p-3">
			<div className="flex flex-col">
				<span className="font-medium">{user.name}</span>
				<span className="text-muted-foreground text-xs">
					{user.email ?? 'Unknown user'}
				</span>
			</div>
		</div>
	);
}
