const path = require('path');

module.exports = {
  root: path.resolve(__dirname, '../'),
  outputPath: path.resolve(__dirname, '../', 'build'),
  serverPath: path.resolve(__dirname, '../../', 'Server/inst/app/www'),
  entryPath: path.resolve(__dirname, '../', 'src/index.js'),
  indexPath: path.resolve(__dirname, '../', 'src/index.ejs'),
  faviconPath: path.resolve(__dirname, '../', 'assets/favicon.ico'),
  imagesFolder: 'images',
  fontsFolder: 'fonts',
  cssFolder: 'css',
  jsFolder: 'js',
};
