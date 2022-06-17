const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve('./src/index.js'),
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
        publicPath: '/'
    },
    module: {
        rules: [

            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                },
                {
                  loader:'css-loader'  
                },
                {
                    loader: 'less-loader'
                }]
            }
        ]
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:path.resolve('./public/index.html')
        })
    ]
}