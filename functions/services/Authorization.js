const axios = require('axios');
const FormDataHelper = require('./FormDataHelper');
const UserData = require('../DB/UserData');
const Constants = require('../utils/Constants');
const FormData = require('form-data');


class Authorization {
    constructor(userId, email, password) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.hash = null;
        this.userData = null;
    }

    async getAccessToken() {
        try {
            console.log('start getAccessToken');

            if (!this.email || !this.password) {
                this.userData = new UserData();
                const {email, password, hash} = await this.userData.getUserById();
                this.email = email;
                this.password = password;
                this.hash = hash;
            }

            if (this.hash) {
                return this.hash;
            }

            // const form = FormDataHelper.createFormData({
            //     email: this.email,
            //     password: this.password,
            //     // device: JSON.stringify({"brand":"Apple","deviceName":"iPhone","deviceYearClass":2020,"manufacturer":"Apple","modelName":"iPhone 12 Pro","osVersion":"18.3"}),
            //     // push_token: "",
            //     version: Constants.VERSION
            // });

            var form = new FormData();
            console.log("this.email = ", this.email)
            console.log("this.password = ", this.password)
            console.log("version = ", Constants.VERSION)

            form.append('email', this.email);
            form.append('password', this.password);
            form.append('version', Constants.VERSION);

            console.log('start send getAccessToken');

            const response = await axios.post(Constants.LOGIN, form, {
                headers: { ...form.getHeaders() },
            });

            console.log('finish getAccessToken', JSON.stringify(response.data));

            this.hash = response.data?.user?.hash;
            await this.userData.updateUserInfo({userId: this.userId, hash: this.hash});
            return this.hash;
        } catch (error) {
            console.error('Error getting access token:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = Authorization;