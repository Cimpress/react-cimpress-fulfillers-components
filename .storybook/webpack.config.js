module.exports = (storybookBaseConfig, configType) => {
    storybookBaseConfig.entry.preview = ['regenerator-runtime/runtime'].concat(storybookBaseConfig.entry.preview);
    storybookBaseConfig.module.rules.push({
              test: /\.css$/,
              use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' }
              ]
    });

    return storybookBaseConfig;
};
