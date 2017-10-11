const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

function resolve(dir) {
	return path.join(__dirname, '/../', dir)
}

var prod = {
	devtool: '#source-map',

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	]
}

var umd = merge(common, prod, {
	output: {
		path: resolve('./dist/'),
		filename: 'bootstrap-select.min.js',
		libraryTarget: 'umd'
	}
});

var window = merge(common, prod, {
	output: {
		path: resolve('./dist/'),
		filename: 'bootstrap-select.browser.min.js',
		library: 'BtsSelect',
		libraryExport: 'default'
	}
});

module.exports = [umd, window];