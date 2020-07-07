let fs = require('fs');
let categories = ['wallpaper', 'flooring', 'rugs', 'clothing', 'furniture', 'recipes', 'customization', 'events', 'shops', 'villagers', 'fish', 'bugs', 'art', 'fossils', 'tools', 'wands', 'materials']

let views = [ 'token', 'settings', 'logout' ];
let editors = [ 'clothing' ]

module.exports = function(app) {
    app.get('/', function(request, response) {
        response.sendFile(`${__dirname}/src/index.html`);
    });

    /*for (let v = 0; v < views.length; v++) {
        app.get(`/${views[v]}`, function(request, response) { response.sendFile(`${__dirname}/src/views/${views[v]}/${views[v]}.html`) });
        app.get(`/${views[v]}/${views[v]}.css`, function(request, response) { response.sendFile(`${__dirname}/src/views/${views[v]}/${views[v]}.css`) });
        app.get(`/${views[v]}/${views[v]}.js`, function(request, response) { response.sendFile(`${__dirname}/src/views/${views[v]}/${views[v]}.js`) });
    }

    for (let e = 0; e < editors.length; e++) {
        app.get(`/new/${editors[e]}`, function(request, response) { response.sendFile(`${__dirname}/src/views/new/${editors[e]}/${editors[e]}.html`) });
        app.get(`/new/${editors[e]}.css`, function(request, response) { response.sendFile(`${__dirname}/src/views/new/${editors[e]}/${editors[e]}.css`) });
        app.get(`/new/${editors[e]}.js`, function(request, response) { response.sendFile(`${__dirname}/src/views/new/${editors[e]}/${editors[e]}.js`) });
    }*/


    for (let v = 0; v < views.length; v++) {
        app.get(`/${views[v]}`, function(request, response) { response.sendFile(`${__dirname}/src/${views[v]}/${views[v]}.html`) });
    }

    for (let c = 0; c < categories.length; c++) {
        app.get(`/list/${categories[c]}`, function(request, response) {
            response.sendFile(`${__dirname}/src/list/list.html`);
        });

        app.get(`/${categories[c]}/*`, function(request, response) {
            let params = request.params[0].split('/');
            if (params[0] && !params[1]) {
                console.log('true!');
                if (data[categories[c]] && data[categories[c]][params[0]]) {
                    response.sendFile(`${__dirname}/src/view/${categories[c]}/${categories[c]}.html`);
                }
            }

            // 404
            else { response.sendFile(`${__dirname}/src/404.html`) }
        });
    }

    app.get('/new/*', function(request, response) {
        let params = request.params[0].split('/');

        if (params[0] && editors.includes(params[0])) {
            if (!params[1]) { return response.sendFile(`${__dirname}/src/new/${params[0]}/${params[0]}.html`) }
            else { return response.sendFile(`${__dirname}/src/new/${params.join('/')}`) }
        }

        else { return response.sendFile(`${__dirname}/src/404.html`) }
    });

    app.get('/*', function(request, response) {
        let path = `${__dirname}/src/${request.originalUrl.split('?')[0]}`;
        fs.exists(path, function(exists) {
            if (exists) { response.sendFile(path) }
            
            // 404
            else { response.sendFile(`${__dirname}/src/404.html`) }
        });
    });
}