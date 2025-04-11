const { getRequestsByDate, getUserByChatId, addBookingByDate, addUserAccount, getRequestsByChatId} = require('./DBHelper');
const ExecutionService = require('./ExecutionService');
const Constants = require('../utils/Constants');
const logger = require('../logger');


class BookingService {
    
    generateGUID = () => {
        return crypto.randomUUID().replace(/-/g, '');
    }

    async loginToApp(chatId, email, password) {
        const result = await ExecutionService.executePostRequest({email, password}, Constants.LOGIN);
        if (result.success) {
            await addUserAccount({email, password, chatId, hash: result.user.hash});
        }
        return result;
    }

    async getUserRequests(chatId) {
        return getRequestsByChatId(chatId);
    }

    async createRequestToBook(bookingInfo, chatId) {
        const userInfo = await getUserByChatId(chatId);
        if (!userInfo) {
            throw new Error("User doesn't exist");
        }
        const result = await addBookingByDate({...bookingInfo, email: userInfo.email, hash: userInfo.hash}, chatId);
        logger.info(JSON.stringify(result))
    }

    async getPossibleAppointment(date, time) {
        const listOfAppointmentsByDate = await this.getListAppointmentsByDate(date);
        const appointmentToBook = listOfAppointmentsByDate?.booking?.reserves?.find(appointment => appointment.time === time);
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
            let requestsToBook = await getRequestsByDate(dateToBook);
            logger.info(`requestsToBook= ${JSON.stringify(requestsToBook)}`);
            if (!requestsToBook) {
                return;
            }
            requestsToBook = Object.values(requestsToBook).map(request => ({ ...request, version: Constants.VERSION }));

            const timerDelay = this.getTimerDelay();
            logger.info(`dateToBook = ${dateToBook}`)
            logger.info(`timerDelay= ${timerDelay}`)

            setTimeout(async () => {
                logger.info(`SetTimeout started: ${new Date().toISOString()}`);
                await Promise.all(requestsToBook.map(request => this.bookSingleAppointment(request)));
            }, timerDelay);

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
