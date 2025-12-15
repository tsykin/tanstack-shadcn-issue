import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MONTH_NAMES } from '@/shared/constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
