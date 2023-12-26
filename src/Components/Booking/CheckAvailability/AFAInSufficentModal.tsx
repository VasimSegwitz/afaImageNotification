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
          m="l"
          style={styles.closeIcon}
          onPress={() => {
            navigation.goBack(null);
          }}
          alignSelf="flex-end">
          {Ionicon('close', 20, palette?.black)}
        </TouchableBox>
        <Box flexGrow={1}>
          <FastImage
            source={Images?.NoMoney}
            style={{height: wp(50), width: size?.width}}
            resizeMode={FastImage?.resizeMode?.contain}
          />
          <Box mt="m" marginHorizontal="l">
            <Text variant="blackshade20500">Insufficient Wallet Funds</Text>
            <Text variant="blackshade16800Regular" mt="m">
              Oops, your current AFA Wallet balance is not enough to pay for
              this booking. Please top-up to secure your booking.
            </Text>
          </Box>
        </Box>
        <Box>
          <Box ml="l" mb="l" width={wp(100) - 40}>
            <Button
              onPress={() => {
                navigation.navigate('Wallet');
              }}
              label={'Top-up my Wallet'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: 'rgba(0,0,0,.7)'},
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
