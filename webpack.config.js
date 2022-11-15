const path = require("path");

const app_dir = __dirname + '/src';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: app_dir + '/index.html',
  filename: 'index.html',
  inject: 'body'
});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // all options are optional
  filename: "[name].css",
  chunkFilename: "[id].css",
  ignoreOrder: false, // Enable to remove warnings about conflicting order
});

const MODE = 'development'; // "production" | "development" | "none"
// const IS_PRODUCTION_MODE = process.env.NODE_ENV === 'build';

const getSetts = () => {
  return MODE === 'production' ? {mode: 'production'} : {mode: 'development', devtool: 'inline-source-map'}
};

const config = {
  // mode: 'development',
  // entry: app_dir + '/index.tsx',
  // output: {
  //   path: __dirname + '/dist',
  //   filename: 'index.js',
  //   publicPath: '',
  // },

  /* Prodact Mode */
  ...getSetts(),

  entry: {
    index: { import: app_dir + '/index.tsx', dependOn: 'iChunk' },
    iChunk: [app_dir + '/iChunk.ts'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '',
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },




  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Creates `style` nodes from JS strings
          // 'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      // {
      //   test: /\.s?css$/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'sass-loader'
      //   ]
      // },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /(node_modules|bower_components)/
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i, 
      //   loader: 'file-loader',
      //   options: { name: 'images/[hash]-[name].[ext]' }
      // },
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: [{ loader: 'file-loader' }],
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   exclude: [/node_modules/],
      //   loader: "file-loader"
      // },
      // {
      //   test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   exclude: [/node_modules/],
      //   loader: "file-loader"
      // },
      // {
      //   test: /\.(pdf)$/i,
      //   exclude: [/node_modules/],
      //   loader: "file-loader",
      //   options: { name: '[name].[ext]' },
      // },
    ]
  },
  plugins: [HTMLWebpackPluginConfig, MiniCssExtractPluginConfig],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  // externals: {
  //     react: 'react',
  // },
  // optimization: {
  //   removeAvailableModules: false,
  //   removeEmptyChunks: false,
  //   splitChunks: false,
  // },
  devServer: {
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
};

module.exports = config;
