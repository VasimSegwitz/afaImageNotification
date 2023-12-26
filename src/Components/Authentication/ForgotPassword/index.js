/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import {Input} from '../../ReusableComponents/Input';
import Button from '../../ReusableComponents/Button';
import {wp} from '../../Helpers/responsive-ratio';
import MobileConfirmation from '../../ReusableComponents/Modals/MobileConfirmation';
import {Header} from '../../ReusableComponents';
import {useMutation} from 'react-query';
import {forgotPassword, login} from '../../Services/AuthService';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {usekeyBoardOpen} from '../../ReusableComponents/Hooks';

export default props => {
  const {navigation, route} = props;

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signupCountryCode, SetSignupCountryCode] = useState('');

  const keyboardopen = usekeyBoardOpen();
  const regex = /^[a-zA-Z ]+$/;

  /**
   * @function onSubmit
   * @description will check the validation of the phone number
   */

  const onSubmit = () => {
    setPhoneError();

    if (phone?.length < 7) {
      setPhoneError('Phone number should be min 7 to max 15 digits.');
      return;
    }
    navigation.navigate('MobileConfirmation', {
      number: phone,
      signupCountryCode: signupCountryCode,
      onPress: onForgot,
    });
  };

  /**
   * @function onForgot
   * @description will call the mutation of the forgot password api
   */

  const onForgot = () => {
    Keyboard.dismiss();
    const d = parseInt(phone, 10);
    const body = {
      phone_prefix: signupCountryCode,
      phone: d.toString(),
    };

    mutate(body);
  };

  /**
   * @function mutate
   * @description will mutate the forgotPassword api
   */

  const {isLoading, mutate} = useMutation('forgotPassword', forgotPassword, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
        setPhoneError(data?.data?.message);
        return;
      }
      if (data?.success == 1) {
        setPhoneError();

        displaySuccessToast(data?.message || 'Sent the Otp');
        navigation?.navigate('Verification', {
          type: 'Forgot',
          phone_prefix: signupCountryCode,
          phone: phone,
        });
      }
    },
  });

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,
        // paddingTop: route?.params?.space?.top,
        paddingBottom: route?.params?.space?.bottom,
      }}>
      <Header left navigation={navigation} />

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}> */}
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
          <Box
            // mt="xxl"
            mb="xl"
            style={{
              marginTop: wp(10),
            }}>
            <Text variant={'blackshade28500'}>Forgot password?</Text>
            <Text variant={'blackshade16400'} mt="l">
              No worries, it happens to the best of us. Just enter the phone
              number linked with your account.
            </Text>
          </Box>

          <Input
            place="Enter your phone number"
            value={phone}
            error={phoneError}
            onChange={e => setPhone(e)}
            contact
            numberPad
            SetSignupCountryCode={SetSignupCountryCode}
          />

          <Box
            width={wp(100) - 30}
            // position={'absolute'}
            bottom={wp(4)}
            flex={1}
            justifyContent="flex-end"
            alignSelf="flex-end">
            {!keyboardopen && phoneError && (
              <Box
                // mt="xxl"
                mb="m"
                style={{
                  marginTop: wp(10),
                }}>
                <Text variant={'blackshade116600'}>
                  Want to use this phone number?{'\n'}
                  <Text variant={'blackshade116400'}>
                    Register for a new account on AFA. Click here to{' '}
                    <TouchableBox
                      style={{marginTop: -3}}
                      onPress={() => navigation?.navigate('Signup')}>
                      <Text
                        variant="blackshade116400"
                        textDecorationLine="underline">
                        Register
                      </Text>
                    </TouchableBox>
                  </Text>
                </Text>
              </Box>
            )}
            {/* {!keyboardopen && ( */}
            <Button
              onPress={() => onSubmit()}
              label={'Send Verification Code'}
              buttonStyle={{
                height: wp(10),
              }}
            />
            {/* )} */}
          </Box>
          {/* {!keyboardopen && ( */}
          <Box
            alignSelf={'center'}
            // position="absolute"
            bottom={10}
            alignItems="center">
            <Text variant={'blackshade14400'}>
              Remember Password?{' '}
              {/* <TouchableBox onPress={() => navigation?.navigate('Login')}> */}
              <Text
                variant="blackshade14400"
                textDecorationLine="underline"
                onPress={() => navigation?.navigate('Login')}
                style={
                  {
                    // paddingTop: 2,
                  }
                }>
                Login
              </Text>
              {/* </TouchableBox> */}
            </Text>
          </Box>
          {/* )} */}
        </Box>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </Box>
  );
};
