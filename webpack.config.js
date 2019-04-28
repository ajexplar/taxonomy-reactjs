const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    //mode: 'development',
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { 
                presets: ['env'] 
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    resolve: { 
        extensions: ['*', '.js', '.jsx'] 
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'public/'),
        port: 6700,
        publicPath: 'http://localhost:6700/dist/',
        hotOnly: true,
        proxy: {
        	'/api': 'http://localhost:3456'
        }
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};
