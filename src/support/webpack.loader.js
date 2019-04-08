
const loaderUtils = require('loader-utils')

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
  const action = loader.query.substr(1)
  const callback = loader.async();

  if (action === 'bender'){
    // Webpack 4 uses json-loader automatically, which breaks this loader because it
    // doesn't return JSON, but JS module. This is a temporary workaround before
    // official API is added (https://github.com/webpack/webpack/issues/7057#issuecomment-381883220)
    // See https://github.com/webpack/webpack/issues/7057
    if (JavascriptParser && JavascriptGenerator) {
      loader._module.type = "json"
      loader._module.parser = new JavascriptParser()
      loader._module.generator = new JavascriptGenerator()
    }
  }
  
  const loaderOptions = loaderUtils.getOptions(loader) || {};

  const config = {
    plugins:[bender({ webpack:true, ...loaderOptions })], 
    options:{ 
      syntax: postscss,
      from: loader.resourcePath,
    }
  };

  postcss(config.plugins)
    .process(content, config.options)
    .then((result) => {
      const transformed = JSON.stringify(result.bender);
      const css = result.css

      if (action === 'css'){
        loader.data = {
          ...loader.data,
          bender: transformed
        }

        callback && callback(null, `${css}`)
      } 
      else {
        loader.data = {
          ...loader.data,
          css
        }
        callback && callback(null, `module.exports = ${transformed}`)
      }

    }).catch((err) => {
      callback && callback(err);
      console.log('ERRRR', err)
    })

}

function loader(content) {
	try {
		transformer.call(undefined, this, content)
	} catch (e) {
		console.error(e, e.stack)
		throw e
	}
}

module.exports = loader
module.exports.raw = true;
