module.exports = (storybookBaseConfig, configType) => {
    storybookBaseConfig.entry.preview = ['regenerator-runtime/runtime'].concat(storybookBaseConfig.entry.preview);

    return storybookBaseConfig;
};
