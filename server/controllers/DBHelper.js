
const adminDB = require('../DB/AdminDB');
const db = adminDB.database();
const logger = require('../logger');

async function getRequestsByChatId(chatId) {
    try {
        const snapshot = await db.ref(`/requestsToBook`).orderByKey()
            .startAt(`${chatId}_`)
            .endAt(`${chatId}_\uf8ff`)
            .once("value");

        if (!snapshot.exists()) {
            logger.info("No Requests exist")
            return;
        }

        return snapshot.val();
    } catch (er) {
        logger.info(`getRequestsByChatId = ${JSON.stringify(er)}`)
    }
}

async function getRequestsByDate(date) {
    const requestsRef = db.ref(`requestsToBook`);
    const snapshot =  await requestsRef.orderByChild("date").equalTo(date).once("value");

    if (!snapshot.exists()) {
        logger.info("Requests not found")
        return;
    }

    logger.info(snapshot.val())

    return snapshot.val();
}

async function getUserByChatId(chatId) {
    try {
        const requestsRef = db.ref(`/users/${chatId}`);
        const snapshot = await requestsRef.once("value");

        if (!snapshot.exists()) {
            logger.info("Chat doesn't exist")
            return
        }

        return snapshot.val();
    } catch (er) {
        logger.info(`getUserByChatId = ${JSON.stringify(er)}`)
    }
}

async function getUserDataByEmail(email) {
    const usersRef = db.ref(`users`);
    const snapshot =  await usersRef.orderByChild("email").equalTo(email).once("value");

    if (!snapshot.exists()) {
        logger.info("User not found")
        return;
    }

    let user = null;
    snapshot.forEach(childSnapshot => user = childSnapshot.val());
    return user;
}

async function saveUserAccountData(userInfo) {
    const requestsRef = db.ref(`users/${userInfo.chatId}`);

    return requestsRef.set(userInfo);
}

async function saveBookingInfo(bookingInfo, chatId) {
    const requestsRef = db.ref(`/requestsToBook/${chatId}_${bookingInfo.booking_id}`);

    return requestsRef.set(bookingInfo);
}



// async function addTestData(bookingInfo, date) {
//     const requestsRef = db.ref(`/testCol/${date}/${bookingInfo.email}`);

//     return requestsRef.set(bookingInfo);
// }

// async function removeBookingsByDate(date) {
//     const requestsRef = db.ref(`/requestsToBook/${date}`);

//     await requestsRef.remove();
// }



module.exports = {
    // removeBookingsByDate,
    // addTestData,
    getRequestsByChatId,
    getRequestsByDate,
    getUserByChatId,
    getUserDataByEmail,
    saveUserAccountData,
    saveBookingInfo,
}