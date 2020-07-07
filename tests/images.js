let post = require('./../requests.js').postForm;
let fs = require('fs');

async function start() {
    let token = process.argv[2];

    /*let form = new FormData();
    form.append('token', token);
    form.append('file', fs.readFileSync(`${__dirname}/image.jpg`));

    form.submit('http://127.0.0.1/images/clothing/catalog/test', function(error, response) {
        if (error) { throw error; }
        console.log(response.statusCode);
    })*/

    let form = {
        token: token,
        image: fs.createReadStream(`${__dirname}/image.jpg`)
    }


    let body = await post('http://127.0.0.1/images/clothing/catalog/testshirt1', form);
    console.log(body);
}

start();