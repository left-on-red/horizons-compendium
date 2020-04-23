let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let fs = require('fs');

let types = require('./datatypes.json');

if (!fs.existsSync(`./auth.json`)) { fs.writeFileSync(`./auth.json`, '{}') }
for (let t = 0; t < types.json.length; t++) {
    if (!fs.existsSync(`./api/data/${types[t]}`)) { fs.writeFileSync(`./api/data/${types[t]}`, '{}') }
}

global.auths = require('./auth.json');
global.defaults = {};
global.data = {};
global.history = {};
global.validations = {};
global.colors = [];

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let routes = ['api', 'web'];

for (let r = 0; r < routes.length; r++) {
    require(`./${routes[r]}/${routes[r]}.js`)(app);
}

let server = app.listen(80, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`listening at http://${host}:${port}`);
});