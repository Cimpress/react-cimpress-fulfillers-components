const fulfillers = [];

for (let i = 1; i <= 50; i++) {
    let fulfiller = {
        name: `My Test Fulfiller ${i}`,
        internalFulfillerId: i,
        fulfillerId: `abcdef${i}`,
        archived: false
    };
    fulfillers.push(fulfiller);
}

for (let i = 51; i <= 100; i++) {
    let fulfiller = {
        name: `My Test Fulfiller ${i}`,
        internalFulfillerId: i,
        fulfillerId: `abcdef${i}`,
        archived: true
    };
    fulfillers.push(fulfiller);
}

module.exports = fulfillers;
