function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() { resolve() }, ms);
    });
}

let colorsInput = document.getElementById('colorsInput');
let colorsList = document.getElementById('colorsList');

let addColorButton = document.getElementById('addColorButton');

let colorDefs = [];
let newly = [];

request.get(`/api/clothing/colors`).then(function(colors) {
    for (let c = 0; c < colors.length; c++) {
        let li = document.createElement('li');
        li.innerText = colors[c];
        li.setAttribute('onclick', `toggleColor("${colors[c]}")`);
        addColorButton.before(li);
    }
});

addColorButton.addEventListener('click', function() { addColor(colorsInput.value.toLowerCase()) })

colorsInput.addEventListener('keyup', function() {
    colorsInput.value = colorsInput.value.toLowerCase();
    if (event.key == 'Enter') {
        addToList(colorsInput.value);
        toggleColor(colorsInput.value);
        colorsInput.value = '';
    }

    populateColors();
});

addColorButton.addEventListener('click', function(event) {
    addToList(colorsInput.value);
    colorsInput.value = '';
    populateColors();
    update();
});

function toggleColor(color) {
    colorsInput.value = '';
    if (colorDefs.includes(color)) { removeColor(color) }
    else { addColor(color) }
    populateColors();
    update();
}

function removeColor(color) {
    if (newly.includes(color)) {
        removeFromList(color);
        newly.splice(newly.indexOf(color), 1);
    }

    colorDefs.splice(colorDefs.indexOf(color), 1);
    if (colorLabel.innerText == color) {
        if (colorDefs[0]) {
            selectColor(colorDefs[0]);
            colorLabel.innerText = colorDefs[0];
        }
        else {
            colorLabel.innerText = '';
            catalogImage.classList.add('disabled');
            wornImage.classList.add('disabled');
        }
    }
}

function addColor(color) {
    colorDefs.push(color);
    colorDefs.sort();
    
    let img = document.getElementById(`catalogImg-${color}`);

    if (!img) {
        let cimg = document.createElement('img');
        cimg.setAttribute('src', '/images/clothing/catalog/placeholder');
        cimg.setAttribute('id', `catalogImg-${color}`);
        cimg.setAttribute('class', 'hidden');
        catalogLabel.before(cimg);

        let wimg = document.createElement('img');
        wimg.setAttribute('src', '/images/clothing/worn/placeholder');
        wimg.setAttribute('id', `wornImg-${color}`);
        wimg.setAttribute('class', 'hidden');
        wornLabel.before(wimg);
    }

    if (colorLabel.innerText == '') { 
        colorLabel.innerText = color;
        selectColor(color);
    }
}

function addToList(color) {
    let exists = false;
    for (let c = 0; c < colorsList.children.length - 1; c++) { if (colorsList.children[c].innerText == color) { exists = true; break; } }

    if (!exists) {
        newly.push(color);
        let li = document.createElement('li');
        li.innerText = color;
        li.setAttribute('onclick', `toggleColor("${color}")`);
        addColorButton.before(li);
    }
}

function removeFromList(color) {
    for (let c = 0; c < colorsList.children.length - 1; c++) {
        if (colorsList.children[c].innerText == color) {
            colorsList.removeChild(colorsList.children[c]);
            break;
        }
    }
}

function populateColors() {
    let match = false;
    let items = colorsList.children;
    addColorButton.classList.remove('hidden');
    for (let i = 0; i < items.length - 1; i++) {
        items[i].setAttribute('class', '');
        if (colorDefs.includes(items[i].innerText)) { items[i].classList.add('selected') }
        if (colorsInput.value != '' && !items[i].innerText.startsWith(colorsInput.value.toLowerCase())) {
            items[i].classList.add('hidden');
        }

        if (colorsInput.value == items[i].innerText) { match = true }
    }

    if (match || colorsInput.value == '') { addColorButton.classList.add('hidden') }
}

function shiftColor(offset) {
    if (colorLabel.innerText != '') {
        while (colorLabel.innerText != colorDefs[0]) { wrap(colorDefs, 1) }
        wrap(colorDefs, offset);
        colorLabel.innerText = colorDefs[0];
        selectColor(colorDefs[0]);
    }
}

function wrap(array, offset) {
    if (array.length > 0) {
        if (offset > 0) { for (let i = 0; i < offset; i++) { array.unshift(array.pop()) } }
        else if (offset < 0) { for (let i = 0; i < Math.abs(offset); i++) { array.push(array.shift()) } }
    }
}

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
}

function deselectColor() {
    let cimgs = catalogImage.getElementsByTagName('img');
    for (let c = 0; c < cimgs.length; c++) { cimgs[c].classList.add('hidden') }
    let cimg = document.getElementById('disabledCatalogImage');
    if (cimg) { cimg.classList.remove('hidden') }

    let wimgs = catalogImage.getElementsByTagName('wimgs');
    for (let w = 0; w < wimgs.length; w++) { wimgs[w].classList.add('hidden') }
    let wimg = document.getElementById('disabledWornImage');
    if (wimg) { wimg.classList.remove('hidden') }

    catalogImage.classList.add('disabled');
    catalogImage.classList.add('disabled');
}