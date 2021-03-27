const path = require('path');

module.exports = [
{
  mode: "production",
  entry: [
    './dashboard/main.js'
  ],
  output: {
    filename: 'bundled_dashboard.js',
    path: __dirname
  },
  optimization: {
    minimize: true
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
},
{
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
  optimization: {
    minimize: true
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
},
{
  mode: "production",
  entry: [
    './routines/ical.js',
    './routines/calendar.js',
    './routines/routines.js',
    './routines/graph.js',
    './tmm/tmm.js'
  ],
  output: {
    filename: 'bundled02.js',
    path: __dirname
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
//  test: /\.m?js/,
//  resolve: {
//    fullySpecified: false
//  }
}];

