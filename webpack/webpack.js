/* global require, module, process */
const WEBPACK = require('webpack');
const HTML = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ArchivePlugin = require('@laomao800/webpack-archive-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
const workingDir = process.cwd();

module.exports = env => {
    const production = !!(env && env.production);

    return {
        watch: !production,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000,
        },
        mode: production ? 'production' : 'development',
        context: path.resolve(workingDir, 'src'),
        resolve: {
            extensions: ['.js'],
            alias: {},
        },
        entry: ['./js/index.js'],
        output: {
            path: path.resolve(workingDir, 'build', 'dist'),
            filename: '[name].js', 
            assetModuleFilename: 'assets/[hash][ext][query]'
        },
        plugins: [
            production ? new CleanWebpackPlugin() : () => {},
            new WEBPACK.DefinePlugin({
                __PRODUCTION__: true,
                'process.env.NODE_ENV': '"production"',
            }),
            new HTML({
                title: 'Sea, Sand & Pirates',
                filename: 'index.html',
                template: 'index.ejs',
                inject: true,
            }),
            new CopyPlugin({
                patterns: [
                {
                    to: 'assets/audio/',
                    from: 'audio',
                    toType: 'dir',
                },
                {
                    to: 'assets/css/',
                    from: 'css',
                    toType: 'dir',
                },
                {
                    to: 'assets/fonts/',
                    from: 'fonts',
                    toType: 'dir',
                },
                {
                    to: 'assets/image/',
                    from: 'image',
                    toType: 'dir',
                },
                {
                    from: '../node_modules/p2/build/p2.min.js',
                    to: 'assets/libs/p2/p2.min.js',
                    toType: 'file',
                },
                {
                    from: '../node_modules/noisejs/perlin.js',
                    to: 'assets/libs/noisejs/perlin.js',
                    toType: 'file',
                },
                {
                    from:
                        '../node_modules/pathfinding-browser/pathfinding-browser.min.js',
                    to:
                        'assets/libs/pathfinding-browser/pathfinding-browser.min.js',
                    toType: 'file',
                },
            ]}),
            // new BundleAnalyzerPlugin(),
            new ArchivePlugin({
                output: path.resolve(workingDir, 'build', 'version'),
                // filename: name + "-" + APP_VERSION,
                format: 'tar',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread'],
                    },
                },
                {
                    test: /.(woff|woff2|eot|ttf|svg)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /.(gif|png|jpe?g)$/i,
                    type: 'asset/resource',
                },
            ],
        },
    };
};
