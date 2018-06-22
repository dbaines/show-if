// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import minify from 'rollup-plugin-babel-minify';

const inputFile = './src/show-if.js';
const defaultPlugins = [
  resolve(),
  json(),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
]

export default [

  // Regular UMD Build
  {
    input: inputFile,
    output: {
      file: './dist/show-if.umd.js',
      format: 'umd'
    },
    plugins: defaultPlugins,
  },

  // Minified UMD Build
  {
    input: inputFile,
    output: {
      file: './dist/show-if.umd.min.js',
      format: 'umd',
    },
    plugins: [
      ...defaultPlugins,
      minify({
        comments: false,
        sourceMap: false,
        bannerNewLine: true,
        banner: "/* ShowIf.js */",
      })
    ]
  }

];