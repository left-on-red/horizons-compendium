let fs = require('fs');
let crypto = require('crypto');
//let multer = require('multer');

// initializing data

let imageSchemes = {
    clothing: [
        'catalog',
        'worn'
    ]
}

let defaultsFolder = fs.readdirSync('./api/defaults');
let dataFolder = fs.readdirSync('./api/data');
let historyFolder = fs.readdirSync('./api/history');
let validationsFolder = fs.readdirSync('./api/validations');

let colors = [];

// defaults
for (let f = 0; f < defaultsFolder.length; f++) {
    defaults[defaultsFolder[f].split('.json')[0]] = require(`./defaults/${defaultsFolder[f]}`);
}

// data
for (let d = 0; d < dataFolder.length; d++) {
    data[dataFolder[d]] = {};
    let files = fs.readdirSync(`./api/data/${dataFolder[d]}`);
    for (let f = 0; f < files.length; f++) {
        data[dataFolder[d]][files[f].split('.json')[0]] = require(`./data/${dataFolder[d]}/${files[f]}`);
    }
}

// history
for (let h = 0; h < historyFolder.length; h++) {
    history[historyFolder[h].split('.js')[0]] = require(`./history/${historyFolder[h]}`);
}

// validations
for (let v = 0; v < validationsFolder.length; v++) {
    validations[validationsFolder[v].split('.js')[0]] = require(`./validations/${validationsFolder[v]}`);

}

// colors (clothing)
for (let c in data.clothing) {
    for (let i = 0; i < data.clothing[c].colors.length; i++) {
        if (!colors.includes(data.clothing[c].colors[i])) { colors.push(data.clothing[c].colors[i]) }
    }
}

