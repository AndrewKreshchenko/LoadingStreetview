const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
var config = {
    entry: './src/assets/js/index.js',
    module: {
        rules: [ {
            test: /\.sass$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: false,
                  sourceMap: true,
                  importLoader: 2
                }
              },
              "sass-loader"
            ]}
        ]
    },
        
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "style.css",
            chunkFilename: "[name].css"
        })
    ],
    output: {
        filename: "[name]-min.js",
        path: path.resolve(__dirname, "public"),
        publicPath: "/public/"
    },
    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript 
    // minifying and other thing so let's set mode to development
    mode: 'development'
};

module.exports = config;