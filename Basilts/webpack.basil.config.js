// Webpack file for the main Basil viewer page.

//    (the following is not ES6 'import' format so update this file someday)
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    basil: './src/Basil.ts',
    // declare the config file as a separate entry so it is not packed with the main viewer
    config: './src/Config.ts'
  },
  output: {
    // use webpack.HashedModuleIdsPlugin to create unique filenames for each build
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  // Create aliases for the main components so filenames aren't required in each file
  //      ref: https://webpack.js.org/configuration/resolve/
  resolve: {
    modules: [ path.resolve(__dirname, "src/jslibs"), "node_modules" ],
    // Aliases so individual files don't reference the filenames
    alias: {
        // Aliases so individual files don't reference the filenames
        '@Abilities': path.resolve(__dirname, 'src/Abilities'),
        '@Base': path.resolve(__dirname, 'src'),
        '@BItem': path.resolve(__dirname, 'src/BItem'),
        '@Comm': path.resolve(__dirname, 'src/Comm'),
        '@Dialogs': path.resolve(__dirname, 'src/Dialogs'),
        '@Entry': path.resolve(__dirname, 'src/Entry'),
        '@Eventing': path.resolve(__dirname, 'src/Eventing'),
        '@Graphics': path.resolve(__dirname, 'src/Graphics'),
        '@jslibs': path.resolve(__dirname, 'src/jslibs'),
        '@Tools': path.resolve(__dirname, 'src/Tools')
    },
    extensions: [ '.ts', '.js', '.jsx', '.json' ]
  },
  optimization: {
  },
  externals: {
    'draggable-dialog': 'jslibs/draggable-resizable-dialog.js'
  },
  plugins: [
    // Add the references to the built .js files to the .html files
    //      ref: https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
        filename: 'Basil.html',
        template: 'src/Basil.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Copy the .css file and the built dialogs into the distribution
        //      ref: https://webpack.js.org/plugins/copy-webpack-plugin/
        { from: 'src/Basil.css', to: path.resolve(__dirname, "dist") },
        // Dialogs are not processed by Webpack and are just copied to the dist directory
        { from: 'Dialogs/*.(css|html)', context: path.resolve(__dirname, "src/") }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
        exclude: /node_modules/,
        exclude: /Dialogs/,
        exclude: /declarations/
      },
      {
        // move image files to the dist directory
        //    ref: https://webpack.js.org/loaders/file-loader/
        test: /\.(png|svg|jpg|gif)$/,
        use: [ 'file-loader' ]
      }
    ]
  } };

// vim: set tabstop=2 shiftwidth=2 expandtab autoindent :
