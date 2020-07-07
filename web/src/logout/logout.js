function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

let text = document.getElementById('text');
let progress = document.getElementById('progressFG');

async function start() {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        text.innerText = 'you have been logged out successfully';
        progress.classList.add('active');
        await sleep(3200);
        window.location.href = '/';
    }

    else { window.location.href = '/' }
}

start();