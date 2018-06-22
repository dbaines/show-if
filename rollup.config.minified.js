import config from './rollup.config.shared.js';
import minify from 'rollup-plugin-babel-minify';

config.output.file = './dist/show-if.umd.min.js';
config.plugins.push(
  minify({
    comments: false,
    sourceMap: false,
    bannerNewLine: true,
    banner: "/* ShowIf.js */"
  })
)

export default config;