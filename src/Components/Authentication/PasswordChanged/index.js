/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents';
import Button from '../../ReusableComponents/Button';
import {Box, palette, Text} from '../../Theme/Index';

export default props => {
  const {navigation, route} = props;

  const regex = /^[a-zA-Z ]+$/;

  /**
   * @function onSubmit
   * @description will throw the user to login screen
   */

  const onSubmit = () => {
    navigation?.navigate('Login');
  };

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,

        paddingBottom: route?.params?.space?.bottom,
      }}>
      <Header left navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <Box flex={1} p="t" onStartShouldSetResponder={Keyboard.dismiss}>
            <Box flex={1} alignItems="center" mt="xl">
              <FastImage
                source={Images?.passwordChanged}
                style={{
                  height: wp(80),
                  width: wp(80),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
            <Box
              width={wp(100) - 30}
              position={'absolute'}
              bottom={wp(1)}
              alignSelf="center">
              <Box
                mb="xxl"
                alignItems={'center'}
                style={{
                  marginTop: wp(10),
                }}>
                <Text variant={'primary28600'}>Password Changed!</Text>

                <Text variant={'blackshade16400'} textAlign="center">
                  Hurray! Your password has been {'\n'}changed successfully.
                  {'\n'}
                  Remember it this time ;)
                </Text>
              </Box>
              <Button
                onPress={() => onSubmit()}
                label={'Back to Login'}
                buttonStyle={{
                  height: wp(10),
                }}
              />
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
