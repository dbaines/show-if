// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: './src/show-if.js',
  output: {
    file: './dist/show-if.umd.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ]
};