const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

// Main configuration object
var config_css = {
  // From this file Webpack will begin his work
  entry: './src/assets/js/index.js',

  module: {
    rules: [
      // Set loaders to transform files.
      // Loaders are applying from right to left(!)
      // The first loader will be applied after others
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // Apply rule for .sass or .css files
        test: /\.(sa|c)ss$/,

        use: [
          MiniCssExtractPlugin.loader,
          {
            // This loader resolves url() and @imports inside CSS
            loader: "css-loader",
            options: {
              modules: false,

              // Set URL to false, then urls in CSS will display properly (in our case)
              url: false,

              sourceMap: true,
              importLoader: 2,
              publicPath: '/public/css/',
            }
          },
          // Transform SASS to standard CSS
          "sass-loader"
        ]
      },
      
      {
        // Apply rule for fonts files
        test: /\.(woff|ttf|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',

              // Set limit for size of files with URLs
              limit: 8192
            },
          },
        ]
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output; both options are optional
      filename: "styles.css",
      chunkFilename: "[name].css"
    })
  ],
  output: {
    filename: "[name]-min.js",
    path: path.resolve(__dirname, "public/css"),
    publicPath: "/public/"
  },

  // Default mode for Webpack is development. Because we use this mode more often.
  // Depending on mode Webpack will apply different things on final bundle.
  mode: 'development'
};

var config_js = {
  entry: {
    'form': './src/assets/js/form.js',
    'main': './src/assets/js/main.js'
  },
  devtool: (process.env.NODE_ENV == 'production' ? 'source-map' : 'cheap-module-source-map'),
  output: {
    filename: '[name]-test.js',
    path: path.resolve(__dirname, 'public/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'src/assets/js/',
        to: 'public/[name]-dev.[ext]',
        toType: 'template'
      }
    ])
  ],
  mode: 'development'
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config_js.devtool = 'cheap-module-source-map';
  }

  if (argv.mode === 'production') {

    // Need production's JavaScript minifying
    config_js.devtool = 'source-map';

    config_css.mode = 'production';
    config_js.mode = 'production';
  }

  // Use multiple configuration objects
  return [config_css, config_js];
}
