const { Markup } = require('telegraf');
const { CMD_TEXT } = require('./Constants');

const startButtonMenu =
    Markup.keyboard([
        [CMD_TEXT.startBooking],
        [CMD_TEXT.showBookings],
        [CMD_TEXT.login]
    ]).resize()

const cancelButtonMenu =
    Markup.keyboard([
        [CMD_TEXT.cancelOperation],
    ]).resize()


const confirmBookingButtons = 
    Markup.inlineKeyboard([
        Markup.button.callback('Confirm', 'CONFIRM_APPOINTMENT'),
        Markup.button.callback('Cancel', 'CANCEL_APPOINTMENT')
    ]).resize()

module.exports = {
    startButtonMenu,
    cancelButtonMenu,
    confirmBookingButtons
}