const admin = require("firebase-admin");
// if (process?.env?.NODE_ENV === "dev") {
require('dotenv').config()
// }

const adminDB = admin;

// const serviceAccount = require("../../cosmosfit-config.json");
// const credential = adminDB.credential.cert(serviceAccount);

// console.log("1111process.env.SERVICE_ACCOUNT_KEY", process.env.SERVICE_ACCOUNT_KEY)
const credential = adminDB.credential.cert(JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')));

adminDB.initializeApp({
	credential: credential,
	databaseURL: "https://cosmosfit-default-rtdb.firebaseio.com"
});

module.exports = adminDB;
