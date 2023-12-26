import React, {useEffect, useState} from 'react';
import {TouchableBox, Box, Text, palette, size, fonts} from '../../Theme/Index';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import {Button} from '../../ReusableComponents';
import {Down, Ionicon} from '../../ReusableComponents/Icons';

const AFANotAvailableModal = ({route, navigation}) => {
  return (
    <Box flex={1} style={styles.content}>
      <TouchableBox
        flex={0.5}
        justifyContent="center"
        alignItems="center"
        onPress={() => {
          navigation.goBack(null);
        }}
      />
      <Box
        flex={1}
        backgroundColor="white"
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <TouchableBox
          mr="l"
          mt="t"
          style={styles.closeIcon}
          onPress={() => {
            navigation.goBack(null);
          }}
          alignSelf="flex-end">
          {Ionicon('close', 20, palette?.black)}
        </TouchableBox>
        <Box flexGrow={1} justifyContent="flex-end" pb="m">
          <FastImage
            source={Images?.BookingPin}
            style={{height: wp(50), width: size?.width}}
            resizeMode={FastImage?.resizeMode?.contain}
          />
          <Box mt="m" marginHorizontal="l">
            <Text variant="blackshade20500">AFA Pay is not available</Text>
            <Text variant="blackshade16800Regular" mt="m">
              {/* AFA Pay is not available as you’ve requested to reset your AFA
              PIN. Complete the steps in the email to recover your account.{' '} */}
              AFA Pay is not activated in your account yet. Please activate the
              wallet and then proceed with payment.
            </Text>
          </Box>
          <Box m="l" width={wp(100) - 40}>
            <Button
              onPress={() => {
                navigation.navigate('Wallet');
              }}
              label={'Activate Wallet'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
        </Box>
        <Box>
          {/* <Box ml="l" width={wp(100) - 40}>
            <Button
              onPress={() => {
                navigation.navigate('Wallet');
              }}
              label={'Activate Wallet'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box> */}
          {/* <TouchableBox
            onPress={() => {
              navigation.goBack(null);
            }}
            mt="m"
            mb="xl">
            <Box justifyContent="center" alignItems="center">
              <Text
                style={{
                  fontSize: 14,
                  color: '#737373',
                  fontWeight: '400',
                  fontFamily: fonts.regular,
                }}>
                Top-up my Wallet now
              </Text>
            </Box>
          </TouchableBox> */}
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: '#00000070'},
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
  },
});

export default AFANotAvailableModal;
