const axios = require('axios');
const Constants = require('../utils/Constants');
const FormDataHelper = require('./FormDataHelper');


class CosmosFitService {
    constructor(authorizationInstance) {
        this.auth = authorizationInstance;
    }

    async getListAppointmentsByDate(date) {
        if (!this.auth.hash) {
            await this.auth.getAccessToken();
        }
        console.error('start getListAppointmentsByDate:');

        try {
            const form = FormDataHelper.createFormData({
                establishment: 1,
                date,
                email: this.auth.email,
                hash: this.auth.hash,
                version: Constants.VERSION
            });

            const response = await axios.post(Constants.GET_BOOKINGS_LIST, form, {
                headers: {
                    ...form.getHeaders(),
                }
            });
            // console.error('response getListAppointmentsByDate:', JSON.stringify(response.data));

            return response.data?.booking?.reserves;
        } catch (error) {
            console.error('Error getListByDate:', error.response?.data || error.message);
            throw error;
        }
    }

    async createBooking(bookingId, date) {
        if (!this.auth.hash) {
            await this.auth.getAccessToken();
        }

        try {
            const form = FormDataHelper.createFormData({
                booking_id: bookingId,
                date,
                email: this.auth.email,
                hash: this.auth.hash,
                version: Constants.VERSION
            });

            const response = await axios.post(Constants.CREATE_BOOKING, form, {
                headers: {
                    ...form.getHeaders(),
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error createBooking:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = CosmosFitService;
