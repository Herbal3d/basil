// As copied from example at https://webpack.js.org/guides/getting-started/
//    This is not ES6 'import' format so update this file someday
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    wwtester: './src/WWTester.js',
  },
  output: {
    filename: 'wwtester.js',
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

        'xBTransport': path.resolve(__dirname, 'src/Comm/BTransport.js'),
        'xBTransportWW': path.resolve(__dirname, 'src/Comm/BTransportWW.js'),
        'xBasilClient': path.resolve(__dirname, 'src/Comm/BasilClient.js'),
        'xBasilServerMessages': path.resolve(__dirname, 'src/jslibs/BasilServerMessages.js'),

        'xBItem': path.resolve(__dirname, 'src/Items/BItem.js'),

        // 'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.min.js'),
        'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.js'),
    },
    extensions: [ '.js', '.jsx' ]
  },
  plugins: [
  ],
  externals: {
      // Hack for creating the GP global variable
      'GP': '{}'
  },
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
// vim: set tabstop=2 shiftwidth=2 expandtab autoindent :
