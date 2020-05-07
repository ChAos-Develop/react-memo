//var webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'production',
    
    entry: [
        '@babel/polyfill',
        './src/index.js',
        './src/style.css'
    ],

    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js'
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },

    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: { minimize: true }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            'react-hot-loader/babel',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-transform-classes'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
        //root: path.resolve('./src'),
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: './public/index.html', // public/index.html 파일을 읽는다.
            filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
            inject: false
        }),
        new HtmlWebPackPlugin({
            template: './public/404.html', // public/index.html 파일을 읽는다.
            filename: '404.html', // output으로 출력할 파일은 index.html 이다.
            inject: false
        })
    ]
};
