let fs = require('fs');

module.exports = function(app) {
    app.get('/', function(request, response) {
        response.sendFile(`${__dirname}/src/index.html`);
    });

    app.get('/page', function(request, response) {
        response.send(`<html><body><h1>Page 2</h1></body></html>`);
    });

    app.get('/item', function(request, response) {
        response.send(`<html><body><h1>Item</h1></body></html>`);
    });

    for (let e in data) {
        app.get(`/data/${e}/*`, function(request, response) {
            let params = request.params[0].split('/');
            if (params[0] && !params[1]) {
                if (data[e][params[0]]) {
                    response.send(data[e][params[0]].name);
                }

                else { response.send(`<pre>item not found :/</pre>`) }
            }

            // 404 not found
            else { response.send(`404: Not Found`) }
        });
    }

    /*app.get('/data/*', function(request, response) {
        console.log(request.params);
        if (request.params[0] && !request.params[1]) {

        }
    });*/

    app.get('/*', function(request, response) {
        let path = `${__dirname}/src/${request.originalUrl.split('?')[0]}`;
        fs.exists(path, function(exists) {
            if (exists) { response.sendFile(path) }
            
            // 404 not found
            else { response.send(`404: Not Found`) }
        });
    });
}