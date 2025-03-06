const Constants = require('../utils/Constants');
const Authorization = require('./Authorization');
const CosmosFitService = require('./CosmosFitService');

const axios = require('axios');

class BookingFlow {
    constructor(userId) {
        this.userId = userId;
        this.retryCount = 0;
        this.cosmosFitService = new CosmosFitService(new Authorization(userId));
    }

    async initProcess(date, time, title) {
        try {
            console.log("start initProcess")

            const listOfAppointmentsByDate = await this.cosmosFitService.getListAppointmentsByDate(date);

            const appointmentToBook = listOfAppointmentsByDate.find(appointment => appointment.date === date && appointment.time === time && appointment.type.includes(title))
            
            if (!appointmentToBook) {
                console.log("Appointment Not Found")
                return;
            }

            this.bookAppointment(appointmentToBook.id, date)
        } catch (error) {
            console.log("error initProcess")
            console.log(error)
        }
    }

    async bookAppointment(eventId, date) {
        try {
            console.log('start bookAppointment at:', new Date().toISOString())

            const result = await this.cosmosFitService.createBooking(eventId, date);
            console.log("result=", JSON.stringify(result))

            if (result.add_event || result.message === Constants.ADDED_IN_QUEUE) {
                console.log('success bookAppointment at:', new Date().toISOString())
                return;
            }
            console.log("this.retryCount = ", this.retryCount)
            this.retryCount++;
            setTimeout(() => this.bookAppointment(eventId, date), 300);

        } catch (error) {
            console.log("this.retryCount = ", this.retryCount)
            console.log(error)
            this.retryCount++;
            this.bookAppointment(eventId, date)
        }
    }

}

module.exports = BookingFlow;
