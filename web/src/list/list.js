let view = window.location.href.split('/')[window.location.href.split('/').length - 1].toLowerCase();

let newButton = document.getElementById('newButton');
newButton.setAttribute('href', `/new/${view}`);

let corresponds = {
    wallpaper: 'housing',
    flooring: 'housing',
    rugs: 'housing'
}

let disabled = [
    'wallpaper',
    'flooring',
    'rugs'
]

let images = {
    clothing: '/images/clothing/catalog'
}

let navs = document.getElementsByClassName('nav-link');
let container = document.getElementsByClassName('container')[0];

for (let n = 0; n < navs.length; n++) {
    if (navs[n].innerText == view || (corresponds[view] && corresponds[view] == navs[n].innerText)) {
        navs[n].parentElement.classList.add('active');
    }

    for (let d = 0; d < disabled.length; d++) {
        if (corresponds[disabled[d]] && corresponds[disabled[d]] == navs[n].innerText) {
            navs[n].classList.add('disabled');
        }
    }
}

if (disabled.includes(view)) { window.location.href }


function addItem(entry) {
    let a = document.createElement('a');
    a.setAttribute('href', `/clothing/${entry.name.toLowerCase().split(' ').join('')}`);

    let card = document.createElement('div');
    card.classList.add('card');

    let img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', `${images[view]}/${entry.name.toLowerCase().split(' ').join('')}`);

    let body = document.createElement('div');
    body.classList.add('card-body');

    let title = document.createElement('p');
    title.classList.add('card-title');
    title.innerText = entry.name;

    card.appendChild(img);
    body.appendChild(title);
    card.appendChild(body);
    a.appendChild(card);
    container.appendChild(a);
}

let offset = 0;
let length = 15;

async function start() {
    let data = await request.get(`/api/${view}?length=${length}&offset=${offset}`);
    for (let d = 0; d < data.length; d++) { addItem(data[d]) }
}

window.onscroll = async function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        offset += 20;
        let data = await request.get(`/api/${view}?length=${length}&offset=${offset}`);
        for (let d = 0; d < data.length; d++) {
            addItem(data[d])
        }
    }
}

start();