const { Scenes, Composer } = require('telegraf');
const { WizardScene } = Scenes;
const { cancelButtonMenu, confirmBookingButtons, startButtonMenu } = require('../utils/Buttons1');
const { CMD_TEXT } = require('../utils/Constants');
const { cancel } = require('../controllers/Commands');
const BookingService = require('../controllers/BookingService');

// Function to validate date format (YYYY-MM-DD)
function isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Function to validate time format (HH:MM)
function isValidTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function isCancelOperator(ctx) {
    if (ctx.message.text.toLowerCase() === CMD_TEXT.cancelOperation.toLowerCase()) {
        return cancel(ctx);
    }
    return false;
}

// Step 0: Ask for date
const step0 = new Composer();
step0.on('text', (ctx) => {
    if (isCancelOperator(ctx)) return;
    ctx.reply('Enter the date in the format: YYYY-MM-DD', {
        ...cancelButtonMenu
    });
    return ctx.wizard.next();
});

// Step 1: Ask for date
const step1 = new Composer();
step1.on('text', (ctx) => {
    if (isCancelOperator(ctx)) return;
    if (!isValidDate(ctx.message.text)) {
        return ctx.reply('Invalid date format. Please enter the date in YYYY-MM-DD format (e.g., 2025-03-20).');
    }
    ctx.session.appointmentDate = ctx.message.text;
    ctx.reply('Date saved. Now enter the time (e.g., 14:30)');
    return ctx.wizard.next();
});

// Step 2: Ask for time
const step2 = new Composer();
step2.on('text', async (ctx) => {
    if (isCancelOperator(ctx)) return;
    if (!isValidTime(ctx.message.text)) {
        return ctx.reply('Invalid time format. Please enter the time in HH:MM format (e.g., 14:30).');
    }
    ctx.session.appointmentTime = ctx.message.text;
    ctx.reply('Looking for available sessions');

    const bookingService = new BookingService();
    const appointment = await bookingService.getPossibleAppointment(ctx.session.appointmentDate, ctx.session.appointmentTime);

    if (!appointment) {
        ctx.reply(`Appointment not found`,{
            ...startButtonMenu
        })
        return ctx.scene.leave();
    }
    ctx.session.booking_id = appointment.id;
    ctx.session.time = appointment.time;
    ctx.session.type = appointment.type;
    ctx.session.lastMessageId = ctx.message.message_id;

    ctx.reply(`Confirm your appointment:\n${appointment.date} at ${appointment.time}\nTitle: ${appointment.type}\nCoach: ${appointment.coach}`,{
        ...confirmBookingButtons
    })
    .then((sentMessage) => {
        ctx.session.messageIdToChange = sentMessage.message_id; // Store the message ID
    });

    return ctx.wizard.next();
});

// Step 3: Confirmation
const step3 = new Composer();
step3.action('CONFIRM_APPOINTMENT', async (ctx) => {
    try {
        const bookingService = new BookingService();
        await bookingService.createRequestToBook({booking_id: ctx.session.booking_id, date: ctx.session.appointmentDate, time: ctx.session.time, type: ctx.session.type}, ctx.chat.id);
    
        ctx.deleteMessage();

        ctx.reply(`Request is created for ${ctx.session.appointmentDate} at ${ctx.session.appointmentTime}.`, {
            ...startButtonMenu
        });
        return ctx.scene.leave();
    } catch (error) {
        ctx.reply(error.message, {
            ...startButtonMenu
        });
        return ctx.scene.leave();
    }

});

step3.action('CANCEL_APPOINTMENT', (ctx) => {
    ctx.deleteMessage();
    cancel(ctx);
    return ctx.scene.leave();
});

// Wizard scene
const bookingWizard = new WizardScene('BOOKING_WIZARD', step0, step1, step2, step3);

module.exports = bookingWizard
