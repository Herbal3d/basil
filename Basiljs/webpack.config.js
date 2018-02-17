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
    // Aliases so individual files don't reference the filenames
    alias: {
        'xConfig': path.resolve(__dirname, 'src/config.js'),
        'xComm': path.resolve(__dirname, 'src/Comm/index.js'),
        'xControls': path.resolve(__dirname, 'src/Controls/index.js'),
        'xEventing': path.resolve(__dirname, 'src/Eventing/index.js'),
        // 'xGraphics': path.resolve(__dirname, 'src/Graphics/index.js'),
        'xGraphics': path.resolve(__dirname, 'src/Graphics/Graphics-ThreeJS.js'),
        'xThreeJS': path.resolve(__dirname, 'src/jslibs/three.min.js'),
        'xThreeJSOrbit': path.resolve(__dirname, 'src/jslibs/OrbitControls.js'),
        'xThreeJSGLTF': path.resolve(__dirname, 'src/jslibs/GLTFLoader.js'),
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
    // Creates a global alias for ThreeJS (needed for example/modules)
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
