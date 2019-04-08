const { getLoader, loaderNameMatches } = require("react-app-rewired");
const multi = require('multi-loader');
const path = require('path');

function getBenderLoader() {
  return multi(
    'style-loader!css-loader!react-bender/support/webpack.loader.js?css',
    'react-bender/support/webpack.loader.js?bender')
}

module.exports = {
  webpack: function(config, env) {
    const extension = /\.bender$/;

    const fileLoader = getLoader(
      config.module.rules,
      rule => loaderNameMatches(rule, 'file-loader')
    );
    fileLoader.exclude.push(extension);

    const bender = {
      test: extension,
      include: path.resolve(__dirname, "src"),
      use: [
        { 
          loader: getBenderLoader()
        }]
    }

    config.module.rules.push(bender);

    config.resolve.extensions.push('.bender');

    return config;
  }
}
