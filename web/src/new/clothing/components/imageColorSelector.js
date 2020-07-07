let colorLabel = document.getElementById('colorLabel');

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