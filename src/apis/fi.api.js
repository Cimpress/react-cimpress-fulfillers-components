const FulfillerIdentity = require('cimpress-fulfiller-identity');

function getFulfillers(token, options) {
    let fulfillerIdentity = new FulfillerIdentity('Bearer ' + token, {timeout: 8000});

    return fulfillerIdentity.getFulfillers(options)
}

export {
    getFulfillers
};
