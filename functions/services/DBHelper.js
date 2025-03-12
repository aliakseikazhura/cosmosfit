
const adminDB = require('../AdminDB');
const db = adminDB.database();

async function getRequestsToBookByDate(date) {
    try {
        const requestsRef = db.ref(`/requestsToBook/${date}`);
        const snapshot = await requestsRef.once("value");

        if (!snapshot.exists()) {
            return console.log("Not exist")
        }

        return snapshot.val();
    } catch (er) {
        console.log("getRequestsToBookByDate", er)
    }

}

async function addBookingByDate(bookingInfo, date) {
    const requestsRef = db.ref(`/requestsToBook/${date}`);

    await requestsRef.push(bookingInfo);
}

async function removeBookingsByDate(date) {
    const requestsRef = db.ref(`/requestsToBook/${date}`);

    await requestsRef.remove();
}

module.exports = {
    getRequestsToBookByDate,
    addBookingByDate,
    removeBookingsByDate
}