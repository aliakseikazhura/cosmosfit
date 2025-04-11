const { Scenes, Composer } = require('telegraf');
const { WizardScene } = Scenes;
const { cancelButtonMenu, startButtonMenu } = require('../utils/Buttons1');
const { CMD_TEXT } = require('../utils/Constants');
const { cancel } = require('../controllers/Commands1');
const BookingService = require('../controllers/BookingService');


function isCancelOperator(ctx) {
    if (ctx.message.text.toLowerCase() === CMD_TEXT.cancelOperation.toLowerCase()) {
        return cancel(ctx);
    }
    return false;
}

// Step 0: Ask for email
const step0 = new Composer();
step0.on('text', (ctx) => {
    if (isCancelOperator(ctx)) return;
    ctx.reply('Enter email', {
        ...cancelButtonMenu
    });
    return ctx.wizard.next();
});

// Step 1: Ask for pass
const step1 = new Composer();
step1.on('text', (ctx) => {
    if (isCancelOperator(ctx)) return;
    ctx.session.email = ctx.message.text;
    ctx.reply('Enter password');
    return ctx.wizard.next();
});

// Step 2: Ask for time
const step2 = new Composer();
step2.on('text', async (ctx) => {
    if (isCancelOperator(ctx)) return;

    ctx.session.password = ctx.message.text;
    ctx.reply('Trying to login');

    const bookingService = new BookingService();
    const result = await bookingService.loginToApp(ctx.chat.id, ctx.session.email, ctx.session.password);
    
    ctx.deleteMessage();
    ctx.reply(result.success ? `You successfully authorized` : `Incorrect login or password`, {
        ...startButtonMenu
    });
    return ctx.scene.leave();
});


// Wizard scene
const bookingWizard = new WizardScene('LOGIN_WIZARD', step0, step1, step2);

module.exports = bookingWizard
