let post = require('./../requests.js').post;

async function start() {
    let token = process.argv[2];
    
    let body = await post('http://127.0.0.1/api/auth', { token: token });
    if (typeof body == 'object') { console.log(body.token) }
    else { console.log(body) }
}

start();