import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
//   AuthorizationStatus,
// } from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import authStore from './Zustand/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  if (!firebase.apps.length) {
    // await firebase.initializeApp();
  }

  //checkNotificationPermission();

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //await messaging().registerDeviceForRemoteMessages();
  if (Platform?.OS === 'android')
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

  if (enabled) {
    getfcmToken();
  }
}

// async function checkNotificationPermission() {
//   await notifee.requestPermission();
//   const settings = await notifee.getNotificationSettings();

//   if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
//     const fcmToken = await messaging().getToken();

//     if (fcmToken) {
//       authStore?.setState({fcmToken: fcmToken});

//       await AsyncStorage.setItem('fcmToken', fcmToken);
//     }
//     getfcmToken();

//     // Create a channel (required for Android)
//   } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
//   }
// }

const getfcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('fcm token', fcmToken);
      authStore?.setState({fcmToken: fcmToken});

      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  } catch (error) {
    // displayErrorToast(error.messege);
  }
};

export const notificationListner = async () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('notification 68 ', remoteMessage);

    // onMessageReceived(remoteMessage);
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('notification 73 ', remoteMessage);

    // vanueSets(remoteMessage?.data?.user_activity);
    // onMessageReceived(remoteMessage);
    // navigation.navigate(remoteMessage.data.type);
  });
  messaging().onMessage(async remoteMessage => {
    console.log('notification 80 ', remoteMessage);

    // onMessageReceived(remoteMessage);
    // displaySuccessToast(remoteMessage.notification.body);
    // authStore?.setState({gotmsg: remoteMessage?.data?.user_activity});
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('notification 90 ', remoteMessage);

        // onMessageReceived(remoteMessage);
      }
    });
};
