require('dotenv').config()

const { Telegraf, Scenes, session } = require('telegraf');
const { Stage } = Scenes;
const { CMD_TEXT } = require('./utils/Constants');
const { startBot, cancel, startBooking, showBookings, login } = require('./controllers/Commands1');
const bookingWizard = require('./scenes/BookingScene');
const loginWizard = require('./scenes/LoginScene');
const requestsToBookScene = require('./scenes/RequestsToBookScene');
const logger = require('./logger');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([bookingWizard, requestsToBookScene, loginWizard]);

bot.use(session());
bot.use(stage.middleware());

// Start command
bot.start(startBot);

// Cancel command
bot.hears(CMD_TEXT.cancelOperation, cancel)

// Booking command
bot.command('book', startBooking);
bot.hears(CMD_TEXT.startBooking, startBooking)

// Login command
bot.command('login', login);
bot.hears(CMD_TEXT.login, login)

// Show bookings command
bot.command('showBookings', showBookings);
bot.hears(CMD_TEXT.showBookings, showBookings)

bot.launch();

logger.info('Bot is running...')
