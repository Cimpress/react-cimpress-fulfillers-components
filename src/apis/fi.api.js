const FulfillerIdentity = require('cimpress-fulfiller-identity');

let fulfillerIdentity = null;
let latestToken = null;

function getFulfillers(token, options) {

    if ( token !== latestToken ) {
        fulfillerIdentity = new FulfillerIdentity('Bearer ' + token);
    }

    return fulfillerIdentity.getFulfillers(options)
}

export {
    getFulfillers
};
