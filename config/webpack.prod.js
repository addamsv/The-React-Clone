const path = require("path");

const appDir = path.join(__dirname, "../src");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: appDir + "/index.html",
  filename: "index.html",
  inject: "body",
  favicon: "./src/assets/ico/favicon.ico",
});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
  filename: "./css/[name].css",

  chunkFilename: "[id].css",
  ignoreOrder: false, // Enable to remove warnings about conflicting order
});

// const getSetts = () => {
//   return MODE === "production"
//     ? { mode: "production" }
//     : { mode: "development", devtool: "inline-source-map" };
// };

const config = {
  // mode: 'development',
  // entry: appDir + '/index.tsx',
  // output: {
  //   path: __dirname + '/dist',
  //   filename: 'index.js',
  //   publicPath: '',
  // },

  mode: "production",

  entry: appDir + "/index.tsx",

  output: {
    filename: "./js/[name].js",
    // output: "js",
    path: path.join(__dirname, "../dist"),
    publicPath: "",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  module: {
    rules: [
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: "file-loader",
        options: { name: "./assets/img/[name].[ext]" },
      },
      // {
      //   test: /\.(ico)$/i,
      //   loader: "file-loader",
      //   options: { name: "./assets/ico/[name].[ext]" },
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
    ],
  },
  plugins: [HTMLWebpackPluginConfig, MiniCssExtractPluginConfig],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

module.exports = config;
