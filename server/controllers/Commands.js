const {startButtonMenu} = require("../utils/Buttons");

const startBot = (ctx) => {
    ctx.reply('Welcome!', {
        ...startButtonMenu
    });
}


const startBooking = ctx => {
    ctx.scene.enter('BOOKING_WIZARD');
}

const showBookings = ctx => {
    ctx.scene.enter('REQUESTS_TO_BOOK_WIZARD');
}

const login = ctx => {
    ctx.scene.enter('LOGIN_WIZARD');
} 

const cancel = ctx => {
    ctx.reply('Operation is canceled', {
        ...startButtonMenu
    });
    return ctx.scene.leave();
}

module.exports = {
    startBot,
    cancel,
    startBooking,
    showBookings,
    login
}