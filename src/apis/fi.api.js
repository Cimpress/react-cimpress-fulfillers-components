import { EnvironmentKey } from "../utils/consts";

const FulfillerIdentity = require('cimpress-fulfiller-identity');

function getFulfillers(token, env, options) {
    let fulfillerIdentity = env === EnvironmentKey.Production
            ? new FulfillerIdentity('Bearer ' + token, { timeout: 8000 })
            : (env === EnvironmentKey.Staging
                ? new FulfillerIdentity('Bearer ' + token, { timeout: 8000, url: "https://fulfilleridentity.staging.trdlnk.cimpress.io" })
                : null);

    if (fulfillerIdentity === null) {
        throw new Error('Incorrect environment provided')
    }

    return fulfillerIdentity.getFulfillers(options)
}

export {
    getFulfillers
};
