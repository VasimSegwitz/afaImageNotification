import messaging from '@react-native-firebase/messaging';
import {displayErrorToast, displaySuccessToast} from './index';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
//   AuthorizationStatus,
// } from '@notifee/react-native';
import {PermissionsAndroid} from 'react-native';
import {os} from '../Components/Theme/Index';
import authStore from '../Zustand/store';
import {vanueSets} from '../Components/Helpers/utils';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //await messaging.registerDeviceForRemoteMessages();

  if (!os)
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
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('--------------fcmToken------------------');
  console.log(fcmToken);
  console.log('--------------fcmToken------------------');
  if (fcmToken == null) {
    console.log('yaha');
    try {
      const fcmTokenn = await messaging().getToken();
      console.log('--------------fcm------------------');
      console.log(fcmTokenn);
      console.log('--------------fcm------------------');
      if (fcmTokenn) {
        authStore?.setState({fcmToken: fcmTokenn});

        await AsyncStorage.setItem('fcmToken', fcmTokenn);
      }
    } catch (error) {
      console.log(error);
      // displayErrorToast(error.messege);
    }
  }
};

export const notificationListner = async () => {
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   // onMessageReceived(remoteMessage);
  // });
  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   // vanueSets(remoteMessage?.data?.user_activity);
  //   // onMessageReceived(remoteMessage);
  //   // navigation.navigate(remoteMessage.data.type);
  // });
  // messaging().onMessage(async remoteMessage => {
  //   vanueSets(remoteMessage?.data?.user_activity);
  //   // onMessageReceived(remoteMessage);
  //   // displaySuccessToast(remoteMessage.notification.body);
  //   // authStore?.setState({gotmsg: remoteMessage?.data?.user_activity});
  // });
  // messaging()
  //   .getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage) {
  //       vanueSets(remoteMessage?.data?.user_activity);
  //       // onMessageReceived(remoteMessage);
  //     }
  //   });
};
