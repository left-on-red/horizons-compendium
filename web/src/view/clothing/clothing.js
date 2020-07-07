let name = window.location.href.split('/')[window.location.href.split('/').length - 1].toLowerCase();

let images = {
    clothing: '/images/clothing/catalog'
}

let catalogImage = document.getElementById('catalogImage');
let wornImage = document.getElementById('wornImage');

let catalogLabel = document.getElementById('catalogLabel');
let wornLabel = document.getElementById('wornLabel');

let colors;

let colorLabel = document.getElementById('colorLabel');
let cataloggable = document.getElementById('cataloggable');
let eName = document.getElementById('name');
let eType = document.getElementById('type');
let eValue = document.getElementById('value');
let eObtained = document.getElementById('obtained');

function selectColor(color) {
    let cimgs = catalogImage.getElementsByTagName('img');
    for (let c = 0; c < cimgs.length; c++) { cimgs[c].classList.add('hidden') }
    let cimg = document.getElementById(`catalogImg-${color}`);
    if (cimg) { cimg.classList.remove('hidden') }

    let wimgs = wornImage.getElementsByTagName('img');
    for (let w = 0; w < wimgs.length; w++) { wimgs[w].classList.add('hidden') }
    let wimg = document.getElementById(`wornImg-${color}`);
    if (wimg) { wimg.classList.remove('hidden') }

    catalogImage.classList.remove('disabled');
    wornImage.classList.remove('disabled');

    colorLabel.innerText = color;
}

function shiftColor(offset) {
    if (colorLabel.innerText != '') {
        while (colorLabel.innerText != colors[0]) { wrap(colors, 1) }
        wrap(colors, offset);
        colorLabel.innerText = colors[0];
        selectColor(colors[0]);
    }
}

function wrap(array, offset) {
    if (array.length > 0) {
        if (offset > 0) { for (let i = 0; i < offset; i++) { array.unshift(array.pop()) } }
        else if (offset < 0) { for (let i = 0; i < Math.abs(offset); i++) { array.push(array.shift()) } }
    }
}

async function start() {
    let data = await request.get(`/api/clothing/${name}`);
    console.log(data);
    colors = data.colors;

    for (let c = 0; c < colors.length; c++) {
        let catalogImage = document.createElement('img');
        catalogImage.setAttribute('src', `/images/clothing/catalog/${name}/${colors[c]}`);
        catalogImage.setAttribute('id', `catalogImg-${colors[c]}`);
        catalogImage.classList.add('hidden');
        catalogLabel.before(catalogImage);

        let wornImage = document.createElement('img');
        wornImage.setAttribute('src', `/images/clothing/worn/${name}/${colors[c]}`);
        wornImage.setAttribute('id', `wornImg-${colors[c]}`);
        wornImage.classList.add('hidden');
        wornLabel.before(wornImage);
    }

    selectColor(data.defaultColor);

    if (data.cataloggable) { cataloggable.setAttribute('checked', '') }
    eName.innerText = data.name;
    eType.innerText = data.type;
    eValue.innerText = data.value;
    eObtained.innerText = data.obtained;
}

start();