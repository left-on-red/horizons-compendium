let request = require('request');

module.exports = {
    post: function(url, obj) {
        return new Promise(function(resolve, reject) {
            request.post(url, { json: obj }, function(error, response, body) {
                if (error) { reject(error) }
                else { resolve(body) }
            });
        });
    },

    patch: function(url, obj) {
        return new Promise(function(resolve, reject) {
            request.patch(url, { json, obj }, function(error, response, body) {
                if (error) { reject(error) }
                else { resolve(body) }
            });
        });
    },

    delete: function(url, obj) {
        return new Promise(function(resolve, reject) {
            request.delete(url, { json, obj }, function(error, response, body) {
                if (error) { reject(error) }
                else { resolve(body) }
            });
        });
    }
}