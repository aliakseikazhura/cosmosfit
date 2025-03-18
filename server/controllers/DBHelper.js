
const adminDB = require('../DB/AdminDB');
const db = adminDB.database();
const logger = require('../logger');

async function getRequestsToBookByDate(date) {
    try {
        const requestsRef = db.ref(`/requestsToBook/${date}`);
        const snapshot = await requestsRef.once("value");

        if (!snapshot.exists()) {
            logger.info("Not exist")
            return;
        }

        return snapshot.val();
    } catch (er) {
        logger.info(`getRequestsToBookByDate = ${JSON.stringify(er)}`)
    }
}

async function addUserAccount(chatId, userInfo) {
    const requestsRef = db.ref(`users/${chatId}`);

    return requestsRef.set(userInfo);
}

async function addBookingByDate(bookingInfo, date) {
    const requestsRef = db.ref(`/requestsToBook/${date}`);

    return requestsRef.push(bookingInfo);
}

async function removeBookingsByDate(date) {
    const requestsRef = db.ref(`/requestsToBook/${date}`);

    await requestsRef.remove();
}

async function getUserByChatId(chatId) {
    try {
        const requestsRef = db.ref(`/users/${chatId}`);
        const snapshot = await requestsRef.once("value");

        if (!snapshot.exists()) {
            logger.info("User doesn't exist")
            return
        }

        return snapshot.val();
    } catch (er) {
        logger.info(`getUserByChatId = ${JSON.stringify(er)}`)
    }
}

async function testSetCol(chatId, userInfo) {
    const requestsRef = db.ref(`testCol/${chatId}`);

    return requestsRef.set(userInfo);
}


module.exports = {
    getRequestsToBookByDate,
    addBookingByDate,
    removeBookingsByDate,
    getUserByChatId,
    addUserAccount,
    testSetCol
}