const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-bender/dist/support/metro")
    },
    resolver: {
      sourceExts: [...sourceExts, "bender"]
    }
  };
})();