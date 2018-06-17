const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dev = process.env.NODE_ENV === 'development';
const analyse = process.env.analyse === 'true';

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
                exclude: /node_modules/,
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
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NamedChunksPlugin(),
        new webpack.BannerPlugin({
            banner: devBanner,
        }),
        new ExtractTextPlugin('app.css'),
        new HardSourceWebpackPlugin({
            cacheDirectory: `${resolve(__dirname, 'node_modules', '.cache', 'hard-source')}/[confighash]`,
        }),
    ] : [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.FlagIncludedChunksPlugin(),
        new webpack.optimize.FlagDependencyUsagePlugin(),
        new webpack.optimize.SideEffectsFlagPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            sourceMap: false,
            cache: true,
            uglifyOptions: {
                ie8: false,
                ecma: 8,
            },
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.BannerPlugin({
            banner: prodBanner,
        }),
        new ExtractTextPlugin('app.css'),
        new OptimizeCssAssetsPlugin(),
    ],
    devtool: dev ? 'inline-source-map' : false,
};

let config = [
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
            'pages/classroom/student/page': './modules/classroom/student/',
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
            'pages/classroom/group/page': './modules/classroom/group/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/search/page': './modules/search/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/profile/page': './modules/profile/root/',
        },
        ...mainSettings,
    },
    {
        entry: {
            'pages/calendar/page': './modules/calendar/root/',
        },
        ...mainSettings,
    },
];

if (dev) {
    config.push({
        entry: {
            'pages/glpviewer/page': './modules/glpviewer/root/',
        },
        ...mainSettings,
    });
}

if (analyse) {
    config = {
        entry: {
            'pages/lesson_manager/page': './modules/lesson_manager/root/',
        },
        ...mainSettings,
    };

    config.plugins.push(new BundleAnalyzerPlugin({
        openAnalyzer: false,
    }));
}

module.exports = config;
