import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
	const root = process.cwd();

	const server = {
		port: 3000,
		open: false,
		strictPort: true,
	} as const;

	return {
		root: `${root}/src`,
		plugins: [react()],
		server,
		preview: server,
		envDir: root,
		build: {
			emptyOutDir: true,
			outDir: `${root}/build`,
		},
	};
});
