/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {Header} from '../ReusableComponents';
import Button from '../ReusableComponents/Button';
import {Box, palette, Text} from '../Theme/Index';

export default props => {
  const {navigation, route} = props;

  const onSubmit = () => {
    navigation?.navigate('Options');
  };

  const dispatch = useDispatch();
  const { first_name } = useSelector(state => state?.auth?.user?.user?.data)

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,

        paddingBottom: route?.params?.space?.bottom,
      }}>
      <Header navigation={navigation} />

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
            <Box flex={1} mt="xl" left={wp(-14)}>
              <FastImage
                source={Images?.Greetings}
                style={{
                  height: wp(80),
                  width: wp(100),
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
                style={{
                  marginTop: wp(10),
                }}>
                <Text variant={'primary28700'}>Welcome to AFA, {first_name}.</Text>

                <Text variant={'blackshade16400'} mt="l">
                  Let us know more about you so we {'\n'}can give you a better
                  experience of{'\n'}the app.
                </Text>
              </Box>

              <Button
                onPress={() => onSubmit()}
                label={'OK'}
                buttonStyle={{
                  height: wp(10),
                  marginBottom: 10,
                }}
              />
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};
