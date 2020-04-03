const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commonPaths = require('./paths');

module.exports = {
  name: 'client',
  mode: 'production',
  output: {
    path: commonPaths.outputPath,
    filename: `${commonPaths.jsFolder}/[name].js`,
    chunkFilename: '[name].[chunkhash].js',
    // publicPath: 'www/'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
