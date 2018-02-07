const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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

const mainSettings = {
    context: resolve(__dirname, 'src'),
    output: {
        path: resolve(__dirname, 'public', 'dist', 'beaconing'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader?cacheDirectory=true',
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
            {
                test: /\.json5$/,
                use: [
                    'json5-loader',
                ],
            },
        ],
    },
    plugins: dev ? [
        new webpack.optimize.OccurrenceOrderPlugin(),
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
            cache: true,
            uglifyOptions: {
                ie8: false,
                ecma: 8,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('app.css'),
        new OptimizeCssAssetsPlugin(),
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

const config = [
    {
        entry: {
            core: './core/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/home/page': './modules/home/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/lesson_manager/page': './modules/lesson_manager/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/lesson_manager/new_plan/page': './modules/lesson_manager/new_plan/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/authoring_tool/page': './modules/authoring_tool/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/classroom/page': './modules/classroom/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/classroom/classes/page': './modules/classroom/classes/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/classroom/groups/page': './modules/classroom/groups/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/classroom/courses/page': './modules/classroom/courses/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/search/page': './modules/search/root/',
        },
        ...mainSettings,
    },
];

module.exports = config;
