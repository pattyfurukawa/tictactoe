const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const plugins = {
  prod: [
    new ExtractTextWebpackPlugin('bundle.css',
      { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(
      { sourceMap: false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  dev: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};

const styleLoader = {
  prod: {
    test: /(\.scss|\.css)/,
    loader: ExtractTextWebpackPlugin.extract('style',
      ['css', 'postcss', 'sass']),
  },
  dev: {
    test: /(\.scss|\.css)/,
    loaders: ['style', 'css', 'postcss', 'sass'],
  },
};

const config = {
  context: __dirname,
  devtool: production ? undefined : 'inline-source-map',
  entry: [
    './src/index.jsx',
  ],
  output: {
    path: './www',
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules'),
    ],
  },
  node: {
    fs: 'empty',
  },
  devServer: {
    quiet: false,
    historyApiFallback: true,
    contentBase: './www'
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
      }, {
        test: /\.json$/,
        loader: 'json',
      }, production ? styleLoader.prod : styleLoader.dev,
    ],
  },
  postcss: [autoprefixer],
  plugins: production ? plugins.prod : plugins.dev,
};

module.exports = config;
