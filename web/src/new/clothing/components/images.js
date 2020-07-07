let hasImages = [];

let images = {
    catalog: {},
    worn: {}
}

let catalogImage = document.getElementById('catalogImage');
let wornImage = document.getElementById('wornImage');

let catalogLabel = document.getElementById('catalogLabel');
let wornLabel = document.getElementById('wornLabel');

catalogImage.addEventListener('click', async function() {
    if (colorLabel.innerText != '') {
        let form = new Form();
        form.append('token', localStorage.getItem('token'));
        await form.addImage('image');
        let response = await form.post(`/images/clothing/catalog/temp`);

        let img = document.getElementById(`catalogImg-${colorLabel.innerText}`);
        img.setAttribute('src', `/images/temp/${response.tempKey}`);

        images.catalog[colorLabel.innerText] = response.tempKey;
    }
});

wornImage.addEventListener('click', async function() {
    if (colorLabel.innerText != '') {
        let form = new Form();
        form.append('token', localStorage.getItem('token'));
        await form.addImage('image');
        let response = await form.post(`/images/clothing/worn/temp`);

        let img = document.getElementById(`wornImage-${colorLabel.innerText}`);
        img.setAttribute('src', `/images/temp/${response.tempKey}`);

        images.worn[colorLabel.innerText] = response.tempKey;
    }
});