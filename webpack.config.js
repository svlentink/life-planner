//const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = [
{
  mode: "development",
  entry: [
    './main.mjs'
  ],
  experiments: {
    outputModule: true,
  },
  output: {
    filename: './main.min.mjs',
    publicPath: '',
    path: __dirname,
    library: { // https://webpack.js.org/configuration/output/#type-module
      type: "module",
    }
  },/*
  optimization: {
    minimize: true,
  },*/
  // https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "Buffer": false,
      "buffer": false,
    },
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
/*
  module: {
    rules: [
      {
       test: /^http.*\.js/,
       type: 'asset/resource'
     }
    ],
    parser: {
      javascript: {
        dynamicImportMode: 'eager',
        dynamicImportPrefetch: true,
        dynamicImportPreload: true,
        url: true,
      },
    },
  },*/
}]

