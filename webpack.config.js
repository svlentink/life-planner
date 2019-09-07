const path = require('path');

module.exports = [{
  mode: "production",
  entry: [
    './shared.js',
    './editor/editor.js',
    './personas/personas.js',
    './values/values.js'
  ],
  output: {
    filename: 'bundled01.js',
    path: __dirname
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true
  }
},
{
  mode: "production",
  entry: [
    './routines/ical.js',
    './routines/calendar.js',
    './routines/routines.js',
    './tmm/tmm.js'
  ],
  output: {
    filename: 'bundled02.js',
    path: __dirname
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true
  }
}];

