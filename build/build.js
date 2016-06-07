var path = require('path');
var alias = require('./alias');
var webpack = require('webpack');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DIST_DIR = path.resolve(__dirname, '../dist');
var SRC_DIR = path.resolve(__dirname, '../src');

module.exports = {
    entry: './src/index',
    output: {
        path: DIST_DIR,
        filename: "switch.js",
        library: "Switch",
        libraryTarget: 'umd'
    },
    resolve: {
        alias: Object.assign({}, alias)
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader!postcss-loader")
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
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("switch.css")
    ]
}
