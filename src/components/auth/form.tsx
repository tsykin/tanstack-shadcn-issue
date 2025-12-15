import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	getSession,
	signIn,
	signOut,
	signUp,
	useSession,
} from '@/features/auth/client';
import { DICTIONARY } from '@/shared/dictionary';

export const AuthForm = ({ type }: { type: 'login' | 'register' }) => {
	const navigate = useNavigate();
	const formSchema = z.object({
		email: z.string(),
		password: z.string().min(1, { message: 'Password is required.' }),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const {
		handleSubmit,
		formState: { isSubmitting, errors },
	} = form;

	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const isLogin = type === 'login';
		try {
			const response = isLogin
				? await signIn.email({
						email: values.email,
						password: values.password,
						callbackURL: '/dashboard',
					})
				: await signUp.email({
						email: values.email,
						password: values.password,
						name: values.email.split('@')[0] ?? '',
						callbackURL: '/dashboard',
					});

			if (response?.error) {
				toast.error(DICTIONARY.AUTH.ERROR);
				return;
			}

			toast.info(DICTIONARY.AUTH.SUCCESS);
			navigate({ to: '/dashboard', replace: true });
		} catch (error: unknown) {
			if (error instanceof Error && error.message.trim().length > 0) {
				toast.error(`${DICTIONARY.AUTH.ERROR} ${error.message}`);
				return;
			}
			toast.error(DICTIONARY.AUTH.ERROR);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const result = await signIn.social({
				provider: 'google',
				callbackURL: '/dashboard',
			});
			console.log('Google OAuth result:', result);
		} catch (error) {
			console.error('Google OAuth error:', error);
			if (error instanceof Error) {
				toast.error(`${DICTIONARY.AUTH.ERROR} ${error.message}`);
			} else {
				toast.error(DICTIONARY.AUTH.ERROR);
			}
		}
	};

	const handleError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
		if (errors) {
			toast.info(DICTIONARY.AUTH.FORM_ERROR);
		}
	};

	return (
		<div className="flex w-full flex-col gap-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, handleError)}>
					<Card>
						<CardHeader>
							<CardTitle>
								{type === 'login'
									? DICTIONARY.AUTH.LOGIN_TITLE
									: DICTIONARY.AUTH.REGISTER_TITLE}
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4">
							<Button
								onClick={() => handleGoogleLogin()}
								variant="outline"
								type="button"
								disabled={isSubmitting}
								className="gap-2"
							>
								<div className="h-4 w-4">
									<GoogleIcon />
								</div>
								Google
							</Button>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2">
										{DICTIONARY.AUTH.OR_EMAIL_PASSWORD}
									</span>
								</div>
							</div>
							<FormField
								name="email"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="your@email.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="password"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													autoComplete="on"
													placeholder="password"
													type={showPassword ? 'text' : 'password'}
													{...field}
												/>
												<div
													className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
													onClick={togglePasswordVisibility}
												>
													{showPassword ? (
														<Eye size={20} />
													) : (
														<EyeOff size={20} />
													)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* TODO: add reset password feature */}
							{/* <div className="flex w-full flex-col items-end text-sm">
								<Link to="/" className="ml-1 underline">
									Nie pamiętasz hasła?
								</Link>
							</div> */}
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? (
									<LoaderCircle className="animate-spin" />
								) : null}
								{type === 'login'
									? DICTIONARY.AUTH.LOGIN_BUTTON
									: DICTIONARY.AUTH.REGISTER_BUTTON}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
			<div className="mt-4 flex flex-col items-center justify-center text-sm">
				{type === 'login' ? (
					<p>
						{DICTIONARY.AUTH.LOGIN_FOOTER}
						<Link to="/register" className="underline">
							{DICTIONARY.AUTH.LOGIN_FOOTER_LINK}
						</Link>
					</p>
				) : (
					<p>
						{DICTIONARY.AUTH.REGISTER_FOOTER}
						<Link to="/login" className="underline">
							{DICTIONARY.AUTH.REGISTER_FOOTER_LINK}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};
