const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin with your service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firebase Cloud Messaging (FCM) service
const messaging = admin.messaging();

module.exports = {
    admin,
    messaging,
};
