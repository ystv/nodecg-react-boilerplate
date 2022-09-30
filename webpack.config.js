/* eslint-disable */
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge").merge;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");

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
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 3,
              modules: false,
            },
          },
        ],
      },
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
      {
        test: /\.(woff2?|ttf|eot|svg|otf|woff2|otf|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: "wds",
          sockPort: 8080,
        },
      }),
  ].filter(Boolean),
};

let wsPort = 8080;

function makeConfig(kind, name) {
  wsPort += 1;
  const htmlTemplate = fs.existsSync(
    path.join(__dirname, "src", kind, `index.${name}.html`)
  )
    ? path.join(__dirname, "src", kind, `index.${name}.html`)
    : path.join(__dirname, "src", kind, `index.html`);
  return merge(baseConfig, {
    name: name,
    entry: [
      require.resolve("webpack-dev-server/client") +
        `?http://0.0.0.0:${wsPort}`,
      `./src/${kind}/index.${name}.tsx`,
    ],
    output: {
      path: path.join(__dirname, kind),
      filename: `${name}.bundle.js`,
      uniqueName: name,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join(__dirname, kind, `${name}.html`),
        template: htmlTemplate,
      }),
    ],
    devServer: {
      hot: true,
      writeToDisk: true,
      injectHot: true,
      sockPort: wsPort,
      public: `localhost:${wsPort}`,
      inline: true,
      port: wsPort,
    },
  });
}

const dashboards = fs
  .readdirSync(path.join(__dirname, "src", "dashboard"))
  .map((x) => x.match(/index\.(.+)\.tsx?$/i))
  .filter(Boolean)
  .map((x) => x[1])
  .map((x) => makeConfig("dashboard", x));

const graphics = fs
  .readdirSync(path.join(__dirname, "src", "graphics"))
  .map((x) => x.match(/index\.(.+)\.tsx?$/i))
  .filter(Boolean)
  .map((x) => x[1])
  .map((x) => makeConfig("graphics", x));

const config = [
  ...dashboards,
  ...graphics,
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

module.exports = config;
