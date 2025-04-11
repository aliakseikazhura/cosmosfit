const { Scenes, Composer } = require('telegraf');
const { WizardScene } = Scenes;
const { startButtonMenu } = require('../utils/Buttons1');
const BookingService = require('../controllers/BookingService');

function getReplyText(requests = {}) {
    requests = Object.values(requests);
    let replyText = requests?.length ? 'Your requests to book:' : 'You have no requests to book';
    if (requests?.length) {
        requests.forEach(request => {
            replyText += `\nDate: ${request.date}, Time: ${request.time}, Title: ${request.type}`;
        });
    }

    return replyText;
}

// Step 0
const step0 = new Composer();
step0.on('text', async (ctx) => {
    const chatId = ctx.chat.id;
    const requests = await new BookingService().getUserRequests(chatId);
    const replyText = getReplyText(requests);
    ctx.reply(replyText, {
        ...startButtonMenu
    });
    return ctx.scene.leave();
});

// Requests to book scene
const requestsToBookScene = new WizardScene('REQUESTS_TO_BOOK_WIZARD', step0);

module.exports = requestsToBookScene;
