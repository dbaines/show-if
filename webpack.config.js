const webpack = require('webpack');
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

let config = module.exports = {
  entry: {
    'show-if': './src/show-if.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'show-if.min.js'
  },
  mode: 'production',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  plugins: [
    new UnminifiedWebpackPlugin()
  ]
}
