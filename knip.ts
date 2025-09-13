import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	ignoreDependencies: [
		'eslint',
		'@eslint/compat',
		'@eslint/js',
		'typescript-eslint',
	],
};

export default config;
