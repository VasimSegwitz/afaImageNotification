/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import {Input} from '../../ReusableComponents/Input';
import Button from '../../ReusableComponents/Button';
import {wp} from '../../Helpers/responsive-ratio';
import MobileConfirmation from '../../ReusableComponents/Modals/MobileConfirmation';
import {Header} from '../../ReusableComponents';
import {resetPassword} from '../../Services/AuthService';
import {useMutation} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {usekeyBoardOpen} from '../../ReusableComponents/Hooks';
import {Ionicon} from '../../ReusableComponents/Icons';

export default props => {
  const {navigation, route} = props;

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [errorData, setErrordata] = useState([
    {
      error: 'a lowercase and uppercase letter (a-z,A-Z)',
      value: false,
    },
    {
      error: 'a number',
      value: false,
    },
    {
      error: 'a special character ($ & @ ! # % ^ *)',
      value: false,
    },
    {
      error: 'at least 8 characters',
      value: false,
    },
  ]);

  const regex = /^[a-zA-Z ]+$/;

  const keyboardopen = usekeyBoardOpen();

  /**
   * @function mutate
   * @description will mutate the resetPassword api
   */

  const {isLoading, mutate} = useMutation('resetPassword', resetPassword, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.message || 'Something went wrong');
        setConfirmPasswordError(data?.message);
      }
      if (data?.success == 1) {
        setConfirmPasswordError();

        displaySuccessToast(data?.message || 'User successfully signup');

        navigation?.navigate('PasswordChanged');
      }
    },
  });

  /**
   * @function onSubmit
   * @description will check the validation of the password call the mutation
   */

  const onSubmit = () => {
    var passRegx =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

    setPasswordError();
    setConfirmPasswordError();

    // if (password.trim().length === 0 || passRegx.test(password) == false) {
    //   setPasswordError(
    //     'Password must be 8-20 characters with at least 1 number, 1 Capital letter and 1 special character',
    //   );
    //   return;
    // }

    if (password.length > 0 && password !== confirmpassword) {
      setConfirmPasswordError('Confirm Password is not same');
      return;
    }

    const body = {
      phone_prefix: route?.params?.phone_prefix,
      otp: route?.params?.otp,

      phone: route?.params?.phone,
      password: password,
      confirm_password: confirmpassword,
    };

    mutate(body);
  };

  const handlePassword = e => {
    var passRegx =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    var uppercase = /(?=.*[A-Z])/;
    var lowercase = /(?=.*[a-z])/;
    var special = /(?=.*\W)/;
    var num = /(?=.*[0-9])/;
    var long = /.{8,16}/;

    setPassword(e);

    if (
      !uppercase.test(e) ||
      !num.test(e) ||
      !special.test(e) ||
      !long.test(e)
    ) {
      setPasswordError('Your password must contain:');
      // return;
    } else {
      setPasswordError();
    }

    setErrordata([
      {
        error: 'a lowercase and uppercase letter (a-z,A-Z)',
        value:
          uppercase.test(e) == true && lowercase.test(e) == true ? true : false,
      },
      {
        error: 'a number',
        value: num.test(e) == true ? true : false,
      },
      {
        error: 'a special character ($ & @ ! # % ^ *)',
        value: special.test(e) == true ? true : false,
      },
      {
        error: 'at least 8 characters',
        value: long.test(e) == true ? true : false,
      },
    ]);
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
            <Text variant={'blackshade20500'}>Create new password</Text>
          </Box>

          <Input
            place="Password"
            value={password}
            error={passwordError}
            onChange={e => handlePassword(e)}
            hidePassword
          />
          {passwordError && (
            <Box mb="s">
              {errorData?.map(item => {
                return (
                  <Box
                    flexDirection={'row'}
                    alignItems={'center'}
                    key={item?.error}>
                    {Ionicon(
                      'checkmark-sharp',
                      14,
                      item?.value ? palette?.green : palette?.warmGrey,
                    )}
                    <Text
                      ml="s"
                      variant={item?.value ? 'green14400' : 'blackshade114400'}
                      lineHeight={22}>
                      {item?.error}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          )}
          <TextInput style={{height: 0.1}} />

          <Input
            place="Confirm password"
            value={confirmpassword}
            error={confirmpasswordError}
            onChange={e => setConfirmPassword(e)}
            hidePassword
          />
          {/* {!keyboardopen && ( */}
          <Box
            width={wp(100) - 30}
            position={'absolute'}
            bottom={wp(13)}
            alignSelf="center">
            <Button
              onPress={() => onSubmit()}
              label={'Reset Password'}
              buttonStyle={{
                height: wp(10),
              }}
            />
          </Box>
          {/* )} */}
          {/* {!keyboardopen && ( */}
          <Box
            alignSelf={'center'}
            position="absolute"
            bottom={10}
            alignItems="center">
            <Text variant={'blackshade14400'}>
              Remember Password?{' '}
              {/* <TouchableBox onPress={() => navigation?.navigate('Login')}> */}
              <Text
                variant="blackshade14400"
                textDecorationLine="underline"
                onPress={() => navigation?.navigate('Login')}>
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
