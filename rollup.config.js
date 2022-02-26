import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import path from 'path';

import pkg from './package.json';
const output = {
	sourcemap: true,
};

const babelPlugin = babel({
	exclude: /node_modules/,
	include: 'src/**',
	babelHelpers: 'runtime',
});

export default [
	{
		// ESM build for modern tools like webpack
		input: 'assets/payload.js',
		output: {
			...output,
			file: pkg.module,
			format: 'esm',
		},
		external: [
			/@babel\/runtime/,
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {}),
		],
		plugins: [
			resolve(),
			commonjs(),
			babelPlugin,
		],
	},
	{
		// type declaration files for ESM build
		input: 'assets/payload.js',
		output: {
			...output,
			dir: path.dirname(pkg.module),
			format: 'esm',
		},
		external: [
			/@babel\/runtime/,
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {}),
		],
		plugins: [],
	},
	{
		// minified
		input: 'assets/payload.js',
		output: {
			...output,
			file: pkg.unpkg,
			format: 'umd',
			name: 'payloadResponse',
		},
		external: Object.keys(pkg.peerDependencies || {}),
		plugins: [
			resolve(),
			commonjs(),
			babelPlugin,
			terser(),
		],
	},
	{
		// non-minified
		input: 'assets/payload.js',
		output: {
			...output,
			file: pkg.main,
			format: 'umd',
			name: 'payloadResponse',
		},
		external: Object.keys(pkg.peerDependencies || {}),
		plugins: [
			resolve(),
			commonjs(),
			babelPlugin,
		],
	},
];
