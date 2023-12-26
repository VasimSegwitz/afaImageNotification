/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import {Input} from '../../ReusableComponents/Input';
import Button from '../../ReusableComponents/Button';
import {wp} from '../../Helpers/responsive-ratio';
import MobileConfirmation from '../../ReusableComponents/Modals/MobileConfirmation';
import {
  reSendOtp,
  userSignUp,
  userCheckPhoneNumber,
} from '../../Services/AuthService';
import {useMutation} from 'react-query';
import {displayErrorToast, displaySuccessToast, ios} from '../../../utils';
import {useDispatch} from 'react-redux';
import {AuthConstants} from '../../../Redux';
import {usekeyBoardOpen} from '../../ReusableComponents/Hooks';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Ionicon} from '../../ReusableComponents/Icons';

export default props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [firstnameError, setFirstNameError] = useState('');
  const [lastnameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [signupCountryCode, SetSignupCountryCode] = useState('');
  const [showCheck, setShowCheck] = useState('');
  const [loading, setLoading] = useState('');
  const [showLoader, setShowLoader] = useState({
    value: '',
    show: false,
    showLoading: false,
  });
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

  /**
   * @function useEffect
   * @description it will intially render and will clear the input if there is anything
   */
  useEffect(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setFirstNameError();
    setLastNameError();
    setEmailError();
    setConfirmPasswordError();
    setPasswordError();
    setPhoneError();
  }, []);

  /**
   * @function onSubmit
   * @description it will call the singup function after validation done
   */

  const onSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    var passRegx =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

    setFirstNameError();
    setLastNameError();
    setEmailError();
    setConfirmPasswordError();
    setPasswordError();
    setPhoneError();

    if (firstname?.length < 2 || !firstname?.match(regex)) {
      setFirstNameError(
        'First name accepts only alphabets and min length 2 and max length 16.',
      );
      return;
    }
    if (lastname?.length < 2 || !lastname?.match(regex)) {
      setLastNameError(
        'Last name accepts only alphabets and min length 2 and max length 16.',
      );
      return;
    }
    if (email && email.trim().length === 0) {
      setEmailError('Enter a valid email');
      return;
    }
    // if (phone.trim().length == 0 || phone.trim().length < 10) {
    if (phone && phone.trim().length == 0) {
      setPhoneError(
        'Your phone number should be between 10 to 11 digits. Please enter a valid number.',
      );
      return;
    }

    if (reg.test(email) === false) {
      setEmailError('Invalid email');
      return;
    }
    if (
      (password && password.trim().length === 0) ||
      passRegx.test(password) == false
    ) {
      setPasswordError(
        'Password must be 8-20 characters with at least 1 number, 1 Capital letter and 1 special character',
      );
      return;
    }
    if (
      (confirmpassword && confirmpassword.trim().length === 0) ||
      passRegx.test(confirmpassword) == false
    ) {
      setConfirmPasswordError('Confirm Password is not same');
      return;
    }

    if (password.length > 0 && password !== confirmpassword) {
      setConfirmPasswordError('Password is not the same');
      return;
    }
    navigation.navigate('MobileConfirmation', {
      number: phone,
      signupCountryCode: signupCountryCode,
      onPress: onSingup,
    });
  };

  /**
   * @function otpResend
   * @description mutation for the resend Otp
   */
  const otpResend = useMutation('reSendOtp', reSendOtp, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
      }
      if (data?.success == 1) {
        displaySuccessToast(data?.message || 'Verification code has been sent');
      }
    },
  });

  const checkPhoneNumber = () => {
    setShowLoader({
      value: '',
      show: true,
      showLoading: true,
    });
    const d = parseInt(phone, 10);
    userCheckPhoneNumber({
      phone_prefix: signupCountryCode,
      phone: d.toString(),
    })
      .then(res => {
        setLoading(false);
        const {data} = res;
        if (data.success == 0) {
          setShowLoader({
            value: false,
            show: true,
            showLoading: false,
          });
        } else {
          setShowLoader({
            value: data?.is_registered,
            show: true,
            showLoading: false,
          });
        }
      })
      .catch(err => {
        setShowLoader({
          value: false,
          show: false,
          showLoading: false,
        });
        setLoading(false);
        displayErrorToast(err?.message);
      });
  };

  useEffect(() => {
    if (phone.trim().length > 8) {
      checkPhoneNumber();
    } else {
      setShowLoader({
        value: false,
        show: false,
        showLoading: false,
      });
    }
  }, [phone]);

  /**
   * @function onSingup
   * @description will mutate the signup api
   */

  const onSingup = () => {
    const d = parseInt(phone, 10);

    const body = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      phone_prefix: signupCountryCode,
      phone: d.toString(),
      password: password,
      confirm_password: confirmpassword,
    };

    mutate(body);
  };

  /**
   * @function mutate
   * @description will mutate the userSignUp api
   */

  const {isLoading, mutate} = useMutation('userSignUp', userSignUp, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || 'Something went wrong');
        setConfirmPasswordError(data?.data?.message);
        return;
      }
      if (data?.success == 1 && data?.data?.email) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });

        setPhoneError();

        displaySuccessToast(data?.message || 'User successfully signup');

        // AsyncStorage.setItem('Auth_token_Expiry', JSON.stringify(data));

        const body = {
          otpType: '',
        };
        otpResend.mutate(body);

        navigation?.navigate('Verification', {
          type: 'signup',
          phone_prefix: signupCountryCode,
          phone: phone,
          password: password,
          userinfo: data,
        });
      }
    },
  });

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
      pt="t"
      pl="t"
      pr="t"
      style={{
        backgroundColor: palette.white,
        paddingTop: route?.params?.space?.top,
        //paddingBottom: route?.params?.space?.bottom,
      }}
      onStartShouldSetResponder={Keyboard.dismiss}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 50,
        }}
        style={{
          flexGrow: 1,
          paddingBottom: 50,
          //marginBottom: 20,
        }}
        keyboardShouldPersistTaps="handled">
        <Box flex={1} pb="m" onStartShouldSetResponder={Keyboard.dismiss}>
          <Box mt="l" mb="xl">
            <Text variant={'blackshade28500'}>
              Hello! Register to get started
            </Text>
            <Text variant={'blackshade16400'}>
              Get an AFA account and find your joy of playing sports
            </Text>
          </Box>
          <Box flexDirection={'row'} flex={0.1}>
            <Box flex={0.5}>
              <Input
                place="Your First Name"
                value={firstname}
                error={firstnameError}
                onChange={e => setFirstName(e.replace(/[^a-zA-Z]/g, ''))}
                maxLength={16}
              />
            </Box>
            <Box flex={0.5}>
              <Input
                place="Your Last Name"
                value={lastname}
                error={lastnameError}
                onChange={e => setLastName(e.replace(/[^a-zA-Z]/g, ''))}
                maxLength={16}
              />
            </Box>
          </Box>
          <Box flex={0.95}>
            <Input
              place="Your email"
              value={email}
              error={emailError}
              onChange={e => setEmail(e)}
            />

            <Input
              place="Your phone number"
              value={phone}
              error={phoneError}
              onChange={e => setPhone(e.replace(/[^0-9]/g, ''))}
              contact
              numberPad
              SetSignupCountryCode={SetSignupCountryCode}
              signupCountryCode={signupCountryCode}
              maxLength={11}
              showLoader={showLoader}
            />
            <Input
              place="Password"
              value={password}
              error={passwordError}
              onChange={e => handlePassword(e)}
              hidePassword
              maxLength={20}
              textContentType="oneTimeCode"
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
                        variant={
                          item?.value ? 'green14400' : 'blackshade114400'
                        }
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
              maxLength={20}
              textContentType="oneTimeCode"
            />
          </Box>
        </Box>
        {/* {!keyboardStatus && ( */}
        <Box
          width={wp(100) - 30}
          // position={'absolute'}
          // bottom={wp(15)}
          alignSelf="center">
          <Button
            onPress={() => onSubmit()}
            label={'Send Verification code'}
            buttonStyle={{
              height: wp(10),
            }}
          />
          <Box width={wp(70)} alignSelf="center" mt="m">
            <Text variant={'blackshade12500'} textAlign="center">
              By continuing, I agree with the Terms & Conditions, Privacy
              Policies
            </Text>
          </Box>
        </Box>

        <Box
          alignSelf={'center'}
          position="absolute"
          bottom={10}
          alignItems="center">
          <Text variant={'blackshade14400'}>
            Already have an account?{' '}
            <TouchableBox onPress={() => navigation?.navigate('Login')}>
              <Text
                variant="blackshade14400"
                textDecorationLine="underline"
                style={{
                  top: ios ? 2 : 5,
                  // position: 'absolute',
                }}>
                Login now
              </Text>
            </TouchableBox>
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};
