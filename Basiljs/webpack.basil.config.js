// Webpack file for the main Basil viewer page.

//    (the following is not ES6 'import' format so update this file someday)
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    basil: './src/Basil.js',
    // declare the config file as a separate entry so it is not packed with the main viewer
    config: './src/config.js',
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
        // 'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.min.js'),
        'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.js'),
        // The ThreeJS modules reference things in their build tree
        '../../../build': path.resolve(__dirname, 'src/jslibs'),
        // The Globals module can have only one name so there is only one instance
        'GLOBALS': path.resolve(__dirname, 'src/Globals.js')
    },
    extensions: [ '.js', '.jsx', '.json' ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    // runtimeChunk: false,
    runtimeChunk: 'single',
  },
  plugins: [
    // Create a global alias and load ThreeJS (as opposed to having imports for this driver)
    new webpack.ProvidePlugin({
        THREE: path.resolve(__dirname, 'src/jslibs/three.min.js')
    }),

    // Create dist/Basil.html from my template
    //      ref: https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
        inject: 'body',
        filename: 'Basil.html',
        template: 'src/Basil.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
        lang: 'en-US'
    }),
    // Extract text from a bundle or bundles into a separate file.
    //     ref: https://github.com/webpack-contrib/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
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
