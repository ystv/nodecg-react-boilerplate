const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
if (process.argv.length > 2 && process.argv[2].length > 0) {
  // We're in a child, launch a worker.
  const WebpackDevServer = require("webpack-dev-server");

  const ourConfig = webpackConfig.find(x => x.name === process.argv[2]);
  if (!ourConfig) {
    console.error("Couldn't find " + process.argv[2]);
    process.exit(1);
  }

  const compiler = webpack(ourConfig);
  const devServerOptions = ourConfig.devServer;
  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(devServerOptions.port, "127.0.0.1", () => {
    console.log(
      `Dev server for ${process.argv[2]} is on port ${devServerOptions.port}`
    );
  });
} else {
  // Discover workers.
  const child_process = require("child_process");
  webpackConfig
    .filter(x => x.name !== "extension")
    .forEach(cfg => {
      child_process.fork(process.argv[1], [cfg.name], {
        detached: false
      });
    });
  const extensionConfig = webpackConfig.filter(x => x.name === "extension");
  const compiler = webpack(extensionConfig);
  compiler.watch({}, (err, stats) => {
    console.log(stats);
  });
}
