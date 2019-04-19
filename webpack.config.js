const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const { resolve } = require('path');
// const threadLoader = require('thread-loader');
// const { length: cpuCount } = require('os').cpus();

//
// ─── BANNERS ────────────────────────────────────────────────────────────────────
//

const prodBanner = `Beaconing Teacher UI
------------
Authors:
Elliott Judd <elliott.judd@hands-free.co.uk>
Felix Angell <felix.angell@hands-free.co.uk>`;

const devBanner = `--- Compiled in Developer Mode ---

Beaconing Teacher UI
------------
Authors:
Elliott Judd <elliott.judd@hands-free.co.uk>
Felix Angell <felix.angell@hands-free.co.uk>`;

//
// ─── LOADER OPTIONS ─────────────────────────────────────────────────────────────
//

// Add thread loader if needed

// threadLoader.warmup({
//     workers: cpuCount - 1,
//     workerParallelJobs: 50,
// }, [
//     'babel-loader',
//     'sass-loader',
// ]);

const babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
    },
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        importLoaders: 1,
    },
};

const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: [
            Autoprefixer,
        ],
    },
};

const docsFileLoader = {
    loader: 'file-loader',
    options: {
        outputPath: 'docs/',
    },
};

const imageFileLoader = {
    loader: 'file-loader',
    options: {
        outputPath: 'images/',
    },
};

const fontFileLoader = {
    loader: 'file-loader',
    options: {
        outputPath: 'fonts/',
    },
};

const videoFileLoader = {
    loader: 'file-loader',
    options: {
        outputPath: 'videos/',
    },
};

const optLoaders = [
    {
        loader: 'cache-loader',
        options: {
            cacheDirectory: resolve(__dirname, 'node_modules', '.cache', 'cache-loader'),
        },
    },
    // {
    //     loader: 'thread-loader',
    //     options: {
    //         workers: cpuCount - 1,
    //         workerParallelJobs: 50,
    //     },
    // },
];

//
// ─── MAIN CONFIG ────────────────────────────────────────────────────────────────
//

const mainSettings = (dev, devServer, dash, verbose) => {
    // Plugin Options //

    const sharedPlugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.BannerPlugin({
            banner: dev ? devBanner : prodBanner,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(dev),
            },
        }),
        new HardSourceWebpackPlugin({
            cacheDirectory: `${resolve(__dirname, 'node_modules', '.cache', 'hard-source')}/[confighash]`,
            info: {
                level: 'warn',
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'app.css',
        }),
    ];

    return {
        context: resolve(__dirname, 'src'),
        output: {
            publicPath: '/dist/beaconing/',
            path: resolve(__dirname, 'public', 'dist', 'beaconing'),
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        ...optLoaders,
                        babelLoader,
                    ],
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        cssLoader,
                        ...optLoaders,
                        postCSSLoader,
                        'sass-loader',
                    ],
                },
                {
                    test: /\.mp4$/,
                    use: [
                        videoFileLoader,
                    ],
                },
                {
                    test: /\.pdf$/,
                    use: [
                        docsFileLoader,
                    ],
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [
                        imageFileLoader,
                    ],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: [
                        fontFileLoader,
                    ],
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
            ...sharedPlugins,
            new webpack.NamedModulesPlugin(),
            new webpack.NamedChunksPlugin(),
            ...(devServer ? [new webpack.HotModuleReplacementPlugin()] : []),
            ...(dash ? [new DashboardPlugin()] : []),
        ] : [
            ...sharedPlugins,
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.SideEffectsFlagPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new OptimizeCssAssetsPlugin(),
        ],
        devtool: dev ? 'eval-source-map' : false,
        devServer: {
            contentBase: './public/',
            hot: true,
            hotOnly: true,
            open: false,
            publicPath: 'http://localhost:8080/dist/beaconing/',
            compress: true,
        },
        mode: 'none',
        optimization: !dev ? {
            minimize: true,
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    sourceMap: false,
                    cache: true,
                    uglifyOptions: {
                        ie8: false,
                        ecma: 8,
                    },
                }),
            ],
        } : {},
        stats: verbose ? 'verbose' : {
            errors: true,
            errorDetails: false,
            assets: true,
            builtAt: false,
            cached: false,
            cachedAssets: false,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            reasons: false,
            version: false,
            source: false,
            warnings: false,
            publicPath: false,
            entrypoints: false,
            timings: false,
        },
    };
};

//
// ─── CONFIG FUNCTION ────────────────────────────────────────────────────────────
//

const config = (env) => {
    const dev = env.mode === 'development';
    const devServer = env.server === 'enabled';
    const dash = env.dash === 'enabled';
    const verbose = env.verbose === 'enabled';

    return [
        {
            entry: {
                core: './core/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/home/page': './modules/home/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/lesson_manager/page': './modules/lesson_manager/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/authoring_tool/page': './modules/authoring_tool/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/classroom/page': './modules/classroom/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/classroom/student/page': './modules/classroom/student/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/classroom/groups/page': './modules/classroom/groups/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/classroom/group/page': './modules/classroom/group/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/search/page': './modules/search/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/profile/page': './modules/profile/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        {
            entry: {
                'pages/calendar/page': './modules/calendar/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        },
        ...(dev ? [{
            entry: {
                'pages/glpviewer/page': './modules/glpviewer/root/',
            },
            ...mainSettings(dev, devServer, dash, verbose),
        }] : []),
    ];
};

module.exports = config;
