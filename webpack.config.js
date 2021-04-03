const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge").merge;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

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
						options: {},
					},
				],
			},
		],
	},
	plugins: [new ForkTsCheckerWebpackPlugin()],
};

module.exports = [
	merge(baseConfig, {
		entry: "./src/dashboard/index.dashboard.tsx",
		output: {
			path: path.join(__dirname, "dashboard"),
			filename: "dashboard.bundle.js",
			uniqueName: "dashboard",
            clean: true,
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: "./src/dashboard/index.html",
				filename: "index.html",
				inject: "body",
				// alwaysWriteToDisk: true
			}),
			// new HtmlWebpackHarddiskPlugin()
		],
	}),
	merge(baseConfig, {
		entry: "./src/graphics/index.graphics.tsx",
		output: {
			path: path.join(__dirname, "graphics"),
			filename: "graphics.bundle.js",
			uniqueName: "graphics",
            clean: true,
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: "./src/graphics/index.html",
				filename: "index.html",
				inject: "body",
				// alwaysWriteToDisk: true
			}),
			// new HtmlWebpackHarddiskPlugin()
		],
	}),
	{
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
