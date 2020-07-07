let _host = `http://localhost`;
let request = {
    get: function(url) {
        return new Promise(function(resolve, reject) {
            let http = new XMLHttpRequest();
            http.open('GET', `${_host}${url}`);
            
            http.onerror = function(error) { reject(error) }

            http.onloadend = function(e) {
                let result = http.response;
                if (http.status != 200) { result = http.status }
                else { result = JSON.parse(result) }
                resolve(result);
            }

            http.send();
        });
    },

    post: function(url, body) {
        return new Promise(function(resolve, reject) {
            let http = new XMLHttpRequest();
            http.open('POST', `${_host}${url}`);
            http.setRequestHeader('Content-type', 'application/json');

            http.onerror = function(error) { reject(error) }
            http.onloadend = function(e) {
                let result;
                try { result = JSON.parse(http.response) }
                catch(e) { result = http.status }
                resolve(result);
            }

            http.send(JSON.stringify(body));
        });
    },

    formPost: function(url, body) {
        return new Promise(function(resolve, reject) {
            let http = new XMLHttpRequest();

            http.open('POST', `${_host}${url}`);
            http.onerror = function(error) { reject(error) }
            http.onloadend = function(e) {
                let result;
                if (http.response) { result = JSON.parse(http.response) }
                else { result = http.status }
                resolve(result);
            }

            http.send(body);
        });
    },

    patch: function(url, body) {
        console.log(body);
        return new Promise(function(resolve, reject) {
            let http = new XMLHttpRequest();
            http.open('PATCH', `${_host}${url}`);
            http.setRequestHeader('Content-type', 'application/json');

            http.onerror = function(error) { reject(error) }
            http.onloadend = function(e) {
                let result;
                if (typeof http.response == 'string') { result = http.status }
                else if (http.response) { result = JSON.parse(http.response) }
                resolve(result);
            }

            http.send(JSON.stringify(body));
        });
    }
}