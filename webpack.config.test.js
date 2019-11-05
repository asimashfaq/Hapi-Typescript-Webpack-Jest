const path = require('path')
const nodeExternals = require('webpack-node-externals')
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const isCoverage = process.env.NODE_ENV === 'unit_test'
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
console.log(isCoverage)
module.exports = {
    devtool: 'inline-cheap-module-source-map',
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        plugins: [new tsconfigPathsPlugin()]
    },
    plugins: [
        new FilterWarningsPlugin({
            exclude: [
                /Critical dependency: the request of a dependency is an expression/,
                /require.extensions is not supported by webpack. Use a loader instead./
            ]
        })
    ],
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'test')
                ],
                loader: 'istanbul-instrumenter-loader'
            },
            {
                test: /\.ts$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'test')
                ],
                loader: 'ts-loader'
            }
        ]
    }
}
