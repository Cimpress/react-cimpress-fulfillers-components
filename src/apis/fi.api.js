const FulfillerIdentity = require('cimpress-fulfiller-identity');

function getFulfillers(token, options) {
    let fulfillerIdentity = new FulfillerIdentity('Bearer ' + token);

    return fulfillerIdentity.getFulfillers(options)
}

export {
    getFulfillers
};
