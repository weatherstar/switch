var path = require('path')
var alias = require('./alias')
var webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, '../src/switch.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'switch.js',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: Object.assign({}, alias, {
      entities: './entity-decoder'
    })
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
  devtool: '#source-map'
}
