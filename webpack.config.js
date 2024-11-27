//const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = [
{
  mode: "production",
  entry: [
    './main.js'
  ],
  output: {
    filename: './main.min.js',
    path: __dirname
  },
  optimization: {
    minimize: true,
  },
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
}]

