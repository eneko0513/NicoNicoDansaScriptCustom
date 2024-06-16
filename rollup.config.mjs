import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import preserveDirectives from 'rollup-preserve-directives';

const plugins = [
	typescript(),
	json(),
	image(),
	postcss({
		extensions: [".css"],
		modules: true,
	}),
	nodeResolve({
		extensions: [".js"],
		browser: true
	}),
	preserveDirectives(),
	replace({
		preventAssignment: true,
		'process.env.NODE_ENV': JSON.stringify('production'),
	}),
	babel({
		babelHelpers: 'bundled',
		presets: ["@babel/preset-react"],
	}),
	commonjs(),
	terser(),
];

export default [
	{
		input: 'src/index.ts',
		output: {
			file: `dist/index.js`,
			format: 'umd',
			name: 'DanSukuMizu'
		},
		plugins: plugins,
	},
	{
		input: 'src/index_tmp.ts',
		output: {
			file: `dist/index_tmp.js`,
			format: 'umd',
			name: 'DanSukuMizu'
		},
		plugins: plugins,
	},
	{
		input: 'src/Root.tsx',
		output: {
			file: `dist/main.js`,
			format: 'umd',
			name: 'DanSukuMizu'
		},
		plugins: plugins,
	},
	{
		input: 'src/Root_tmp.tsx',
		output: {
			file: `dist/main_tmp.js`,
			format: 'umd',
			name: 'DanSukuMizu'
		},
		plugins: plugins,
	},
	{
		input: 'src/popup/popup.ts',
		output: {
			file: `dist/popup/popup.js`,
			format: 'umd',
			name: 'DanSukuMizu'
		},
		plugins: plugins
	}]