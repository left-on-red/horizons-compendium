let post = require('./../requests.js').post;

async function start() {
    let token = process.argv[2];
    let username = process.argv[3];
    
    let body = await post('http://127.0.0.1/api/auth/init', { token: token, username: username });
    if (typeof body == 'object') { console.log(body.id) }
    else { console.log(body) }
}

start();