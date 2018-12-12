
const loaderUtils = require('loader-utils')

const path = require('path');
const postcss = require('postcss')
const postscss = require('postcss-scss')
const bender = require('postcss-react-bender');

// Check if JavascriptParser and JavascriptGenerator exists -> Webpack 4
let JavascriptParser
let JavascriptGenerator
try {
  JavascriptParser = require("webpack/lib/Parser")
  JavascriptGenerator = require("webpack/lib/JavascriptGenerator")
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") {
    throw e
  }
}

function transformer(loader, content) {
  // Webpack 4 uses json-loader automatically, which breaks this loader because it
  // doesn't return JSON, but JS module. This is a temporary workaround before
  // official API is added (https://github.com/webpack/webpack/issues/7057#issuecomment-381883220)
  // See https://github.com/webpack/webpack/issues/7057
  if (JavascriptParser && JavascriptGenerator) {
    loader._module.type = "json"
    loader._module.parser = new JavascriptParser()
    loader._module.generator = new JavascriptGenerator()
  }
  
	const callback = loader.async();
  
  const filename = path.parse(loader.resourcePath).base;
  const loaderOptions = loaderUtils.getOptions(loader) || {};

  const config = {
    plugins:[bender], 
    options:{ 
      syntax: postscss,
      from: filename
    }
  };

  postcss(config.plugins)
    .process(content, config.options)
    .then((result) => {
      const transformed = JSON.stringify(result.bender);

      // loader.emitFile(filename, transformed);


      // callback && callback(null, `module.exports = ${transformed}`)
      callback && callback(null, transformed)

      console.log('transformed', filename, transformed);
    }).catch((err) => {
      callback && callback(err);
      console.log('ERRRR', err)
    })

	// return "module.exports = " + JSON.stringify(content);
}

function loader(text) {
	try {
    const options = loaderUtils.getOptions(this);
		transformer.call(undefined, this, text)
	} catch (e) {
		console.error(e, e.stack)
		throw e
	}
}

module.exports = loader
module.exports.raw = true;
