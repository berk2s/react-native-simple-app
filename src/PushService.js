import PushNotification from 'react-native-push-notification'
import firebase from 'react-native-firebase';
import API from './api';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class PushService {
    static init() {
        const messaging = firebase.messaging();

        messaging.hasPermission()
            .then((enabled) => {
                if (enabled) {
                    messaging.getToken()
                        .then(async token => {

                            const postToken = await API.post(`/api/notification/token`, {
                                token:token,
                                platform: Platform.OS
                            });

                            await AsyncStorage.setItem('token', token);

                        })
                        .catch(error => { /* handle error */ });
                } else {
                    messaging.requestPermission()
                        .then(() => { /* got permission */ })
                        .catch(error => { /* handle error */ });
                }
            })
            .catch(error => { /* handle error */ });

        firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            PushNotification.localNotification({
                title: title,
                message: body, // (required)
            });
        });

    }


    static configure() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log("TOKEN:", token);
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: notification => {
                console.log(notification);

                if (notification.action === "Take") {
                    alert("take")
                } else if (notification.action === "Skip") {
                    alert("skip")
                } else if (notification.action === "Snooze") {
                    alert("snooze")
                }
            },
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "98899191986",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true
        });

    }
}

PushService.init()
