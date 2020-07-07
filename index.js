let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let https = require('https');
let http = require('http');

let types = require('./datatypes.json').json;

if (!fs.existsSync(`./api/auth.json`)) { fs.writeFileSync(`./auth.json`, '{}') }
if (!fs.existsSync(`./api/data`)) { fs.mkdirSync(`./api/data`) }
if (!fs.existsSync(`./api/history`)) { fs.mkdirSync(`./api/history`) }

for (let t = 0; t < types.length; t++) {
    if (!fs.existsSync(`./api/data/${types[t]}`)) {
        fs.mkdirSync(`./api/data/${types[t]}`);
        fs.writeFileSync(`./api/history/${types[t]}.json`, '{}');
    }
}

global.auths = require('./api/auth.json');
global.defaults = {};
global.data = {};
global.history = {};
global.validations = {};
global.colors = [];

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
  })

let routes = ['api', 'images', 'web'];

for (let r = 0; r < routes.length; r++) {
    require(`./${routes[r]}/${routes[r]}.js`)(app);
}

let secured = false;

if (secured) {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    }, app).listen(443, function() { console.log(`secure server hosted at https://localhost:443`) })
}

else {
    http.createServer(app).listen(80, function() { console.log(`insecure server hosted at http://localhost:80`) })
}