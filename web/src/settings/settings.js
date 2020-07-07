if (!localStorage.getItem('token')) { window.location.href = '/' }

let token = localStorage.getItem('token');

let avatar = document.getElementById('avatar');
let nameBox = document.getElementById('nameBox');
let idText = document.getElementById('idText');
let applyButton = document.getElementById('applyButton');

let avatarForm = document.getElementById('avatarForm');
let tokenUpload = document.getElementById('tokenUpload');
let avatarUpload = document.getElementById('avatarUpload');
let submitUpload = document.getElementById('submitUpload');

let alertBox = document.getElementById('alertBox');

function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

async function start() {
    let result = await request.get(`/api/auth/validate?token=${token}`);
    
    avatar.style.backgroundImage = `url(/images/avatars/${result.id})`;
    nameBox.value = result.name;
    idText.innerText = `(${result.id})`;

    tokenUpload.value = token;

    let hasChanged = false;
    let hasImage = false;

    avatar.addEventListener('click', function() { avatarUpload.click() });
    
    avatarUpload.addEventListener('change', async function(event) {
        let file = event.target.files[0];
        avatar.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        hasImage = true;

        applyButton.classList.remove('hidden');
    });

    nameBox.addEventListener('keyup', function(event) {
        if (nameBox.value == result.name && !hasImage) {
            applyButton.classList.add('hidden');
            hasChanged = false;
        }

        else {
            applyButton.classList.remove('hidden');
            hasChanged = true;
        }
    });

    applyButton.addEventListener('click', async function() {
        let wasUpdated = false;
        if (hasChanged) {
            let res = await request.patch('/api/auth/username', { token: token, username: nameBox.value });
            if (res == 409) {
                alertBox.innerText = 'there already exists a user with that name';
                alertBox.setAttribute('class', 'alert alert-danger');
                return;
            }

            if (res == 200) { wasUpdated = true }

            //let res = await request.formPost(`/images/avatars/${result.id}`, new FormData(avatarForm));
            //console.log(res);
        }

        if (hasImage) {
            let res = await request.formPost(`/images/avatars/${result.id}`, new FormData(avatarForm));
            wasUpdated = true;
        }

        if (wasUpdated) {
            alertBox.innerText = 'your profile has been updated successfully';
            alertBox.setAttribute('class', 'alert alert-success');
            return;
        }
    });
}

start();