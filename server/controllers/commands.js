const {startButtonMenu} = require("../utils/buttons");

const startBot = (ctx) => {
    ctx.reply('Welcome!', {
        ...startButtonMenu
    });
}

const startBooking = ctx => {
    ctx.scene.enter('BOOKING_WIZARD');
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
    login
}