
const { merge } = require('webpack-merge');

var config = require('./webpack.config');

const productionConfig = {
    mode: 'production',
    output: {
        environment: {
            arrowFunction: false
        },
        publicPath:'./'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
        ]
    }
}

module.exports = merge(config, productionConfig);