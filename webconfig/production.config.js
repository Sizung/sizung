var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var NODE_ENV_PLUGIN = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
});

module.exports = {
  context: __dirname + '/../app/react',
  entry: './index',
  output: {
    path: __dirname + '/../app/assets/javascripts',
    filename: 'react_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
        // loader: 'style-loader!css-loader?modules'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.js.jsx']
  },
  plugins: [
    NODE_ENV_PLUGIN,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('../stylesheets/react_bundle.css', {
      allChunks: true
    }),
  ],
};
