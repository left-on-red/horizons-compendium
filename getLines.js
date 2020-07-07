let fs = require('fs');
let excludes = [
    '/node_modules',
    '/.gitignore',
    '/package.json',
    '/package-lock.json',
    '/server.crt',
    '/server.key',
    '/gimp',
    '/.git',
    '/api/data',
    '/api/history',
    '/images/avatars',
    '/images/clothing',
    '/images/default',
    '/images/furniture',
    '/images/temp'
]

let paths = fs.readdirSync('./');

let count = 0;
let fcount = 0;

function recur(path) {
    let blacklisted = false;
    for (let e = 0; e < excludes.length; e++) { if (path.startsWith(excludes[e])) { blacklisted = true; break; } }

    if (!blacklisted) {
        console.log(path);
        let directory = fs.statSync(`.${path}`).isDirectory();
        if (directory) {
            let arr = fs.readdirSync(`.${path}`);
            for (let a = 0; a < arr.length; a++) {
                if (path == '/') { recur(`${path}${arr[a]}`) }
                else { recur(`${path}/${arr[a]}`) }
            }
        }

        else {
            let file = fs.readFileSync(`.${path}`, { encoding: 'utf8' });
            count += file.split('\n').length;
            fcount += 1;
        }
    }
}

recur('/');

console.log(`${fcount} total files @ ${count} lines`);