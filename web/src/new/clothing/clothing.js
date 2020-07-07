function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

let defaults = {
    name: '',
    value: 1,
    obtained: '',
    colors: [],
    cataloggable: null,
    type: ''
}

let submitBtn = document.getElementById('submitBtn');
let submitOverlay = document.getElementById('submitOverlay');
let submitUl = document.getElementById('submitUl');
let confirmBtn = document.getElementById('confirmBtn');

let exiting = false;

// cloning the defaults object
let form = JSON.parse(JSON.stringify(defaults));
form.cataloggable = false;

function validate() {
    let valid = true;
    for (let d in form) { if (form[d] == defaults[d]) { valid = false } }
    valid = (valid && form.colors.length > 0);
    return valid;
}

function update() {
    form.name = nameBox.value;
    form.value = valueBox.value != '' ? parseInt(valueBox.value) : 1;
    form.obtained = obtainedBox.value;
    form.colors = colorDefs;
    form.cataloggable = cataloggable.checked;
    form.type = typeDropdownButton.innerText != 'type' ? typeDropdownButton.innerText : '';

    let valid = validate();

    if (valid) { submitBtn.classList.remove('disabled') }
    else { submitBtn.classList.add('disabled') }
}

let selectedDefault = '';

function toggleDefault(color) {
    if (selectedDefault == color) { return }

    for (let c = 0; c < submitUl.children.length; c++) {
        if (submitUl.children[c].innerText == color) { submitUl.children[c].classList.add('active'); selectedDefault = color; }
        else { submitUl.children[c].classList.remove('active') }
    }

    if (selectedDefault == '') { confirmBtn.classList.add('disabled') }
    else { confirmBtn.classList.remove('disabled') }
}

function submit() {
    if (validate()) {
        submitUl.innerHTML = '';
        for (let c = 0; c < colorDefs.length; c++) {
            let li = document.createElement('li');
            li.setAttribute('onclick', `toggleDefault("${colorDefs[c]}")`);
            li.innerText = colorDefs[c];
            submitUl.appendChild(li);
        }

        confirmBtn.classList.add('disabled');

        submitOverlay.classList.remove('hidden');
    }
}

function cancel() {
    submitOverlay.classList.add('hidden');
    selectedDefault = '';
}

async function confirm() {
    if (validate() && selectedDefault != '') {
        let data = JSON.parse(JSON.stringify(form));
        data.defaultColor = selectedDefault;

        let name = data.name.toLowerCase().split(' ').join('');

        await request.post(`/api/clothing/`, { token: localStorage.getItem('token'), data: data });

        for (let t in images) { for (k in images[t]) { await request.post(`/images/clothing/${t}/${name}/${k}/from/${images[t][k]}/`, { token: localStorage.getItem('token') }) } }

        exiting = true;
        window.location.href = '/list/clothing';
    }
}

window.onbeforeunload = function() { if (!exiting) { return `changes that you've made may not be saved` } }