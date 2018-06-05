const FulfillmentLocationClient = require('cimpress-fulfillment-location');

let client = new FulfillmentLocationClient({
    log: defaultLogger,
    cacheConfig: {stdTTL: 4 * 60 * 60, checkperiod: 5 * 60}
});

function getFulfillmentLocations(token, options) {

    return client.getLocations('Bearer ' + token)
}

function getFulfillmentLocation(token) {
    return client.getLocation(fulfillmentLocationId, 'Bearer ' + token);
}

export {
    getFulfillmentLocations,
    getFulfillmentLocation
};