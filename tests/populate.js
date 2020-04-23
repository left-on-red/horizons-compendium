let request = require('request');

function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

let colors = ['red', 'blue', 'white', 'black', 'orange', 'yellow', 'green', 'pink', 'purple', 'test1', 'test2', 'test3']

async function start() {
    for (let i = 0; i < 25; i++) {
        request.post(
            'http://127.0.0.1/api/clothing',
            {
                json: {
                    token: 'testPass',
                    data: {
                        name: `Test Shirt ${i+1}`,
                        type: 'top',
                        colors: [colors[Math.floor(Math.random() * colors.length)]],
                        obtained: 'able sisters',
                        cataloggable: true,
                        value: Math.floor(Math.random() * 500) + 500
                    }
                }
            },

            function(error, response, body) {
                if (error) { return console.log(error) }
                console.log(`${body} - POST: Test Shirt ${i+1}`);
            }
        );
    }
}

start();