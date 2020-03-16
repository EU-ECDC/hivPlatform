const webpackMerge = require('webpack-merge');
const common = require('./webpack/webpack.common');

const envs = {
  development: 'dev',
  production: 'prod',
};

const env = envs[process.env.NODE_ENV || 'development'];
let prodType = '';
if (env === 'prod') {
  prodType = '.' + process.env.PROD_TYPE;
}

/* eslint-disable-next-line global-require,import/no-dynamic-require */
const envConfig = require(`./webpack/webpack.${env}`);
module.exports = webpackMerge(common, envConfig);
