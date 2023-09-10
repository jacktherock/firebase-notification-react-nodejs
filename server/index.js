const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const { Response } = require("./services");
const { admin, messaging } = require("./firebaseConfig");

const PORT = 8000;

app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}));

// Store FCM token
app.post('/send-token', async (req, res) => {
    const tokenID = req.body.token;

    // This registration token comes from the client FCM SDKs.
    const registrationToken = tokenID;

    if (!registrationToken) {
        res.status(400).json(Response(true, 'Invalid registration token.'));
        return;
    }

    const message = {
        notification: {
            title: 'Test message',
            body: 'This is a test message sent from the backend',
        },
        token: registrationToken
    };

    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            // console.log(`Successfully sent message: ${response} \n`);
            res.status(200).json(Response(false, "FCM message sent successfully.", { registrationToken, response }));
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            res.status(500).json(Response(true, "Error sending FCM message."));
        });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
