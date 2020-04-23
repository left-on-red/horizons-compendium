let http = require('http');

let request = require('request');

function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

async function start() {
    setInterval(function() {
        let start = Date.now();
        request('http://127.0.0.1/api/clothing?mode=data&length=20&offset=2', function(error, response, body) {
            let end = Date.now();
            let difference = end - start;

            console.log(`${response.statusCode} @ ${difference}ms`);
        });
    }, 5000);
}

start();