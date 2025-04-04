import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
	{
		files: ['**/*.js'],
		plugins: {
			js,
		},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			}
		},
		extends: ['js/recommended'],
		rules: {
			'no-prototype-builtins': 'off',
			'no-unused-vars': 'warn',
			'no-undef': 'warn'
		}
	}
]);
