const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    entry: './src/Entry/Entry.js'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [ path.resolve(__dirname, "src/jslibs"), "node_modules" ],
    // Aliases so individual files don't reference the filenames
    alias: {
        'xConfig': path.resolve(__dirname, 'src/config.js'),
        'xBException': path.resolve(__dirname, 'src/BException.js'),
        'xUtilities': path.resolve(__dirname, 'src/Utilities.js'),
        // The Globals module can have only one name so there is only one instance
        'GLOBALS': path.resolve(__dirname, 'src/Globals.js')
    },
    extensions: [ '.js', '.jsx' ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: false,
  },
  plugins: [
    // Create dist/Entry.html from my template
    //      ref: https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
        inject: 'body',
        filename: 'Entry.html',
        template: 'src/Entry.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
        lang: 'en-US'
    }),
    // Extract text from a bundle or bundles into a separate file.
    //     ref: https://github.com/webpack-contrib/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  module: {
    rules: [
      {
        // process less files to the dist directory
        //    ref: https://webpack.js.org/loaders/less-loader/
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      },
      {
        // move image files to the dist directory
        //    ref: https://webpack.js.org/loaders/file-loader/
        test: /\.(png|svg|jpg|gif)$/,
        use: [ 'file-loader' ]
      }
    ]
  }

};
// vim: set tabstop=2 shiftwidth=2 expandtab autoindent :
