import { type LinkProps } from '@tanstack/react-router';
import { FileRoutesByTo } from '@/routeTree.gen';
// Define types for the recursive search function
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JsonValue }
	| JsonValue[];

export interface ApiResult {
	success: boolean;
	error?: string;
	data?: unknown;
}

// All valid route paths in the application
export type RoutePath = keyof FileRoutesByTo;

// Type-safe Link component props for a specific route
export type TypedLinkProps<T extends RoutePath> = Omit<LinkProps, 'to'> & {
	to: T;
};

// Extracts the params type for a given route path
export type RouteParams<T extends RoutePath> = LinkProps<T>['params'];

// Extracts the search params type for a given route path
export type RouteSearch<T extends RoutePath> = LinkProps<T>['search'];
