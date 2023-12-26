import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AuthConstants} from '../../../Redux';
import {displayErrorToast} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header} from '../../ReusableComponents';
import {getUserProfile, verifyEmailSendOTP} from '../../Services/ProfileApi';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import styles from '../styles';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state?.auth?.user?.user?.data);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const initialState = {
    email: email,
    is_email_verified: false,
    is_otp_sent: false,
    is_resend: false,
    emailError: '',
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState({
      ...state,
      email: email,
      is_email_verified: false,
      is_otp_sent: false,
      is_resend: false,
      emailError: '',
    });
  }, [isFocused]);

  const verifyEmailMutation = useMutation('verifyEmail', verifyEmailSendOTP, {
    onSuccess: data => {
      if (data?.success == 0) return displayErrorToast(data?.message);
      if (data?.success == 1)
        return setState({...state, is_otp_sent: true, is_email_verified: true});
    },
    onError: error => {
      if (error?.data?.success == 0)
        return displayErrorToast(error?.data?.message);
    },
  });

  const handleConfirmEmail = () => {
    if (state.email && state.email.trim().length === 0)
      return setState({...state, emailError: 'Fill in an email address'});
    if (reg.test(state.email) === false)
      return setState({...state, emailError: 'Invalid email address'});
    setState({...state, is_email_verified: true, emailError: ''});
    verifyEmailMutation.mutate();
  };

  const handleSend = () => {
    if (state.email && state.email.trim().length === 0)
      return setState({...state, emailError: 'Fill in an email address'});
    if (reg.test(state.email) === false)
      return setState({...state, emailError: 'Invalid email address'});
    verifyEmailMutation.mutate();
    setState({...state, is_resend: false, emailError: ''});
  };

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        if (data?.data?.user_info?.email_verified_datetime != null)
          navigation.goBack();
      }
    },
    onError: error => {},
  });

  const handleVerifyOtp = () => {
    getUserProfileQuery.refetch();
  };

  const handleEmail = value => setState({...state, email: value});
  const handleResend = () => setState({...state, is_resend: true});

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header left />
      {!state.is_email_verified ? (
        <>
          <Box p={'l'} flex={1}>
            <Text variant={'blackshade20500'}>Confirm your email address</Text>
            <Text marginVertical={'l'} variant={'blackshade16400'}>
              You have registered this account before with the following email
              address:
            </Text>
            <Text variant={'blackshade14500'}>Email</Text>
            <TextInput
              placeholder={'youremailaddress@gmail.com'}
              style={[
                styles.inputStyle,
                {
                  borderColor:
                    state.emailError.length > 0
                      ? palette?.destructive
                      : palette.inputBorder,
                },
              ]}
              placeholderTextColor={palette?.placeholder}
              onChangeText={handleEmail}
              value={email}
              editable={false}
            />
            {state.emailError.length > 0 && (
              <Text variant={'destructive14400'}>{state.emailError}</Text>
            )}
            <Text variant={'blackshade16400'} mt={'l'}>
              Please confirm this information. A verification email will be sent
              to the address above.
            </Text>
          </Box>
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button
              label="Confirm Email Address"
              onPress={handleConfirmEmail}
            />
          </Box>
        </>
      ) : !state.is_resend ? (
        <>
          <Box p={'l'} flex={1}>
            <Text variant={'blackshade20500'}>Verify your email address</Text>
            <Text mt={'l'} variant={'blackshade16400'}>
              It's sent!
            </Text>
            <Box flexDirection={'row'} flexWrap="wrap">
              {/* <Text variant={"blackshade16400"}>Make sure to tap the button in the email sent to</Text> */}
              <Text variant={'primary16500'} textDecorationLine={'underline'}>
                {email}
              </Text>
              <Text variant={'blackshade16400'}>to verify your account.</Text>
            </Box>
            <Text variant="tertiary16400" fontWeight={'bold'} marginTop={'l'}>
              Didn't receive the email?
            </Text>
            <Box flexDirection="row" flexWrap="wrap" mt={'s'}>
              <Text variant="tertiary16400">Check your spam or</Text>
              <TouchableBox onPress={handleResend}>
                <Text
                  variant="tertiary16400"
                  textDecorationLine={'underline'}
                  marginHorizontal="s">
                  resend email.
                </Text>
              </TouchableBox>
            </Box>
          </Box>
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button
              disabled={!state.is_otp_sent}
              label="I am Verified"
              onPress={handleVerifyOtp}
            />
          </Box>
        </>
      ) : (
        <>
          <Box p={'l'} flex={1}>
            <Text variant={'blackshade20500'}>Resend verification email</Text>
            <Text marginVertical={'l'} variant={'blackshade16400'}>
              Please make sure the email address is correct!
            </Text>
            <Text variant={'blackshade14500'}>Email Address</Text>
            <TextInput
              placeholder={'youremailaddress@gmail.com'}
              style={[
                styles.inputStyle,
                {
                  borderColor:
                    state.emailError.length > 0
                      ? palette?.destructive
                      : palette.inputBorder,
                },
              ]}
              placeholderTextColor={palette?.placeholder}
              onChangeText={handleEmail}
              value={email}
              editable={false}
            />
            {state.emailError.length > 0 && (
              <Text variant={'destructive14400'}>{state.emailError}</Text>
            )}
          </Box>
          <Box height={wp(14)} marginHorizontal={'m'} mb="m">
            <Button label="Send" onPress={handleSend} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default VerifyEmail;
