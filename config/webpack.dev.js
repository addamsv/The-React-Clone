const path = require("path");

const appDir = path.join(__dirname, "../src");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: appDir + "/index.html",
  filename: "index.html",
  inject: "body",
  favicon: "./src/assets/ico/favicon.ico",
});

const config = {
  mode: "development",

  devtool: "inline-source-map",

  entry: appDir + "/index.tsx",

  output: {
    filename: "./js/[name].js",
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
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
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
        options: { name: "./src/assets/img/[name].[ext]" },
      },
    ],
  },

  plugins: [HTMLWebpackPluginConfig],

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
