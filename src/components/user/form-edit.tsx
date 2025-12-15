import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { User } from 'better-auth';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUser } from '@/features/user/actions';

interface EditUserFormProps {
	user: User;
}

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditUserForm({ user }: EditUserFormProps) {
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name || '',
			firstName: (user as User & { firstName?: string | null }).firstName || '',
			lastName: (user as User & { lastName?: string | null }).lastName || '',
		},
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (values: FormValues) => {
		try {
			await updateUser({
				data: {
					name: values.name,
					firstName: values.firstName || undefined,
					lastName: values.lastName || undefined,
				},
			});

			toast.success('Dane konta zaktualizowane!');
			router.invalidate();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Nie udało się zaktulizować dane konta.');
			}
		}
	};

	const getInitials = (
		name: string,
		firstName?: string | null,
		lastName?: string | null
	) => {
		if (firstName && lastName) {
			return `${firstName[0]}${lastName[0]}`.toUpperCase();
		}
		if (name) {
			const parts = name.trim().split(' ');
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
			}
			return name[0]?.toUpperCase() || 'U';
		}
		return 'U';
	};

	const userWithExtras = user as User & {
		firstName?: string | null;
		lastName?: string | null;
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* User Image Preview */}
				<div className="flex items-center gap-4">
					<Avatar className="size-20">
						{user.image && (
							<AvatarImage
								src={user.image}
								alt={user.name || 'User'}
								title={user.name || 'User'}
							/>
						)}
						<AvatarFallback className="text-lg">
							{getInitials(
								user.name,
								userWithExtras.firstName,
								userWithExtras.lastName
							)}
						</AvatarFallback>
					</Avatar>
				</div>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nazwa użytkownika</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Imię</FormLabel>
								<FormControl>
									<Input {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nazwisko</FormLabel>
								<FormControl>
									<Input {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input value={user.email || ''} disabled />
					</FormControl>
					<FormDescription>
						Zmiana adresu email nie jest możliwa. W razie pytań skontaktuj się z
						administracją.
					</FormDescription>
				</FormItem>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<LoaderCircle className="mr-2 size-4 animate-spin" />
							Aktualizacja...
						</>
					) : (
						'Zaktualizuj dane'
					)}
				</Button>
			</form>
		</Form>
	);
}
