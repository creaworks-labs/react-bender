const { getDefaultConfig } = require("metro-config");
const { extensions } = require("react-bender/lib/support/extensions") 

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-bender/lib/support/metro")
    },
    resolver: {
      sourceExts: [...sourceExts, 'bender']
    }
  };
})();