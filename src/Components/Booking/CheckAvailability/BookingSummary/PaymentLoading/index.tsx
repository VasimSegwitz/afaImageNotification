import React, {useEffect, useState, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../../Constant/Image';
import {Box, os, size, Text, palette} from '../../../../Theme/Index';
import {wp} from '../../../../Helpers/responsive-ratio';
import {useMutation} from 'react-query';
import {createBooking} from '../../../../Services/Booking';
import {
  displayErrorToast,
  displaySuccessToast,
  ios,
} from '../../../../../utils';
import {Header} from '../../../../ReusableComponents';
import WebView from 'react-native-webview';
import {ActivityIndicator, BackHandler, ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {BookingConstants} from '../../../../../Redux';

export default props => {
  const {route, navigation} = props;
  const {apiBody, vanue, is_deposit, url, is_insured} = route?.params;
  const [paymentUrl, setPaymentUrl] = useState('');
  const [webViewUrl, setWebViewUrl] = useState('');
  const [booking, setBooking] = useState('');
  const [loadin, setLoadin] = useState(false);

  const webView = useRef(null);

  const [canGoBack, setCanGoBack] = useState(false);

  const dispatch = useDispatch();

  const createBook = useMutation('createBooking', createBooking, {
    onSuccess: data => {
      if (data?.success == undefined) {
        displayErrorToast('Booking Already Exist');
        navigation.goBack();
      }
      if (data?.success == 1) {
        setBooking(data?.data?.booking);
        dispatch({
          type: BookingConstants?.PAYMENTURL,
          url: data?.data?.payment_url,
        });
        setPaymentUrl(data?.data?.payment_url);
      }
    },
    onError: error => {},
  });

  const onPaymentStatus = () => {
    if (webViewUrl?.includes('error')) {
      displayErrorToast('Payment Failed');
      setPaymentUrl('');
      setWebViewUrl('');
      navigation.goBack();
    } else if (webViewUrl?.includes('success')) {
      displaySuccessToast('Payment successfully done');
      !url
        ? navigation.navigate('BookingConfirmation', {
            booking: booking,
            vanue: vanue,
          })
        : navigation.goBack();
      setPaymentUrl('');
      setWebViewUrl('');
    }
  };

  useEffect(() => {
    onPaymentStatus();
  }, [webViewUrl]);

  const onSubmit = () => {
    const body = {
      ...apiBody,
      is_insured: is_insured !== undefined ? is_insured : null,
      is_deposit: is_deposit,
    };
    createBook?.mutate(body);
  };

  useEffect(() => {
    setTimeout(() => {
      !url ? onSubmit() : setPaymentUrl(url);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   if (ios) {

  //     BackHandler.addEventListener('hardwareBackPress', HandleBackPressed);

  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', HandleBackPressed);
  //     };
  //   }
  // }, []);

  // const HandleBackPressed = () => {
  //   if (webView.current) {
  //     navigation.goBack(null);
  //     return true;
  //   }
  //   navigation.goBack(null);
  //   return false;
  // };

  // useEffect(() => {
  //   if (os?.ios) {
  //     const unsubscribe = navigation.addListener('beforeRemove', e => {

  //       if (
  //         navigation.isFocused() &&
  //         e.data.action.type === 'GO_BACK' &&
  //         navigation.dangerouslyGetState().routes[
  //           navigation.dangerouslyGetState().index
  //         ].gestureDirection === 'horizontal'
  //       ) {
  //         navigation.goBack(null);
  //       }
  //     });

  //     return unsubscribe;
  //   }
  // }, [navigation]);

  if (paymentUrl) {
    return (
      <Box style={{flex: 1, backgroundColor: 'white'}}>
        <Header left title="Payment" navigation={navigation} />
        {loadin && (
          <View style={{height: size.height - 70}}>
            <Box
              style={{
                flex: 1,
                width: size?.width,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: 'white',
              }}>
              <ActivityIndicator size="small" color={palette?.primary} />
              <Text variant={'primary12Regular'} mt="s" textAlign={'center'}>
                Please wait
              </Text>
              <Text variant={'primary12Regular'} mt="s" textAlign={'center'}>
                We are processing your request
              </Text>
            </Box>
          </View>
        )}
        <View style={{height: size.height, paddingBottom: 100}}>
          <WebView
            ref={webView}
            source={{
              uri: paymentUrl,
            }}
            style={{flex: 1}}
            onNavigationStateChange={e => setWebViewUrl(e?.url)}
            scalesPageToFit={os.ios}
            useWebKit={os.ios}
            onLoadStart={() => setLoadin(true)}
            onLoad={() => setLoadin(false)}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>
      </Box>
    );
  }
  // else
  //   return (
  //     <Box
  //       flex={1}
  //       backgroundColor="white"
  //       alignItems={'center'}

  //       //   justifyContent="center"
  //     >
  //       <FastImage
  //         source={Images?.loadingGif}
  //         style={{
  //           height: wp(100),
  //           width: wp(100),
  //           marginTop: wp(30),
  //         }}
  //         resizeMode="contain"
  //       />
  //       <Box>
  //         <Text variant={'blackshade20500'} textAlign="center">
  //           Transfer to Secure
  //         </Text>
  //         <Text variant={'blackshade20500'} textAlign="center">
  //           Payment Gateway
  //         </Text>
  //         <Box width={'80%'}>
  //           <Text variant={'blackshade16400'} textAlign="center" mt="m">
  //             Please check your internet connection before proceeding to the
  //             payment gateway for a smooth transfer.
  //           </Text>
  //         </Box>
  //       </Box>
  //     </Box>
  //   );
};
