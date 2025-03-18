const { getRequestsToBookByDate, getUserByChatId, addBookingByDate, addUserAccount } = require('./DBHelper');
const ExecutionService = require('./ExecutionService');
const Constants = require('../utils/Constants');
const logger = require('../logger');


class BookingService {

    async loginToApp(chatId, email, password) {
        const result = await ExecutionService.executePostRequest({email, password}, Constants.LOGIN);
        if (result.success) {
            await addUserAccount(chatId, {email, password, hash: result.user.hash});
        }
        return result;
    }

    async createRequestToBook(chatId, booking_id, date) {
        const userInfo = await getUserByChatId(chatId);
        if (!userInfo) {
            throw new Error("User doesn't exist");
        }
        const result = await addBookingByDate({booking_id, email: userInfo.email, hash: userInfo.hash}, date);
        logger.info(JSON.stringify(result))
    }

    async getPossibleAppointment(date, time) {
        const listOfAppointmentsByDate = await this.getListAppointmentsByDate(date);
        // logger.info("listOfAppointmentsByDate= ", JSON.stringify(listOfAppointmentsByDate))
        const appointmentToBook = listOfAppointmentsByDate?.booking?.reserves?.find(appointment => appointment.time === time);
        // logger.info("appointmentsToBook= ", JSON.stringify(appointmentToBook))
        return appointmentToBook;
    }

    async getListAppointmentsByDate(date) {
        try {
            return ExecutionService.executePostRequest({establishment: 1, date}, Constants.GET_BOOKINGS_LIST);
        } catch (error) {
            console.error('Error getListAppointmentsByDate:', error.response?.data || error.message);
            throw error;
        }
    } 

    getDateToBook = () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        return futureDate.toISOString().slice(0, 10);
    };

    getTimerDelay = () => {
        const endOfMinute = new Date();
        // Set seconds to 59 and milliseconds to 999 for the end of the current minute
        endOfMinute.setSeconds(59, 999);
        return endOfMinute - new Date();
    }

    async bookAppointments() {
        logger.info(`Scheduled function started at: ${new Date().toISOString()}`);

        try {
            const dateToBook = this.getDateToBook();
            console.log(dateToBook)
            let requestsToBook = await getRequestsToBookByDate(dateToBook);
            logger.info(`requestsToBook= ${JSON.stringify(requestsToBook)}`);
            if (!requestsToBook) {
                return;
            }
            requestsToBook = Object.values(requestsToBook).map(request => ({ ...request, date: dateToBook, version: Constants.VERSION }));
            // logger.info("requestsToBook=", JSON.stringify(requestsToBook));

            const timerDelay = this.getTimerDelay();
            logger.info(`dateToBook = ${dateToBook}`)
            logger.info(`timerDelay= ${timerDelay}`)

            logger.info(`Before timeout: ${new Date().toISOString()}`);
            setTimeout(async () => {
                logger.info(`SetTimeout started: ${new Date().toISOString()}`);
                await Promise.all(requestsToBook.map(request => this.bookSingleAppointment(request)));
                logger.info(`SetTimeout finished: ${new Date().toISOString()}`);
            }, timerDelay);

            logger.info(`Scheduled function finished at: ${new Date().toISOString()}`);
        } catch (error) {
            logger.info(`Error:`, error);
        }
    }

    async bookSingleAppointment(request, count = 0) {
        try {
            logger.info(`Before request. count: ${count}; request: ${request.booking_id}`)
            const result = await ExecutionService.executePostRequest(request, Constants.CREATE_BOOKING);
            logger.info(`After request. count: ${count}; request: ${request.booking_id} result = ${JSON.stringify(result)}`)

            if (result.add_event || result.message === Constants.ADDED_IN_QUEUE) {
                logger.info('success bookSingleAppointment')
                return;
            }
            if (count >= 3) {
                logger.info('count > 3; stop sending')
                return;
            }
            await this.bookSingleAppointment(request, count + 1);
        } catch (error) {
            logger.info(error)
        }
    }
}

module.exports = BookingService;
