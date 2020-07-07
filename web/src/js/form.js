function Form() {
    this.elements = [];
    this.form = document.createElement('form');

    this.form.setAttribute('enctype', 'multipart/form-data');
    this.form.setAttribute('method', 'POST');

    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');

    this.form.appendChild(submit);

    this.append = function(key, value) {
        let input = document.createElement('input');

        if (typeof value == 'string') { input.setAttribute('type', 'text') }
        else if (typeof value == 'number') { input.setAttribute('type', 'number') }

        input.setAttribute('name', key);
        input.value = value;

        this.form.appendChild(input);
    }

    this.addImage = function(key) {
        let self = this;
        return new Promise(function(resolve, reject) {
            let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.setAttribute('name', key);
            self.form.appendChild(input);
            input.click();

            input.addEventListener('change', resolve);
        });
    },

    this.post = function(url) {
        let self = this;
        return new Promise(function(resolve, reject) {
            request.formPost(url, new FormData(self.form)).then(function(response) {
                resolve(response);
            });
        });
    }
}