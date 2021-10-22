const webpack = require('webpack');
const commonPaths = require('./paths');

module.exports = {
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 8080,
    compress: false,
    hot: true,
    open: true,
    static: {
      directory: commonPaths.root,
    }
  },
  output: {
    path: commonPaths.outputPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  devtool: 'inline-source-map'
};
