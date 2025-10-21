const path = require("path");
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    url: require.resolve("url/"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser.js"), // 👈 explicitly include .js
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: ["process/browser.js"], // 👈 also explicitly use .js here
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  // Optional: ensure .mjs files are properly handled
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
