let types = [
    'hat',
    'top',
    'bottom',
    'dress',
    'accessory',
    'socks',
    'shoes',
    'bag',
    'umbrella'
];

let typeDropdownButton = document.getElementById('typeDropdownButton');
let typeDropdown = document.getElementById('typeDropdown');

for (let t = 0; t < types.length; t++) {
    let item = document.createElement('a');
    item.setAttribute('class', 'dropdown-item');
    item.innerText = types[t];

    item.addEventListener('click', function() {
        typeDropdownButton.innerText = item.innerText;
        update();
    });

    typeDropdown.appendChild(item);
}