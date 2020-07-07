let request = require('request');

function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

let colors = ['red', 'blue', 'white', 'black', 'orange', 'yellow', 'green', 'pink', 'purple', 'test1', 'test2', 'test3']

async function start() {
    for (let i = 0; i < 25; i++) {
        let name = `PlaceHolder (0x${Math.floor(Math.random() * 1000000000).toString(16)})`;
        request.post(
            'http://127.0.0.1/api/clothing',
            {
                json: {
                    token: 'testtoken',
                    data: {
                        name: name,
                        type: 'top',
                        colors: [colors[Math.floor(Math.random() * colors.length)]],
                        defaultColor: "",
                        obtained: 'able sisters',
                        cataloggable: Math.floor(Math.random() * 2) == 0 ? true : false,
                        value: Math.floor(Math.random() * 500) + 500
                    }
                }
            },

            function(error, response, body) {
                if (error) { return console.log(error) }
                console.log(`${body} - POST: ${name}`);
            }
        );
    }
}

start();