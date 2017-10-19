const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

function resolve(dir) {
    return path.join(__dirname, '/../', dir)
}

module.exports = merge(common, {
	output: {
		//path: resolve('./dist/'),
		path: resolve('../server/public/'),
		filename: 'bootstrap-select.js',
		//libraryTarget: 'umd'
		library: 'BtsSelect',
		libraryExport: 'default'
	},

	//devtool: '#cheap-module-eval-source-map',
	devtool: '#eval-source-map',

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		})
	]

});