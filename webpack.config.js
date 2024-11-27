//const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = [
{
  mode: "production",
  entry: [
    './main.mjs'
  ],
  output: {
    filename: './main.min.mjs',
    path: __dirname,
  library: 'test',
	    libraryTarget: 'window',
	    libraryExport: 'default',
    "library": {
        "type": "commonjs-module",
        "name": "render"
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

