var alias = require('./alias')
var webpack = require('webpack')

var webpackConfig = {
  resolve: {
    alias: Object.assign({}, alias)
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devtool: '#inline-source-map'
}
// shared config for all unit tests
module.exports = {
  frameworks: ['jasmine'],
  files: [
    '../test/unit/index.js'
  ],
  preprocessors: {
    '../test/unit/index.js': ['webpack', 'sourcemap']
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  singleRun: true
}
