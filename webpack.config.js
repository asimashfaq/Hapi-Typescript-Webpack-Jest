const path = require('path')
var HappyPack = require('happypack')

const nodeExternals = require('webpack-node-externals')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const mode =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
        ? 'production'
        : 'development'
const isProd = mode === 'production'
const webpack = require('webpack')
// Common plugins
let plugins = [
    new webpack.NamedModulesPlugin(),
    new FilterWarningsPlugin({
        exclude: [
            /Critical dependency: the request of a dependency is an expression/,
            /require.extensions is not supported by webpack. Use a loader instead./
        ]
    }),
    new HappyPack({
        id: 'ts',
        threads: 4,
        loaders: [
            {
                path: 'ts-loader',
                query: { happyPackMode: true }
            }
        ]
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
]
if (!mode) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
}
module.exports = {
    node: {
        __dirname: true
    },
    entry: './src/App.ts',
    devtool: false,
    mode: mode,
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.js',
            '@hapi/vision': '@hapi/vision/lib/index.js'
        },
        extensions: [
            '.webpack-loader.js',
            '.web-loader.js',
            '.loader.js',
            '.js',
            '.jsx',
            '.ts'
        ],
        modules: [path.resolve('./src'), 'node_modules'],
        plugins: [new tsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    plugins: plugins,
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'happypack/loader?id=ts'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            }
        ]
    }
}
