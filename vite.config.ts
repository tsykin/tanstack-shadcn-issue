import tailwindcss from '@tailwindcss/vite';
// import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
	server: {
		port: 3000,
	},
	plugins: [
		tsConfigPaths(),
		tanstackStart(),
		// Enable Nitro only in production builds to avoid dev server timeout
		...(mode === 'production' ? [nitro()] : []),
		viteReact(),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			external: ['puppeteer', 'sharp'],
		},
	},
	ssr: {
		external: ['puppeteer', 'sharp'],
		noExternal: [],
	},
}));