module.exports = function(app) {
    for (let d in data) {
        app.get(`/api/${d}`, function(request, response) {
            let query = request.query;

            let length = 10;
            let offset = 0;
            let search = '';

            if (query.length) { if (!isNaN(query.length)) { length = parseInt(query.length) } }
            if (query.offset) { if (!isNaN(query.offset)) { offset = parseInt(query.offset) } }
            if (query.search) { search = query.search }

            let arr = [];
            
            for (let f in data[d]) { arr.push(data[d][f]) }
            if (search != '') { arr = arr.filter(obj => obj.name.startsWith(search.toLowerCase().split(' ').join('').startsWith(search.toLowerCase().split(' ').join('')))) }

            arr = arr.slice(offset, offset + length);
            response.json(arr);
        });

        app.get(`/api/${d}/*`, function(request, response) {
            if (request.params[0] && !request.params[1]) {
                if (data[d][request.params[0]]) {
                    response.json(data[d][request.params[0]]);
                }

                else {
                    if (request.params[0] == 'history') {
                        let arr = [];
                        for (let h in history[d]) {
                            arr.push({ item: h, action: 'POST', timestamp: history[d][h].createdAt, data: null });
                            for (let c = 0; c < history[d][h].changes.length; c++) {
                                arr.push({ item: h, action: 'PATCH', timestamp: history[d][h].changes[c].timestamp, before: history[d][h].changes[c].before });
                            }
                        }

                        arr.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
                        response.json(arr);
                    }

                    else if (d == 'clothing' && request.params[0] == 'colors') {
                        response.json(colors);
                    }

                    else { return response.sendStatus(404) }
                }
            }

            else { return response.sendStatus(404) }
        });

        app.patch(`/api/${d}/*`, function(request, response) {
            if (request.params[0] && !request.params[1]) {
                let name = request.params[0];
                if (data[d][name]) {
                    let auth = '';
                    if (request.body.token) { auth = request.body.token }

                    if (auths[auth] && !auths[auth].startup) {
                        if (request.body.data && Object.entries(request.body.data).length != 0) {
                            for (let k in request.body.data) {
                                if (data[d][name][k] != undefined) {
                                    if (k != 'name') {
                                        if (typeof request.body.data[k] == typeof data[d][name][k]) {
                                            if (data[d][name][k] instanceof Array && !(request.body.data[k] instanceof Array)) { return response.sendStatus(400) }
                                            if (data[d][name][k] === request.body.data[k]) { return response.sendStatus(406) }
                                        }
    
                                        else { return response.sendStatus(400) }
                                    }
    
                                    else { return response.sendStatus(400) }
                                }
    
                                else { return response.sendStatus(400) }
                            }
    
                            let change = JSON.parse(JSON.stringify(defaults.history.change));

                            for (let k in request.body.data) {
                                change.before[k] = JSON.parse(JSON.stringify(data[d][name][k]));
                                data[d][name][k] = request.body.data[k];
                            }
    
                            
                            change.author = auths[auth].id;
                            change.timestamp = Date.now();
                            change.patch = request.body.data;
    
                            history[d][name].changes.push(change);
                            response.sendStatus(200);
    
                            fs.writeFileSync(`./api/history/${d}.json`, JSON.stringify(history[d], null, 4));
                            fs.writeFileSync(`./api/data/${d}/${name}.json`, JSON.stringify(data[d][name], null, 4));
                        }

                        else { return response.sendStatus(400) }
                    }

                    else { return response.sendStatus(401) }
                }

                else { return response.sendStatus(404) }
            }

            else { return response.sendStatus(404) }
        });

        app.post(`/api/${d}`, function(request, response) {
            let auth = '';

            if (request.body.token) { auth = request.body.token }

            if (auths[auth] && !auths[auth].startup) {
                if (request.body.data && Object.entries(request.body.data).length != 0) {
                    let obj = JSON.parse(JSON.stringify(defaults[d]));
                    for (let k in request.body.data) {
                        // validating that all of the typings match up
                        if (obj[k] != undefined) {
                            if (typeof obj[k] == typeof request.body.data[k] || request.body.data[k] == null) {
                                // all arrays are objects, but not all objects are arrays
                                if (request.body.data[k] instanceof Array && !(obj[k] instanceof Array)) { return response.sendStatus(400) }
                                // validating arrays (only arrays of strings are permitted)
                                if (request.body.data[k] instanceof Array && obj[k] instanceof Array) {
                                    for (let a = 0; a < obj[k].length; a++) {
                                        if (typeof obj[k][a] != 'string') { return response.sendStatus(400) }
                                    }
                                }
        
                                // negative numbers aren't permitted
                                if (typeof request.body.data[k] == 'number' && request.body.data[k] < 0) { return response.sendStatus(400) }
        
                                obj[k] = request.body.data[k];
                            }
                            
                            else { return response.sendStatus(400) }
                        }

                        else { return response.sendStatus(400) }
                    }

                    if (obj.name != '') {
                        let key = obj.name.toLowerCase().split(' ').join('');
                        if (!data[d][key]) {
                            if (validations[d](obj)) {
                                history[d][key] = JSON.parse(JSON.stringify(defaults.history.item));
                                history[d][key].author = auth;
                                history[d][key].createdAt = Date.now();
                                data[d][key] = obj;

                                fs.writeFileSync(`./api/data/${d}/${key}.json`, JSON.stringify(obj, null, 4), 'utf8');
                                fs.writeFileSync(`./api/history/${d}.json`, JSON.stringify(history[d], null, 4), 'utf8');

                                let assets = imageSchemes[d];
                                for (let i = 0; i < assets.length; i++) { fs.mkdirSync(`./images/${d}/${assets[i]}/${key}`) }

                                response.sendStatus(201);

                                if (obj.colors) {
                                    for (let c = 0; c < obj.colors.length; c++) {
                                        let color = obj.colors[c].toLowerCase();
                                        if (!colors.includes(color)) {
                                            colors.push(color);
                                            colors.sort();
                                        }
                                    }
                                }

                                console.log(`created resource ${d}/${key}`);
                            }

                            else { response.sendStatus(400) }
                        }

                        else { return response.sendStatus(409) }
                    }

                    else { return response.sendStatus(400) }
                }

                else { return response.sendStatus(400) }
            }

            else { return response.sendStatus(401) }
        });

        app.delete(`/api/${d}/*`, function(request, response) {
            if (request.params[0] && !request.params[1]) {
                let name = request.params[0];
                if (data[d][name]) {
                    let auth = '';
                    if (request.body.token) { auth = request.body.token }

                    if (((auths[auth] && history[d][name].author == auth) || (auths[auth] && auths[auth].master)) && !auths[auth].startup) {
                        delete data[d][name];
                        delete history[d][name];
                        
                        response.sendStatus(200);

                        fs.writeFileSync(`./api/history/${d}.json`, JSON.stringify(history[d], null, 4));
                        fs.unlinkSync(`./api/data/${d}/${name}.json`);
                    }

                    else { return response.sendStatus(401) }
                }

                else { return response.sendStatus(404) }
            }

            else { return response.sendStatus(404) }
        });

        console.log(`created endpoint /api/${d}`);
    }

    app.post('/api/auth', function(request, response) {
        let auth = '';
        if (request.body.token) { auth = request.body.token }

        if (auths[auth] && auths[auth].master) {
            crypto.randomBytes(32, function(error, buffer) {
                if (error) { return response.sendStatus(500) }
                let token = buffer.toString('hex');

                auths[token] = {
                    id: null,
                    name: null,
                    master: false,
                    startup: true
                }

                response.json({ token: token });

                fs.writeFileSync(`./api/auth.json`, JSON.stringify(auths, null, 4), 'utf8');
            });
        }

        else { return response.sendStatus(401) }
    });

    app.get('/api/auth/validate', function(request, response) {
        let token = '';
        if (request.query.token) { token = request.query.token }

        if (token != '') {
            for (let a in auths) {
                if (token == a) { return response.json(auths[a]) }
            }

            return response.sendStatus(404);
        }

        else { return response.sendStatus(400) }
    });

    app.post('/api/auth/init', function(request, response) {
        let auth = '';
        let username = '';
        if (request.body.token) { auth = request.body.token }
        if (request.body.username) { username = request.body.username }

        if (auths[auth] && auths[auth].startup) {
            if (username != '') {
                for (a in auths) { if (auths[a].name == username) { return response.sendStatus(409) } }
                crypto.randomBytes(16, function(error, buffer) {
                    if (error) { return response.sendStatus(500) }
                    let id = buffer.toString('hex');
                    auths[auth].id = id;
                    auths[auth].name = username;
                    auths[auth].startup = false;

                    response.json({ id: id });

                    fs.writeFileSync(`./api/auth.json`, JSON.stringify(auths, null, 4), 'utf8');
                });
            }

            else { return response.sendStatus(400) }
        }

        else { return response.sendStatus(401) }
    });

    app.patch('/api/auth/username', function(request, response) {
        let auth = '';
        let username = '';

        if (request.body.token) { auth = request.body.token }
        if (request.body.username) { username = request.body.username }

        if (auths[auth] && !auths[auth].startup) {
            if (username != '') {
                for (a in auths) {
                    if (auths[a].name == username) { return response.sendStatus(409) }
                }

                if (auths[auth].name != username) {
                    auths[auth].name = username;
                    response.sendStatus(200);

                    fs.writeFileSync(`./api/auth.json`, JSON.stringify(auths, null, 4), 'utf8');
                }

                else { return response.sendStatus(409) }
            }

            else { return response.sendStatus(400) }
        }

        else { return response.sendStatus(401) }
    });

    app.get('/api/username', function(request, response) {
        let id = '';
        if (request.query.id) { id = request.query.id }

        if (id != '') {
            for (let a in auths) {
                if (auths[a].id == id) {
                    return response.json({ username: auths[a].name })
                }
            }

            return response.sendStatus(404);
        }

        else { return response.sendStatus(400) }
    });
}