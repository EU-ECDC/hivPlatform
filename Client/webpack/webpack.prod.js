const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commonPaths = require('./paths');

module.exports = {
  name: 'client',
  mode: 'production',
  output: {
    //path: commonPaths.serverPath,
    path: commonPaths.outputPath,
    filename: `${commonPaths.jsFolder}/[name].js`,
    // filename: `${commonPaths.jsFolder}/[name].[hash].js`,
    chunkFilename: '[name].[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
