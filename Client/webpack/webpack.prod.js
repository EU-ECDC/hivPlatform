const commonPaths = require('./paths');

module.exports = {
  name: 'client',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: commonPaths.outputPath,
    filename: `${commonPaths.jsFolder}/[name].js`,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: 'www/'
  },
  optimization: {
    minimize: true
  },
  watch: false
};
