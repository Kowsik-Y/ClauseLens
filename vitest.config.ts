import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['src/app/layout.tsx', 'src/**/*.d.ts', 'src/components/ui/**'],
			thresholds: {
				statements: 72,
				branches: 68,
				functions: 68,
				lines: 74,
			},
		},
	},
});
