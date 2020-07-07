let fs = require('fs');
let crypto = require('crypto');
//let multer = require('multer');
let seed = require('seedrandom');

let multer = require('multer');
let upload = multer();

let gm = require('gm');

let ensured = [
    'avatars/',
    
    'clothing/',
    'clothing/catalog/',
    'clothing/worn/',
    
    'furniture/',
    'furniture/catalog/',
    'furniture/placed/',
    'furniture/customs/'
]

let imageArgs = {
    clothing: {
        catalog: {
            width: 270,
            height: 400,
            x: 185,
            y: 150
        },

        worn: {}
    },
    
    furniture: {
        catalog: {},
        placed: {},
        customs: {}
    }
}

let temps = {};

module.exports = function(app) {
    setInterval(function() {
        for (let t in temps) {
            // 24 hours
            if (Date.now() - temps[t] >= 86400000) {
                fs.unlinkSync(`${__dirname}/temp/${t}.png`);
                delete temps[t];
            }
        }
    }, 100);


    for (let e = 0; e < ensured.length; e++) {
        if (!fs.existsSync(`${__dirname}/${ensured[e]}`)) { fs.mkdirSync(`${__dirname}/${ensured[e]}`) }
    }

    let tempFiles = fs.readdirSync(`${__dirname}/temp`);
    for (let t = 0; t < tempFiles.length; t++) { fs.unlinkSync(`${__dirname}/temp/${tempFiles[t]}`) }

    app.get('/images/avatars/*', function(request, response) {
        if (request.params[0] && !request.params[1]) {
            for (let a in auths) {
                if (request.params[0] == auths[a].id) {
                    if (fs.existsSync(`${__dirname}/avatars/${request.params[0]}.png`)) { return response.sendFile(`${__dirname}/avatars/${request.params[0]}.png`) }
                    
                    let rng = seed(request.params[0]);
                    let num = Math.floor(rng() * 3) + 1;
                    return response.sendFile(`${__dirname}/default/${num}.png`);
                }
            }

            return response.sendStatus(404);
        }

        else { return response.sendStatus(400) }
    });

    app.post('/images/avatars/*', upload.single('avatar'), function(request, response, next) {
        if (request.params[0] && !request.params[1]) {
            for (let a in auths) {
                if (request.params[0] == auths[a].id) {
                    fs.writeFileSync(`${__dirname}/avatars/${request.params[0]}.png`, request.file.buffer);
                    return response.sendStatus(200);
                }
            }

            return response.sendStatus(401);
        }

        else { return response.sendStatus(400) }
    });

    app.get('/images/temp/:key/', function(request, response) {
        let key = request.params.key;

        if (temps[key] && fs.existsSync(`${__dirname}/temp/${key}.png`)) {
            temps[key] = Date.now();
            return response.sendFile(`${__dirname}/temp/${key}.png`);
        }

        else { response.send(404) }
    });

    // clothing
    app.post('/images/clothing/:type/:name/:color/', upload.single('image'), async function(request, response, next) {
        let type = request.params.type;
        let name = request.params.name;
        let color = request.params.color;

        if (request.body.token && auths[request.body.token]) {
            if (request.file) {
                if ((type == 'catalog' || type == 'worn') && data.clothing[name] && data.clothing[name].includes(color)) {
                    let args = imageArgs.clothing[type];
                    let magick = gm(request.file.buffer).setFormat('png');
                    magick.crop(args.width, args.height, args.x, args.y);

                    await syncWrite(magick, `${__dirname}/clothing/${type}/${name}/${color}.png`);
                    return response.sendStatus(200);
                }

                else { return response.sendStatus(404) }
            }

            else { return response.sendStatus(400) }
        }

        else { return response.sendStatus(401) }
    });

    app.get('/images/clothing/:type/:name/', function(request, response) {
        let type = request.params.type;
        let name = request.params.name;

        if (name == 'placeholder') { return response.sendFile(`${__dirname}/default/clothing.png`) }

        if ((type == 'catalog' || type == 'worn') && data.clothing[name]) {
            let color = data.clothing[name].colors[0];
            if (data.clothing[name].defaultColor) { color = data.clothing[name].defaultColor }

            if (fs.existsSync(`${__dirname}/clothing/${type}/${name}/${color}.png`)) { return response.sendFile(`${__dirname}/clothing/${type}/${name}/${color}.png`) }
            else { return response.sendFile(`${__dirname}/default/clothing.png`) }
        }

        else { return response.sendStatus(404) }
    });

    app.get('/images/clothing/:type/:name/:color/', function(request, response) {
        let type = request.params.type;
        let name = request.params.name;
        let color = request.params.color;

        if ((type == 'catalog' || type == 'worn') && data.clothing[name] && data.clothing[name].colors.includes(color)) {
            if (fs.existsSync(`${__dirname}/clothing/${type}/${name}/${color}.png`)) { return response.sendFile(`${__dirname}/clothing/${type}/${name}/${color}.png`) }
            else { return response.sendFile(`${__dirname}/default/clothing.png`) }
        }

        else { return response.sendStatus(404) }
    });

    // clothing temps
    app.post('/images/clothing/:type/temp/', upload.single('image'), async function(request, response, next) {
        let type = request.params.type;

        if (request.body.token && auths[request.body.token]) {
            if ((type == 'catalog' || type == 'worn') && request.file) {
                let args = imageArgs.clothing[type];
                let magick = gm(request.file.buffer).setFormat('png');
                magick.crop(args.width, args.height, args.x, args.y);

                crypto.randomBytes(16, async function(error, buffer) {
                    let name = buffer.toString('hex');
                    await syncWrite(magick, `${__dirname}/temp/${name}.png`);
                    temps[name] = Date.now();
                    return response.json({ tempKey: name });
                });
            }

            else { return response.sendStatus(400) }
        }

        else { return response.sendStatus(401) }
    });

    app.post('/images/clothing/:type/:name/:color/from/:key/', function(request, response) {
        let type = request.params.type;
        let name = request.params.name;
        let color = request.params.color;
        let key = request.params.key;

        if (request.body.token && auths[request.body.token]) {
            if ((type == 'catalog' || type == 'worn') && data.clothing[name] && data.clothing[name].colors.includes(color)) {
                if (temps[key] && fs.existsSync(`${__dirname}/temp/${key}.png`)) {
                    fs.copyFileSync(`${__dirname}/temp/${key}.png`, `${__dirname}/clothing/${type}/${name}/${color}.png`);
                    delete temps[key];
                    return response.sendStatus(200);
                }

                else { return response.sendStatus(404) }
            }

            else { return response.sendStatus(404) }
        }

        else { return response.sendStatus(401) }
    });
}

function syncWrite(magick, path) {
    return new Promise(function(resolve, reject) {
        magick.write(path, function(error) {
            if (error) { reject(error) }
            else { resolve() }
        });
    });
}