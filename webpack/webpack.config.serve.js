const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const keyFile = require('../src/assets/data/key.json');

module.exports = {
	entry: './src/js/app.js',
	output: {
		publicPath: '/dist/',
		filename: 'app.js',
	},
	module: {
		rules: [
			{
				test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				// include: './src';
				use: {
					loader: 'file-loader',
				},
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	devServer: {
		hotOnly: true,
		overlay: true,
		open: true,
		host: keyFile.host,
		https: true,
	},
};
