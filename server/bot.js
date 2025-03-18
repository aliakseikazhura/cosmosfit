const { Telegraf, Scenes, session } = require('telegraf');
const { Stage } = Scenes;
const { CMD_TEXT } = require('./utils/consts');
const { startBot, cancel, startBooking, login } = require('./controllers/commands');
const bookingWizard = require('./scenes/bookingScene');
const loginWizard = require('./scenes/loginScene');
const logger = require('./logger');

require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([bookingWizard, loginWizard]);

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

bot.launch();

logger.info('Bot is running...')
