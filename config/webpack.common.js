const path = require('path');
const webpack = require('webpack');

function resolve(dir) {
	return path.join(__dirname, '/../', dir)
}

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('./src/')]
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			}
		]
	}
};