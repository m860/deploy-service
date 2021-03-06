/**
 * Created by jean.h.ma on 3/24/17.
 */
var path = require("path");
var webpack = require("webpack");
var fs = require("fs");
// var EventCallbackWebpackPlugin = require("event-callback-webpack-plugin").default;
// var exec = require("child_process").exec;
// var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var fse=require("fs-extra");
var CleanWebpackPlugin = require('clean-webpack-plugin');

function isProduction() {
	return process.env['NODE_ENV'] === "production";
}

var nodeModules = {};
fs.readdirSync('./node_modules')
	.filter(function (x) {
		return ['.bin'].indexOf(x) === -1;
	})
	.forEach(function (mod) {
		nodeModules[mod] = 'commonjs ' + mod;
	});

var plugins = [
	new webpack.LoaderOptionsPlugin({
		options: {
			babel: {
				plugins: [
					[
						"babel-plugin-transform-require-ignore",
						{
							extensions: [
								".less",
								".sass",
								".css",
								".ttf",
								".eot",
								".svg",
								".woff2",
								".woff",
								".jpg",
								".jpeg",
								".gif",
								".png"
							]
						}
					],
					"transform-decorators-legacy"
				]
			}
		}
	})
];

if (isProduction()) {
	plugins.push(
		new CleanWebpackPlugin(['dist'])
	)
}
else{

}

var config = {
	entry: path.resolve(__dirname, 'index.js'),
	target: "node",
	node: {
		__dirname: true,
		__filename: true
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	externals: nodeModules,
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader'
			}]
		}]
	},
	plugins: plugins
};
if (!isProduction()) {
	config.devtool = "#inline-source-map";
}

module.exports = config;