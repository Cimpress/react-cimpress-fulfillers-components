const {resolve} = require('path');
const webpack = require('webpack');

module.exports = {
    entry:
        process.env.NODE_ENV === 'production'
            ? ['./index.jsx']
            : [
                'react-hot-loader/patch',
                // activate HMR for React

                'webpack-dev-server/client?http://localhost:8080',
                // bundle the client for webpack-dev-server
                // and connect to the provided endpoint

                'webpack/hot/only-dev-server',
                // bundle the client for hot reloading
                // only- means to only hot reload for successful updates

                './index.jsx'
                // the entry point of our app
            ],
    // Webpack config options on how to obtain modules
    resolve: {
        alias: {
            // @cimpress/react-components requires will be searched in src folder, not in node_modules
            '@cimpress/react-fl-fi-components/lib': resolve(__dirname, 'src'),
            '@cimpress/react-fl-fi-components': resolve(__dirname, 'src')
        },
        extensions: ['.js', '.jsx']
    },
    output: {
        filename: 'bundle.js',
        // the output bundle

        path: resolve(__dirname, 'dist-dev'),

        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, 'docs'),

    devtool: 'inline-source-map',

    devServer: {
        hot: true,
        // enable HMR on the server

        contentBase: resolve(__dirname, 'dist-dev'),
        // match the output path

        publicPath: '/'
        // match the output `publicPath`
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                use: ['url-loader']
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.NamedModulesPlugin()
        // prints more readable module names in the browser console on HMR updates
    ]
};
