const BookingService = require('./controllers/BookingService');
const logger = require('./logger');

const express = require('express')
const app = express()
const port = 8080

app.get('/starBooking', async (req, res) => {
    logger.info("starBooking stated")
    const bookingService = new BookingService();
    await bookingService.bookAppointments();
    res.send('starBooking finished!')
})

app.get('/testApi', async (req, res) => {
    logger.info("Hello World")
    res.send('Hello World!')
})


app.get('/addTestData', async (req, res) => {
    logger.info("addTestData stated")
    await testFunction();
    res.send('addTestData finished!')
})


const { getRequestsToBookByDate, addBookingByDate } = require('./controllers/DBHelper');
const testFunction = async () => {
    let data = await getRequestsToBookByDate("2025-03-16");
    logger.info(data)
    await Promise.all(Object.values(data).map(async (request) => {
        addBookingByDate(request, "2025-03-20")
    }))
    // await removeBookingsByDate("2025-03-12")
    // data = await getRequestsToBookByDate("2025-03-16");

}



app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
})

// let intervalId = setInterval(async () => {
//     logger.info(`Scheduled function started`);
//     if (checkCurrentDate()) {
//             clearInterval(intervalId);
//             await bookSlots();
//     }
//     logger.info(`Scheduled function finished`);
// }, 60000)
