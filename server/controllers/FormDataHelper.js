const FormData = require('form-data');

class FormDataHelper {
    static createFormData(data) {
        const form = new FormData();
        for (const key in data) {
            form.append(key, data[key]);
        }
        return form;
    }
}

module.exports = FormDataHelper;
