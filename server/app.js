require('dotenv').config()

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

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
})
