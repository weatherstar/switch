var path = require('path');
var alias = require('./alias');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cssExtractor = ExtractTextPlugin.extract("css?sourceMap!postcss");
var lessExtractor = ExtractTextPlugin.extract("css?sourceMap!postcss!less?sourceMap");

var DIST_DIR = path.resolve(__dirname, '../dist');
var SRC_DIR = path.resolve(__dirname, '../src');

module.exports = {
  entry: './src/index',
  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: "switch.js",
    library: "Switch",
    libraryTarget: 'umd'
  },
  resolve: {
    alias: Object.assign({}, alias)
  },
  postcss: [autoprefixer({browsers: ['last 2 versions', 'Android 2.3']})],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: cssExtractor
      }, {
        test: /\.less$/,
        loader: lessExtractor
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            'transform-runtime',
            "add-module-exports"
          ],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devtool: '#source-map'
}
