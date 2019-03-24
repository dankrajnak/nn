// webpack v4
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => ({
  entry: { main: "./src/index.js" },
  devtool: argv.mode === "production" ? false : "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    chunkFilename:
      argv.mode === "production"
        ? "chunks/[name].[chunkhash].js"
        : "chunks/[name].js",
    filename: argv.mode === "production" ? "[name].[chunkhash].js" : "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename:
        argv.mode === "production" ? "[name].[contenthash].css" : "[name].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./index.html",
      filename: "index.html"
    }),
    new WebpackMd5Hash(),
    new CopyWebpackPlugin([
      {
        from: "./static/binary.bin",
        to: "./static"
      }
    ]),
    new CompressionPlugin({
      algorithm: "gzip"
    })
  ],
  devServer: {
    contentBase: "dist",
    watchContentBase: true,
    port: 8000
  }
});
