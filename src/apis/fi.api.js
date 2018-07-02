const FulfillerIdentity = require('cimpress-fulfiller-identity');

function getFulfillers(token, options) {
    let fulfillerIdentity = new FulfillerIdentity('Bearer ' + token, {
        url: global.FULFILLER_IDENTITY_URL
    });

    return fulfillerIdentity.getFulfillers(options)
}

export {
    getFulfillers
};
