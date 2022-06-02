const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    entry: './src/Entry/Entry.ts'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: [ path.resolve(__dirname, "src/jslibs"), "node_modules" ],
    // Aliases so individual files don't reference the filenames
    alias: {
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
  plugins: [
    // Create dist/Entry.html from my template
    //      ref: https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
        inject: 'body',
        filename: 'Entry.html',
        template: 'src/Entry/Entry.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
        lang: 'en-US'
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Copy the .css file and the built dialogs into the distribution
        //      ref: https://webpack.js.org/plugins/copy-webpack-plugin/
        { from: 'src/Basil.css', to: path.resolve(__dirname, "dist") },
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
  }

};
// vim: set tabstop=2 shiftwidth=2 expandtab autoindent :
