const { getLoader, loaderNameMatches } = require("react-app-rewired");
const path = require('path');

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
      type: 'json',
      use: [
        { 
          loader:'react-bender/support/webpack',
          options: {
            test:true
          }
        }]
    }

    config.module.rules.push(bender);
    config.resolve.extensions.push('.bender');

    return config;
  }
}
