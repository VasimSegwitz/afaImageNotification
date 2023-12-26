import React, {useEffect, useState} from 'react';
import {
  TouchableBox,
  Box,
  Text,
  palette,
  size,
  fonts,
  TypographyStyles,
} from '../../../Theme/Index';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Button} from '../../../ReusableComponents';
import {Down, Ionicon} from '../../../ReusableComponents/Icons';
import authStore from '../../../../Zustand/store';

const AskLocation = ({route, navigation}) => {
  const {setPermis} = route?.params;

  const setAskLoc = authStore(state => state.setAskLoc);

  return (
    <Box flex={1} style={styles.content} p="l">
      <Box
        flex={1}
        p={'l'}
        backgroundColor={'white'}
        style={[styles.confirmationModal, TypographyStyles.cardShadow]}>
        {/* <LottieView
              ref={checkMarkRef}
              source={ActivityOpening}
              autoPlay={true}
              loop={false}
            /> */}

        <Box justifyContent={'center'} alignItems={'center'} p="l">
          <Text variant={'blackshade20500'} mt="m" textAlign={'center'}>
            Want to explore nearby activities and sport venues?
          </Text>

          <FastImage
            source={Images.LocationAsk}
            style={{
              height: wp(15),
              width: wp(15),
              marginVertical: wp(7),
            }}
            resizeMode={'contain'}
          />
          <Text
            variant={'blackshade16400'}
            textAlign={'center'}
            mt="s"
            // fontWeight="400"
          >
            Get local recommendations when you allow AFA access to your device's
            location
          </Text>
        </Box>
        <Box mt={'m'} mb={'m'}>
          <Button
            label="Enable Location Service"
            onPress={() => {
              //   setActOpen(false);
              setAskLoc({
                askLoc: true,
              });

              navigation?.goBack();
              // navigation?.navigate('ActivitySearch');
            }}
          />
          <TouchableBox
            onPress={() => {
              //   setActOpen(false);
              setAskLoc({
                askLoc: false,
              });
              navigation?.goBack();
              // navigation?.navigate('ActivitySearch');
            }}>
            <Text textAlign={'center'} mt="s" variant={'blackshade114400'}>
              I'll do it later
            </Text>
          </TouchableBox>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#00000070',
    justifyContent: 'center',
  },
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    // top: wp(50),
    marginHorizontal: wp(8),
    borderRadius: 15,
  },
});

export default AskLocation;
