const webpack = require('webpack');
const commonPaths = require('./paths');

module.exports = {
  mode: 'development',

  devServer: {
    compress: false,
    hot: true,
    open: true,
    port: 8080
  },

  output: {
    path: commonPaths.outputPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  devtool: 'inline-source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],
};
