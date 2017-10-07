var path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        //each entry is mapping to a html page and include all js for they page (different page can have duplicate component import)
        //if you don't want one component to be duplicated, put it in common chunks
        index: [
            'webpack-hot-middleware/client',
            './src/client/js/index.js'
        ],
        // index2: './src/index2.js',
        // vendors: ['jquery','bootstrap'], //the first method to introduce bootstrap js
        // vendors: ['jquery','bootstrap/dist/js/bootstrap.min.js'], //the second method to introduce bootstrap js
        vendors: [
            "./src/client/js/vendors.js"
        ] //vendors.js include common chunks that need to be separated,
                               // this style of writing has the same functionality with above, except you can put all common trunk names in a seperate file
        //commonTrunk2: "" // commonTrunk2 can hold different common trunks beside vendors trunk

    },
    output: {
        filename: 'resources/js/[name].bundle.js',
        path: path.resolve(__dirname, '/dist'),
        publicPath: '/gladmustang/'
    },
    devtool: 'source-map', //inline-source-map
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ //各个common trunk中的内容不要有重复，否则重复的内容放在哪个common trunk中是没有规则的
            names: ['vendors', 'common'] // Specify the common bundle's name.
           // names: ['vendors', 'commonTrunk2','common'] // Specify the common bundle's name.
        }), //last 'common' will hold the webpack common facility

        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: "resources/css/[name].style.css",
            allChunks: true
        }),
        // new CopyWebpackPlugin([{
        //     from:  {
        //         glob: path.join(__dirname, 'public/dist/*'),
        //         dot: true
        //     },
        //     to: path.join(__dirname, 'public/dist/css')
        // }]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        new HtmlWebpackPlugin({
            title: 'Glad Editor',
            template: './src/client/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        // new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: 'css-loader',
                    },
                    publicPath: "../../"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'less-loader'],
                    publicPath: "../../"
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: require.resolve('file-loader'),
                // Exclude `js` files to keep "css" loader working as it injects
                // it's runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.js$/, /\.html$/, /\.json$/],
                options: {
                    outputPath: "resources/images/",
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: require.resolve('file-loader'),
                // Exclude `js` files to keep "css" loader working as it injects
                // it's runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.js$/, /\.html$/, /\.json$/],
                options: {
                    outputPath: "resources/fonts/",
                    name: '[name].[ext]',
                },
            },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     use: [
            //         'file-loader'
            //     ]
            // },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    }
};