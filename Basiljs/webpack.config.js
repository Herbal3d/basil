// As copied from example at https://webpack.js.org/guides/getting-started/
//    This is not ES6 'import' format so update this file someday
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    basil: './src/Basil.js',
    vendor: [
        'jquery'
    ]
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

        'xComm': path.resolve(__dirname, 'src/Comm/index.js'),
        'xBasilServerMessages': path.resolve(__dirname, 'src/jslibs/BasilServerMessages.js'),

        'xBItem': path.resolve(__dirname, 'src/Items/BItem.js'),
        'xItemManager': path.resolve(__dirname, 'src/Items/ItemManager.js'),
        'xDisplayable': path.resolve(__dirname, 'src/Items/Displayable.js'),
        'xInstance': path.resolve(__dirname, 'src/Items/DisplayableInstance.js'),

        'xControls': path.resolve(__dirname, 'src/Controls/index.js'),
        'xEventing': path.resolve(__dirname, 'src/Eventing/index.js'),
        // 'xGraphics': path.resolve(__dirname, 'src/Graphics/index.js'),
        'xGraphics': path.resolve(__dirname, 'src/Graphics/Graphics-ThreeJS.js'),
        'xThreeJS': path.resolve(__dirname, 'src/jslibs/three.min.js'),
        'xThreeJSOrbit': path.resolve(__dirname, 'src/jslibs/OrbitControls.js'),
        'xThreeJSGLTF': path.resolve(__dirname, 'src/jslibs/GLTFLoader.js'),

        // 'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.min.js'),
        'protobufjs/minimal': path.resolve(__dirname, 'src/jslibs/protobufjs/minimal/protobuf.js'),
    },
    extensions: [ '.js', '.jsx' ]
  },
  plugins: [
    // Cleans out the 'dist' directory at the start of each build
    new CleanWebpackPlugin( ['dist']),
    // Keep track of the module versions/hashs so chunkhash doesn't change unless files change
    new webpack.HashedModuleIdsPlugin(),
    // Causes a separate bundle for the entry.vendor modules
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
    }),
    // Create a global alias and load ThreeJS (as opposed to having imports for this driver)
    new webpack.ProvidePlugin({
        'THREE': 'xThreeJS'
    }),
    // Causes the runtime to be put in a separate bundle rather than included in each bundle
    new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
    }),
    // Create dist/index.html from my template
    //      ref: https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
        inject: true,
        template: 'src/index.html',
        // googleAnalytics.trackingId: 'xyz',
        // googleAnalytics.pageViewOnLoad: true,
        lang: 'en-US',
    }),
    new ExtractTextPlugin('Basiljs.css')
  ],
  externals: {
      // Hack for creating the GP global variable
      'GP': '{}'
  },
  module: {
    rules: [
        {
            // process less files to the dist directory
            //    ref: https://webpack.js.org/loaders/less-loader/
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                use: [
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ],
                fallback: 'style-loader'    // use style-loader in development
            })
        },
        {
            // move css files to the dist directory
            //    ref: https://webpack.js.org/loaders/css-loader/
            test: /\.css$/,
            use: [ 'css-loader' ]
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
