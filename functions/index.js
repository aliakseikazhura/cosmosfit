const functions = require("firebase-functions");
// const {onMessagePublished} = require("firebase-functions/v2/pubsub");
// const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");

exports.testFunction = functions.https.onRequest({
    "region": "europe-central2"
}, async (request, response) => {
    await testFunction();
    response.send("Hello from Firebase!");
});


// exports.testHTTP = functions.https.onRequest({
//     "region": "europe-central2"
// }, async (request, response) => {
//     logger.info(`[europe-central2] Scheduled function started at: ${new Date().toISOString()}`);

//     try {
//         const dateToBook = getDateToBook();
//         let requestsToBook = await getRequestsToBookByDate(dateToBook);
//         console.log("requestsToBook=", JSON.stringify(requestsToBook));
//         requestsToBook = Object.values(requestsToBook).map(request => FormDataHelper.createFormData({...request, date: dateToBook, version: Constants.VERSION}));
//         // console.log("requestsToBook=", JSON.stringify(requestsToBook));
        
//         const timerDelay = getTimerDelay();
//         console.log("dateToBook", dateToBook)
//         console.log("timerDelay", timerDelay)

//         console.log(`[europe-central2] Before timeout: ${new Date().toISOString()}`);
//         setTimeout(async () => {
//             console.log(`SetTimeout started: ${new Date().toISOString()}`);
//             await Promise.all(requestsToBook.map(request => BookingFlow.bookAppointment(request)));
//         }, timerDelay);

//         logger.info(`[europe-central2] Scheduled function finished at: ${new Date().toISOString()}`);
//     } catch (error) {
//         logger.error(`[europe-central2] Error:`, error);
//     }
// });