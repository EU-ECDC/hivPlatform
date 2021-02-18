const commonPaths = require('./paths');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  name: 'client',
  mode: 'production',
  output: {
    path: commonPaths.outputPath,
    filename: `${commonPaths.jsFolder}/[name].js`,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: 'www/'
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      name: 'vendors'
    },
  },
  watch: false,
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: "build/*", destination: '../Server/inst/app/www/' },
            { source: "build/js/*", destination: '../Server/inst/app/www/js/' }
          ],
        }
      }
    }),
    new BundleAnalyzerPlugin()
  ]
};
