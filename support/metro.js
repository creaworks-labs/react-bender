var semver = require("semver");

const postcss = require('postcss')
const postscss = require('postcss-scss')
const bender = require('postcss-react-bender');

var upstreamTransformer = null;

var reactNativeVersionString = require("react-native/package.json").version;
var reactNativeMinorVersion = semver(reactNativeVersionString).minor;

if (reactNativeMinorVersion >= 56) {
  upstreamTransformer = require("metro/src/reactNativeTransformer");
} else if (reactNativeMinorVersion >= 52) {
  upstreamTransformer = require("metro/src/transformer");
} else if (reactNativeMinorVersion >= 47) {
  upstreamTransformer = require("metro-bundler/src/transformer");
} else if (reactNativeMinorVersion === 46) {
  upstreamTransformer = require("metro-bundler/build/transformer");
} else {
  // handle RN <= 0.45
  var oldUpstreamTransformer = require("react-native/packager/transformer");
  upstreamTransformer = {
    transform({ src, filename, options }) {
      return oldUpstreamTransformer.transform(src, filename, options);
    }
  };
}

var styleExtensions = ["scss"]; 

module.exports.transform = function(src, filename, options) {
  if (typeof src === "object") {
    // handle RN >= 0.46
    ({ src, filename, options } = src);
  }

  const config = {
    plugins:[bender], 
    options:{
      syntax: postscss,
      from: filename
    }
  };

  if (styleExtensions.some(ext => filename.endsWith("." + ext))) {
    return postcss(config.plugins)
            .process(src, config.options)
            .then(result => {
              const transformed = JSON.stringify(result.bender);
              console.log('transformed', filename, transformed);
              return upstreamTransformer.transform({
                src: `module.exports = ${transformed}`,
                filename,
                options
              })
            });
  }

  return upstreamTransformer.transform({ src, filename, options });

};