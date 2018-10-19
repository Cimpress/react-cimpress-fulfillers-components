let webpack = require('webpack');

module.exports = {
    entry: [
        'regenerator-runtime/runtime',
        "./dev/index.js",
        ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    node: {
        fs: "empty"
    },
    resolveLoader: {
        modules: ['node_modules']
    },
    plugins: [
        new webpack.EnvironmentPlugin([
            "SERVICE_DEPENDENCIES"
        ])
    ]
};
