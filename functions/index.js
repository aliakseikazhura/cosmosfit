const {onMessagePublished} = require("firebase-functions/v2/pubsub");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");

const BookingFlow = require('./services/BookingFlow');



// exports.scheduledTask = onSchedule("every 5 hours", (event) => {
//     console.log("V1: Scheduled function executed at:", new Date().toISOString());
//     logger.info("V1: Scheduled function executed at:", new Date().toISOString());
// });



exports.hellopubsub = onMessagePublished("my-scheduled-topic", async (event) => {
    logger.info("V2: Scheduled function started executed at:", new Date().toISOString());

    const flow = new BookingFlow("testUser");
    await flow.initProcess("2025-03-13", "19:00", "Jumping");
    
    logger.info("V2: Scheduled function finished executed at:", new Date().toISOString());

})




exports.hellopubsub1 = onMessagePublished("my-scheduled-topic1", async (event) => {
    logger.info("V2: Scheduled function started executed at:", new Date().toISOString());

    const flow = new BookingFlow("testUser");

    let requests = flow.getRequests4User("user1");
    await flow.initProcess("2025-03-13", "19:00", "Jumping");
    
    logger.info("V2: Scheduled function finished executed at:", new Date().toISOString());

})