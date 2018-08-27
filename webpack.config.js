const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const uglifyJsPlugin = new UglifyJsPlugin({
    beautify: false, //prod
    output: {
        comments: false
    }, //prod
    mangle: {
        screw_ie8: true
    }, //prod
    compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false // we need this for lazy v8
    },
});

module.exports = {
    entry: {
        'background': path.resolve('src', 'background.js'),
        'content-script': path.resolve('src', 'content-script.js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        uglifyJsPlugin,
        new CopyWebpackPlugin([{
            from: 'src/images',
            to: 'images'
        }, {
            from: 'src/manifest.json'
        }
    ])
    ]
}
