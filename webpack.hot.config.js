// coming from this gist https://gist.github.com/epeli/28c2dbcbe8109a0c5edb

var webpack = require("webpack");

var ExtractTextPlugin = require('extract-text-webpack-plugin');

// This must be the public address where the hot reload bundle is loaded in the
// browser. Yeah it sucks to hard code it here. Let's hope for the better
// future
var PUBLIC_DEV_SERVER = "http://localhost:4000/";

var ENTRY = "./index.js";

var NODE_ENV_PLUGIN = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true
});

var config = {
  context: __dirname + '/app/react',

    entry: [
        "webpack-hot-middleware/client?path=" + PUBLIC_DEV_SERVER + "__webpack_hmr",
        ENTRY
    ],
    output: {
        path: __dirname + "/public",
        filename: "react-app-bundle.js",
        publicPath: PUBLIC_DEV_SERVER
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    "stage": 1,
                    "env": {
                        // Not active when NODE_ENV=production
                        "development": {
                            "plugins": ["react-transform"],
                            "extra": {
                                "react-transform": {
                                  transforms: [{
                                    "transform": "react-transform-hmr",
                                    "imports": ["react"],
                                    "locals": ["module"]
                                  },
                                  {
                                    transform: "react-transform-catch-errors",
                                    imports: ["react", "redbox-react"]
                                  }]
                                }
                            }
                        }
                    }
                }
            },
            {
              test: /\.css$/,
              //loader: 'style-loader!css-loader'
              //loaders: ['style-loader', 'css-loader']
              //loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
              loader: 'style-loader!css-loader?modules'
            }
        ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.js.jsx']
    },
    plugins: [
        NODE_ENV_PLUGIN,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};

// Drop all hot stuff for production!
if (process.env.NODE_ENV === "production") {
    config.devtool = "source-map";
    config.entry = ENTRY;
    delete config.output.publicPath;
    config.plugins = [NODE_ENV_PLUGIN];
}

module.exports = config;