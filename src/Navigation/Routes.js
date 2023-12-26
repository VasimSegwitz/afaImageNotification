import React, {useState, useEffect, useReducer} from 'react';
import {Platform, StatusBar, KeyboardAvoidingView, Linking} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigation,
  getStateFromPath,
} from '@react-navigation/native';
import {Box} from '../Components/Theme/Index';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Components/Splash';
import OnboardingNavigation from './OnboardingNavigation';
import Dashboardnavigation from './DashboardNavigation';
import authStore from '../Zustand/store';
import {getToken, getVanue, removeVanueSets} from '../Components/Helpers/utils';
import {api} from '../Components/Services/baseApi';
import {navigationRef} from './RootNavigation';
import {LoadingOverlay} from '../Components/ReusableComponents';
import {AuthConstants} from '../Redux';
import {useDispatch, useSelector} from 'react-redux';
import {singleActivity} from '../Components/Services/Booking';
import {useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../utils';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import NetInfos from './NetInfo';
import {TransitionPresets} from '@react-navigation/stack';
// import notifee, {EventType} from '@notifee/react-native';

const Stack = createNativeStackNavigator();

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  const handleNetworkChange = state => {
    setConnectionStatus(state.isConnected);
    setConnectionType(state.type);
  };

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  const NavigationStack = () => {
    const {navigation} = useNavigation();
    const [userToken, setUserToken] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState();
    const {deeplink} = useSelector(state => state?.auth?.user);
    const [vanueId, setVanueID] = useState();
    const [state, setState] = useReducer(
      (state, newState) => ({...state, ...newState}),
      {
        isFetching: false,
        vanueId: null,
        isComment: false,
      },
    );

    useEffect(() => {
      setState({
        vanueId: (deeplink && deeplink?.split('Activity/')[1]) || null,
      });
    }, [deeplink]);

    const {first_name, id} = useSelector(
      state => state?.auth?.user?.user?.data || {},
    );

    const loginUser = authStore(state => state.token);
    const setVanue = authStore(state => state.setVanue);
    const setlink = authStore(state => state.setlink);

    const setGotmsg = authStore(state => state.setGotmsg);

    const gotmsg = authStore(state => state.gotmsg);

    const [isLoading, setIsLoading] = useState(false);
    const fetchToken = async () => {
      setIsLoading(true);
      getToken().then(val => {
        if (api) {
          api.defaults.headers.common = {
            'api-key': val,
          };
          // api.defaults.headers.Authorization = `Bearer ${val}`;
        }
        setUserToken(val);
        setIsLoading(false);
      });
    };
    useEffect(() => {
      fetchToken();
    }, [loginUser]);

    const newGetSingleActivity = vanueId => {
      singleActivity(vanueId)
        .then(data => {
          setIsFetching(false);

          dispatch({
            type: AuthConstants?.DEEPLINK,
            deeplink: undefined,
          });

          if (data?.data?.success == 0) {
            displayErrorToast(data?.data?.message);
            return;
          }

          setVanue({
            vanue: data?.data,
          });

          setlink({
            is_link: true,
          });
          setGotmsg({
            gotmsg: '',
          });
          setState({
            vanueId: null,
          });
          const ishost =
            data?.data?.user?.first_name === first_name ||
            data?.data?.co_hosts?.some(i => i?.user_id == id);
          const p = ishost ? 'ActivityHost' : 'ActivityPage';

          if (state.isComment) {
            navigationRef.current?.navigate(p, {
              from: 'notification',
              vanue: data?.data,
              coHost: ishost,
            });
          } else {
            navigationRef.current?.navigate(p, {
              vanue: data?.data,
              coHost: ishost,
            });
          }

          removeVanueSets();
          // navigation?.setParams({vanue: data?.data});
        })
        .catch(error => {
          setIsFetching(false);
          displayErrorToast(error?.data?.message);
        });
    };

    // useEffect(() => {
    //   return notifee.onForegroundEvent(({type, detail}) => {
    //     console.log('Remote notification info: ', detail.notification?.remote);
    //     switch (type) {
    //       case EventType.DISMISSED:
    //         console.log('User dismissed notification', detail.notification);
    //         break;
    //       case EventType.PRESS:
    //         console.log('User pressed notification', detail.notification);
    //         break;
    //     }
    //   });
    // }, []);

    // useEffect(() => {
    //   return notifee.onBackgroundEvent(async ({type, detail}) => {
    //     const {notification, pressAction} = detail;
    //     if (
    //       type === EventType.ACTION_PRESS &&
    //       pressAction.id === 'mark-as-read'
    //     ) {

    //       await notifee.cancelNotification(notification.id);
    //     }
    //   });
    // }, []);

    useEffect(() => {
      if (state.vanueId !== null) {
        setIsFetching(true);
        newGetSingleActivity(state.vanueId);
      }
    }, [state.vanueId]);

    // async function onDisplayNotification(remoteMessage) {
    //   const {data, notification} = remoteMessage;

    //   console.log(remoteMessage);

    //   const channelId = await notifee.createChannel({
    //     id: 'default',
    //     name: 'Default Channel',
    //   });

    //   await notifee.displayNotification({
    //     title: notification?.title,
    //     body: notification?.body,
    //     android: {
    //       channelId,
    //       pressAction: {
    //         id: 'default',
    //       },
    //     },
    //     ios: {
    //       attachments: [
    //         {
    //           url: data?.icon,
    //         },
    //       ],
    //     },
    //   });
    // }

    useEffect(() => {
      // const unsubscribe = messaging().onMessage(onDisplayNotification);
      // const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
      //   onDisplayNotification,
      // );
      // const getInitialNotification = messaging().getInitialNotification(
      //   onDisplayNotification,
      // );
      // const setBackgroundMessageHandler =
      //   messaging().setBackgroundMessageHandler(onDisplayNotification);

      const unsubscribe = messaging().onMessage(remoteMessage => {
        const currentRoute = navigationRef.current?.getCurrentRoute();
        if (remoteMessage?.data?.type === 'ACTIVITY_COMMENT') {
          if (currentRoute?.name === 'Comments') {
            displaySuccessToast(remoteMessage.notification.body);
            setTimeout(() => {
              currentRoute?.params.refresh();
            }, 500);
          } else {
            displaySuccessToast(remoteMessage.notification.body);
          }
        } else if (
          remoteMessage?.data?.type === 'ACTIVITY_INVITE' ||
          remoteMessage?.data?.type === 'ACTIVITY_REQUEST' ||
          remoteMessage?.data?.type === 'ACTIVITY_ACCEPT' ||
          remoteMessage?.data?.type === 'ACTIVITY_GOING'
        ) {
          displaySuccessToast(remoteMessage.notification.body);
          const user_activity = JSON.parse(remoteMessage?.data?.user_activity);
          user_activity &&
            user_activity?.id !== null &&
            setState({
              vanueId: user_activity?.id,
            });
        }
      });

      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data?.type === 'ACTIVITY_COMMENT') {
          const user_activity = JSON.parse(remoteMessage?.data?.user_activity);
          user_activity &&
            user_activity?.id !== null &&
            user_activity &&
            user_activity?.id !== null &&
            setState({
              isComment: true,
              vanueId: user_activity?.id,
            });
        } else if (
          remoteMessage?.data?.type === 'ACTIVITY_INVITE' ||
          remoteMessage?.data?.type === 'ACTIVITY_REQUEST' ||
          remoteMessage?.data?.type === 'ACTIVITY_ACCEPT' ||
          remoteMessage?.data?.type === 'ACTIVITY_GOING'
        ) {
          displaySuccessToast(remoteMessage.notification.body);
          const user_activity = JSON.parse(remoteMessage?.data?.user_activity);
          user_activity?.id !== null &&
            setState({
              isComment: true,
              vanueId: user_activity?.id,
            });
        }
      });

      messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
          if (
            remoteMessage !== null &&
            remoteMessage?.data?.type === 'ACTIVITY_COMMENT'
          ) {
            const user_activity = JSON.parse(
              remoteMessage?.data?.user_activity,
            );
            user_activity?.id !== null &&
              setState({
                isComment: true,
                vanueId: user_activity?.id,
              });
            setRefreshing(Math.random());
          } else if (
            (remoteMessage !== null &&
              remoteMessage?.data?.type === 'ACTIVITY_INVITE') ||
            remoteMessage?.data?.type === 'ACTIVITY_REQUEST' ||
            remoteMessage?.data?.type === 'ACTIVITY_ACCEPT' ||
            remoteMessage?.data?.type === 'ACTIVITY_GOING'
          ) {
            displaySuccessToast(remoteMessage.notification.body);
            const user_activity = JSON.parse(
              remoteMessage?.data?.user_activity,
            );
            user_activity?.id !== null &&
              setState({
                isComment: false,
                vanueId: user_activity?.id,
              });
          }
        })
        .catch(error => {});

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('setBackgroundMessageHandler notification');
        if (
          remoteMessage !== null &&
          remoteMessage?.data?.type === 'ACTIVITY_COMMENT'
        ) {
          const user_activity = JSON.parse(remoteMessage?.data?.user_activity);
          user_activity?.id !== null &&
            setState({
              isComment: true,
              vanueId: user_activity?.id,
            });
        }

        if (
          (remoteMessage !== null &&
            remoteMessage?.data?.type === 'ACTIVITY_INVITE') ||
          remoteMessage?.data?.type === 'ACTIVITY_REQUEST' ||
          remoteMessage?.data?.type === 'ACTIVITY_ACCEPT' ||
          remoteMessage?.data?.type === 'ACTIVITY_GOING'
        ) {
          displaySuccessToast(remoteMessage.notification.body);
          const user_activity = JSON.parse(remoteMessage?.data?.user_activity);
          user_activity?.id !== null &&
            setState({
              isComment: false,
              vanueId: user_activity?.id,
            });
        }
      });
      return unsubscribe;
    }, []);

    const fetchd = async () => {
      return await getVanue();
      // return data
    };

    useEffect(() => {
      (async () => {
        const data = await fetchd();

        const pg = JSON.parse(data);

        pg &&
          setState({
            isComment: true,
            vanueId: pg?.id,
          });
      })();

      return () => {
        // this now gets called when the component unmounts
      };
    }, []);

    let onboardCompleted = false;
    if (loginUser?.token?.length) {
      api.defaults.headers.common = {
        'api-key': loginUser?.token,
      };
      onboardCompleted = true;
    }
    return (
      <Box flex={1}>
        {isLoading ? (
          <LoadingOverlay />
        ) : onboardCompleted ? (
          <>
            {isFetching && <LoadingOverlay />}
            <Dashboardnavigation />
          </>
        ) : (
          <SafeAreaProvider>
            <OnboardingNavigation />
          </SafeAreaProvider>
        )}
      </Box>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <NavigationContainer
        ref={navigationRef}
        linking={{
          prefixes: ['AFAC://', 'https://deeplink.afa-sports.com/'],
          async getInitialURL() {
            const url = await Linking.getInitialURL();

            if (url != null) {
              dispatch({
                type: AuthConstants?.DEEPLINK,
                deeplink: url,
              });
              return url;
            }
            return url;
          },
          getStateFromPath: (path, options) => {
            const state = getStateFromPath(path, options);

            dispatch({
              type: AuthConstants?.DEEPLINK,
              deeplink: 'https://deeplink.afa-sports.com/' + path,
            });

            // const newState = {
            //   ...state,
            // };
            // return newState;
          },
        }}
        fallback={<LoadingOverlay />}>
        {/* {Platform.OS === 'android' ? (
        <NotificationAndroidController />
      ) : (
        <NotificationIosController />
      )} */}

        <NetInfos />

        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor={'transparent'}
        />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={({route, navigation}) => ({
            headerShown: false,
            gestureEnabled: true,
            //...TransitionPresets.ModalPresentationIOS,
          })}>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="NavigationStack"
            component={NavigationStack}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
};
