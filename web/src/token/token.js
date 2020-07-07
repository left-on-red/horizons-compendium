let container = document.getElementById('tokenContainer');
let initContainer = document.getElementById('initContainer');
let resultContainer = document.getElementById('resultContainer');

let tokenBox = document.getElementById('tokenInput');
let nameBox = document.getElementById('nameInput');

let welcomeText = document.getElementById('welcomeText');
let idText = document.getElementById('idText');

tokenBox.addEventListener('keydown', function(event) { if (event.key == 'Enter') { authorize() } });

function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

if (localStorage.getItem('token')) {
    window.location.href = '/';
}

async function authorize() {
    let token = tokenBox.value;
    let container = document.getElementById('tokenContainer');
    let result = await request.get(`/api/auth/validate?token=${token}`);
    if (result == 404) {
        container.classList.add('error');
        tokenBox.value = '';
    }

    else {
        container.style.opacity = '0';
        await sleep(500);
        complete(result);
    }
}


async function complete(result) {
    if (result.startup) {
        container.classList.add('hidden');
        initContainer.classList.remove('hidden');
        await sleep(500);
        initContainer.style.opacity = '100';

        nameBox.addEventListener('keydown', async function(event) {
            if (event.key == 'Enter') {
                if (nameBox.value != '') {
                    let data = await request.post(`/api/auth/init`, { token: tokenBox.value, username: nameBox.value });
                    if (data == 409) {
                        initContainer.classList.add('error');
                    }

                    else if (typeof data != 'number') {
                        initContainer.style.opacity = '0';
                        await sleep(500);
                        initContainer.classList.add('hidden');

                        welcomeText.innerText = `Welcome, ${nameBox.value}!`;
                        idText.innerText = `(${data.id})`;

                        resultContainer.classList.remove('hidden');
                        await sleep(100);
                        resultContainer.style.opacity = '100';
                        localStorage.setItem('token', tokenBox.value)
                    }
                }
            }
        });
    }

    else {
        container.style.opacity = '0';
        await sleep(500);
        container.classList.add('hidden');

        welcomeText.innerText = `Welcome back, ${result.name}!`;
        idText.innerText = `(${result.id})`;

        resultContainer.classList.remove('hidden');
        await sleep(100);
        resultContainer.style.opacity = '100';
        localStorage.setItem('token', tokenBox.value);
    }
}
