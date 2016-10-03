// Loading dependencies.
var webpack = require('webpack');

/**
 * Webpack configuration options.
 * @type {Object}
 */
module.exports = {
    entry: {
        'app.min': './src/scripts/app.js',
        '../../serviceworker.min': './src/scripts/service-worker.js'
    },
    output: {
        path: './dist/scripts/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            compress: {
                'drop_console': false,
                'drop_debugger': false,
                'warnings': false
            }
        })
    ]
};
