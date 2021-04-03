const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge").merge;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

const baseConfig = {
  mode: isDevelopment ? "development" : "production",
  context: __dirname,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      common: path.join(__dirname, "src", "common"),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              ...require("./babel.config"),
              plugins: [
                ...(require("./babel.config").plugins || []),
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: "wds",
          sockPort: 8080,
        },
      }),
  ].filter(Boolean),
};

module.exports = [
  merge(baseConfig, {
    name: "dashboard",
    entry: [
      require.resolve("webpack-dev-server/client") + "?http://0.0.0.0:8079",
      "./src/dashboard/index.dashboard.tsx",
    ],
    output: {
      path: path.join(__dirname, "dashboard"),
      filename: "dashboard.bundle.js",
      uniqueName: "dashboard",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, "dashboard", "index.html"),
        template: "./src/dashboard/index.html",
      }),
    ],
    devServer: {
      hot: true,
      writeToDisk: true,
      injectHot: true,
      sockPort: 8079,
      public: "localhost:8079",
      inline: true,
      port: 8079,
    },
  }),
  merge(baseConfig, {
    name: "graphics",
    entry: [
      require.resolve("webpack-dev-server/client") + "?http://0.0.0.0:8080",
      "./src/graphics/index.graphics.tsx",
    ],
    output: {
      path: path.join(__dirname, "graphics"),
      filename: "graphics.bundle.js",
      uniqueName: "graphics",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, "graphics", "index.html"),
        template: "./src/graphics/index.html",
      }),
    ],
    devServer: {
      hot: true,
      writeToDisk: true,
      injectHot: true,
      sockPort: 8080,
      public: "localhost:8080",
      inline: true,
    },
  }),
  {
    name: "extension",
    mode: "development",
    entry: "./src/extension/index.extension.ts",
    target: "node",
    module: {
      rules: [
        {
          test: /\.tsx?/,
          loader: "ts-loader",
          exclude: /node-modules/,
        },
      ],
    },
    externalsPresets: {
      node: true,
    },
    devtool: false,
    output: {
      path: __dirname,
      filename: "extension.js",
      library: {
        type: "commonjs2",
      },
    },
  },
];
