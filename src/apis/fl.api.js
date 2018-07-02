const FulfillmentLocationClient = require('cimpress-fulfillment-location');

let client = new FulfillmentLocationClient({
    cacheConfig: {stdTTL: 4 * 60 * 60, checkperiod: 5 * 60},
    url: global.FULFILLMENT_LOCATION_URL
});

function getFulfillmentLocations(token) {

    return client.getLocations('Bearer ' + token)
}

function getFulfillmentLocation(token, fulfillmentLocationId) {
    return client.getLocation(fulfillmentLocationId, 'Bearer ' + token);
}

export {
    getFulfillmentLocations,
    getFulfillmentLocation
};
