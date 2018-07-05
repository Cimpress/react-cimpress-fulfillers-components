module.exports = (storybookBaseConfig, configType) => {
    storybookBaseConfig.module.rules.push({
              test: /\.css$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' }
              ]
    });

    return storybookBaseConfig;
};
