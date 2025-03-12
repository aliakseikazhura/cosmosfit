const { getRequestsToBookByDate, addBookingByDate, removeBookingsByDate } = require('./DBHelper');
const ExecutionService = require('./ExecutionService');
const Constants = require('../utils/Constants');
const logger = require('../../server/logger');


class BookingService {

    checkCurrentDate = () => {
        const now = new Date();
        // logger.info(`now.getHours() = ${now.getUTCHours()}, now.getMinutes() = ${now.getUTCMinutes()}`)
        return now.getUTCHours() === 4 && now.getUTCMinutes() === 59;
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
            let requestsToBook = await getRequestsToBookByDate(dateToBook);
            logger.info(`requestsToBook= ${JSON.stringify(requestsToBook)}`);
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
