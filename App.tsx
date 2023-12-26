/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {ThemeProvider} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import theme, {
  Box,
  palette,
  Text,
  TypographyStyles,
} from './src/Components/Theme/Index';
import Routes from './src/Navigation/Routes';
import {persistor, store} from './src/Redux/Store';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Platform,
} from 'react-native';
import {checkVersion} from 'react-native-check-version';
//import CodePush from 'react-native-code-push';
import {CodePushKey, displaySuccessToast} from './src/utils';
import {useState} from 'react';
import {wp} from './src/Components/Helpers/responsive-ratio';
import Modal from 'react-native-modal';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import {requestUserPermission} from './src/utils/notificationService';
//import Analytics from 'appcenter-analytics';
import {navigationRef} from './src/Navigation/RootNavigation';
import authStore from './src/Zustand/store';
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {Images} from './src/Constant/Image';
// import {requestUserPermission} from './src/notificationService';

Sentry.init({
  dsn: 'https://cfdea9caf087461dbb1ed79c674e2b31@glitchtip.afa-sports.com/7',
  attachScreenshot: true,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const App = () => {
  const queryClient = new QueryClient();

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  // const {first_name, image, address, id} = useSelector(
  //   state => state?.auth?.user?.user?.data,
  // );
  const setVanue = authStore(state => state?.setVanue);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const trackingStatus = await requestTrackingPermission();

      if (trackingStatus == 'authorized') {
        //await Analytics.setEnabled(true);
      } else {
        //  await Analytics.setEnabled(false);
      }
    })();

    async function fetchData() {
      const version = await checkVersion();
      console.log(version);
      if (version.needsUpdate) {
        Alert.alert(
          'New Update',
          version.notes ||
            'We regularly update our app to provide you an awesome venue booking experience',
          [
            {
              text: 'Upgrade now',
              onPress: async () => await Linking.openURL(version.url),
            },
            {
              text: 'cancel',
              onPress: () => {},
            },
          ],
        );
      }
    }
    requestUserPermission();
    // notificationListner();

    fetchData();

    // setInterval(() => {
    //   setProgress(progress + 0.1);
    // }, 1000);
  }, []);

  const [loading, setLoading] = useState(true);

  // CodePush.sync(
  //   {
  //     deploymentKey:
  //       Platform.OS === 'android'
  //         ? CodePushKey.codePushAndroidKey
  //         : CodePushKey.codePushIOSKey,
  //     mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  //     installMode: CodePush.InstallMode.IMMEDIATE,
  //     updateDialog: {
  //       title: 'Mandatory Install',
  //       mandatoryUpdateMessage:
  //         'This is a mandatory update. To avoid any inconvenience in booking experience please continue to install this update.',
  //     },
  //   },
  //   status => {
  //     switch (status) {
  //       case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
  //         setOpen(true);

  //         displaySuccessToast('Downloading Update');
  //         // Show "downloading" modal
  //         break;
  //       case CodePush.SyncStatus.UPDATE_INSTALLED:
  //         setUpdate(false);
  //         displaySuccessToast('Update Installed');

  //         CodePush.allowRestart();
  //         break;
  //       case CodePush.SyncStatus.INSTALLING_UPDATE:
  //         setUpdate(true);
  //         displaySuccessToast('Installing Update');

  //         // Hide "downloading" modal
  //         break;
  //     }
  //   },
  //   ({receivedBytes, totalBytes}) => {
  //     let currProgress = parseFloat((receivedBytes / totalBytes) * 100).toFixed(
  //       2,
  //     );
  //     if (currProgress >= 100) {
  //       setOpen(false);
  //       /* Update download modal progress */
  //     } else {
  //       setProgress(currProgress);
  //     }
  //   },
  // );

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Routes />
            <Modal
              visible={open}
              transparent
              style={{
                margin: 0,
              }}>
              <Box
                style={{
                  backgroundColor: 'rgba(251, 251, 251, 1)',
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  // flex: 1,
                }}>
                <ImageBackground
                  source={Images?.codepushBack}
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <Box paddingHorizontal="l">
                    <Text variant={'primary36700Medium'} color="white">
                      Downloading new version...
                    </Text>
                  </Box>
                  <Box paddingHorizontal="l" marginVertical="l">
                    <Text variant={'blackshade16400'} color="white">
                      Sit tight. We're getting you the latest and greatest
                      version of the app.
                    </Text>
                  </Box>

                  <Box paddingHorizontal="l">
                    <Text variant={'blackshade12900'} mb="s" color="white">
                      {progress ? progress : 0}%
                    </Text>

                    <Progress.Bar
                      progress={progress / 100 || 0}
                      color={'#FC8A54'}
                      backdropColor="white"
                      backgroundColor="white"
                      width={wp(100) - 40}
                      height={15}
                      borderRadius={15}
                      animated={true}
                      useNativeDriver={true}
                    />
                  </Box>
                </ImageBackground>
              </Box>
            </Modal>
            <Modal
              visible={update}
              transparent
              backdropColor="rgba(0,0,0,.5)"
              style={{
                margin: 0,
              }}>
              <Box
                style={{
                  backgroundColor: 'rgba(251, 251, 251, .4)',
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                }}>
                <ImageBackground
                  source={Images?.codepushBack}
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <Box paddingHorizontal="l">
                    <Text variant={'primary36700Medium'} color="white">
                      Installation in progress…
                    </Text>
                  </Box>
                  <Box paddingHorizontal="l" marginVertical="l">
                    <Text variant={'blackshade16400'} color="white">
                      Sit tight. We're getting you the latest and greatest
                      version of the app.
                    </Text>
                  </Box>

                  <Box paddingHorizontal="l">
                    <Progress.Bar
                      color={'#FC8A54'}
                      backdropColor="white"
                      backgroundColor="white"
                      width={wp(100) - 40}
                      height={15}
                      borderRadius={15}
                      animated={true}
                      indeterminate
                      useNativeDriver={true}
                    />
                  </Box>
                </ImageBackground>
              </Box>
            </Modal>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

// function codePushDownloadDidProgress(progress) {

// }

// const MyApp = CodePush(App);

export default Sentry.wrap(App);
//export default App;

// export default ;
