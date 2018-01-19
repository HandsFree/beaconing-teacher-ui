const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';

const prodBanner = `Beaconing Teacher UI
------------
Authors:
Elliott Judd <elliott.judd@hands-free.co.uk>`;

const devBanner = `--- Compiled in Developer Mode ---

Beaconing Teacher UI
------------
Authors:
Elliott Judd <elliott.judd@hands-free.co.uk>`;

const entries = {
    core: './core/index.js',
    'pages/home/index': './modules/home/index.js',
    'pages/lesson_manager/index': './modules/lesson_manager/index.js',
};

const config = {
    context: resolve(__dirname, 'src'),
    entry: entries,
    output: {
        path: resolve(__dirname, 'public', 'dist', 'beaconing'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        'sass-loader',
                    ],
                }),
            },
        ],
    },
    plugins: dev ? [
        new ExtractTextPlugin('app.css'),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.BannerPlugin({
            banner: devBanner,
        }),
    ] : [
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            sourceMap: false,
            ecma: 8,
        }),
        new ExtractTextPlugin('app.css'),
        new OptimizeCssAssetsPlugin(),
        new CompressionPlugin(),
        new webpack.BannerPlugin({
            banner: prodBanner,
        }),
    ],
    devServer: {
        contentBase: './public/',
        publicPath: 'http://localhost:8080/',
        open: false,
        hot: true,
        hotOnly: true,
    },
    devtool: dev ? 'source-map' : false,
};

module.exports = config;
