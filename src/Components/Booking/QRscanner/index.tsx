import React, {useEffect, useState} from 'react';

import {Box, Text, TouchableBox} from '../../Theme/Index';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ScrollView} from 'react-native-gesture-handler';
import {Header} from '../../ReusableComponents';
import {styles} from './styles';
import {Vibration, Animated, View} from 'react-native';
import {hp} from '../../Helpers/responsive-ratio';
import {Ionicon} from '../../ReusableComponents/Icons';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {RNCamera} from 'react-native-camera';
import {useMutation} from 'react-query';
import {autoLighting} from '../../Services/Booking';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
export default props => {
  const {navigation, route} = props;
  const [flash, setFlash] = useState(false);

  const {mutate} = useMutation('autoLighting', autoLighting, {
    onSuccess: data => {
      if (data?.success == 1) {
        displaySuccessToast(data?.message);
        navigation.goback();
      }
      if (data?.success == 0) {
        displayErrorToast(data?.message);
      }
    },
  });

  const onScan = e => {
    const body = {
      data: e?.data,
    };
    mutate(body);
  };

  function marker(
    color: string,
    size: string | number,
    borderLength: string | number,
    thickness: number = 2,
    borderRadius: number = 0,
  ): JSX.Element {
    return (
      <View style={{height: size, width: size}}>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            top: 0,
            left: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
            borderTopLeftRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            top: 0,
            right: 0,
            borderColor: color,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
            borderTopRightRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            bottom: 0,
            left: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
            borderBottomLeftRadius: borderRadius,
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: borderLength,
            width: borderLength,
            bottom: 0,
            right: 0,
            borderColor: color,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
            borderBottomRightRadius: borderRadius,
          }}></View>
      </View>
    );
  }

  return (
    <Box style={styles.container}>
      {/* <Header title="QR Scanner" close containerStyle={{paddingVertical: 20}} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box style={styles.innerWrap}>
          <TouchableBox
            onPress={() => navigation?.goBack()}
            style={{
              marginTop: hp(10),
              alignSelf: 'flex-start',
              marginLeft: 20,
            }}>
            {Ionicon('close-circle-outline', 40, 'white')}
          </TouchableBox>
          <Box
            style={{
              marginTop: hp(10),
            }}>
            <Text style={styles.Qrscan}>Find QR Code to scan</Text>
          </Box>
          <QRCodeScanner
            onRead={e => {
              if (e?.data) {
                onScan(e);
              }
            }}
            // vibrate={Vibration.vibrate()}
            cameraContainerStyle={styles.qrContainer}
            cameraStyle={styles.cameraStyle}
            showMarker={true}
            customMarker={marker('white', '100%', '30%', 10, 50)}
            reactivate={true}
            reactivateTimeout={2000}
            flashMode={
              flash
                ? RNCamera?.Constants?.FlashMode?.torch
                : RNCamera?.Constants?.FlashMode?.off
            }
            // flashMode="on"
          />
        </Box>
        <TouchableBox
          onPress={() => setFlash(!flash)}
          style={{
            marginTop: hp(5),
            alignSelf: 'center',
          }}>
          <FastImage source={Images?.Torch} style={{height: 80, width: 80}} />
        </TouchableBox>
      </ScrollView>
    </Box>
  );
};
