import React, { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, messaging } from './firebaseConfig';
import { sendToken } from './api';

const vapidKeyID = import.meta.env.VITE_VAPID_KEY;

const App = () => {

  const [fcmToken, setFcmToken] = useState('');
  const [fcmMessage, setFcmMessage] = useState('');

  useEffect(() => {
    // const messaging = getMessaging(app);

    // Function to save FCM token to localStorage and set it in the state
    const saveTokenToLocalStorage = (token) => {
      localStorage.setItem('fcmToken', token);
      setFcmToken(token); // Update the state with the token
    };

    // Request permission to receive notifications
    const requestPermission = () => {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          // Now, you can create and retrieve the FCM token
          createAndRetrieveToken(messaging);
        } else {
          console.log('Notification permission not granted.');
        }
      });
    };

    // Function to create and retrieve the FCM token
    const createAndRetrieveToken = (messaging) => {
      const savedToken = localStorage.getItem('fcmToken');
      // console.log(savedToken);

      if (!savedToken) {
        getToken(messaging, { vapidKey: vapidKeyID })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM token:', currentToken);

              // Save the token to localStorage and set it in the state
              saveTokenToLocalStorage(currentToken);

              // Attempt to send the token
              sendTokenToBackend(currentToken);

            } else {
              console.log('No registration token available.');
            }
          })
          .catch((error) => {
            console.error('An error occurred while retrieving token: ', error);
          });
      } else {
        // If the token is already in localStorage, set it in the state
        setFcmToken(savedToken);

        // Attempt to send the token
        sendTokenToBackend(savedToken);
      }
    };


    // Check if the browser supports Notifications API
    if ('Notification' in window) {
      requestPermission();
    } else {
      console.log('Browser does not support notifications.');
    }

    // Handle incoming FCM messages
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      setFcmMessage(payload.notification?.body || '');
    });

    // Function to send FCM token to the backend API
    const sendTokenToBackend = async (token) => {
      try {
        setTimeout(async () => {
          const response = await sendToken(token);
          if (response.error === false) {
            console.log(response);
          } else {
            console.log("Something went wrong!");
          }
        }, 1000);
      } catch (error) {
        console.error("Error sending token:", error);
      }
    };

  }, []);


  return (
    <div>
      <p>
        FCM Token:
        <span
          style={{
            display: 'block',
            border: '1px solid #ccc',
            padding: '5px',
            width: '500px',
            wordWrap: 'break-word',
            overflow: 'hidden', 
          }}
        >
          {fcmToken}
        </span>
      </p>
      <p>
        FCM Message:
        <span>{fcmMessage}</span>
      </p>
    </div>
  );
};

export default App;
