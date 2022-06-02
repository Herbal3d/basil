const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    justview: './src/Entry/JustView.ts'
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
        filename: 'JustView.html',
        template: 'src/Entry/JustView.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
        lang: 'en-US'
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
      }
    ]
  }

};
// vim: set tabstop=2 shiftwidth=2 expandtab autoindent :
