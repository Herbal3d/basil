// As copied from example at https://webpack.js.org/guides/getting-started/
//    This is not ES6 'import' format so update this file someday
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    wwtester: './src/WWTester.js',
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  // devtool: 'inline-source-map',
  // Create aliases for the main components so filenames aren't required in each file
  //      ref: https://webpack.js.org/configuration/resolve/
  resolve: {
    modules: [ path.resolve(__dirname, "src/jslibs"), "node_modules" ],
    // Aliases so individual files don't reference the filenames
    alias: {
        'xConfig': path.resolve(__dirname, 'src/config.js'),
        'xBException': path.resolve(__dirname, 'src/BException.js'),

        'xBasilServerMessages': path.resolve(__dirname, 'src/jslibs/BasilServerMessages.js'),

        // 'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.min.js'),
        'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.js'),
    },
    extensions: [ '.js', '.jsx' ]
  },
  plugins: [
    // Keep track of the module versions/hashs so chunkhash doesn't change unless files change
    new webpack.HashedModuleIdsPlugin(),
    // Causes a separate bundle for the entry.vendor modules
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
    }),
    // Causes the runtime to be put in a separate bundle rather than included in each bundle
    new webpack.optimize.CommonsChunkPlugin({
        name: 'wwtest-runtime'
    })
  ],
  module: {
    rules: [
        {
            // move image files to the dist directory
            //    ref: https://webpack.js.org/loaders/file-loader/
            test: /\.(png|svg|jpg|gif)$/,
            use: [ 'file-loader' ]
        }

    ]
  }

};
