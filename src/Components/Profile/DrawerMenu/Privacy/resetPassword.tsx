import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {Button} from '../../../ReusableComponents';
import {Input} from '../../../ReusableComponents/Input';
import {resetPassword} from '../../../Services/ProfileApi';
import {Box, Text} from '../../../Theme/Index';

const ResetPassword = () => {
  const navigation = useNavigation();
  const initialState = {oldPassword: '', newPassword: ''};
  const [state, setState] = useState(initialState);
  const [passwordError, setPasswordError] = useState('');

  const resetPasswordMutation = useMutation(
    'resetPasswordMutation',
    resetPassword,
    {
      onSuccess: data => {
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          setPasswordError('');
          displaySuccessToast(data?.message);
          navigation.goBack();
          return;
        }
      },
      onError: error => {
        setPasswordError('');
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  const handleResetPassword = () => {
    var passRegx =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if (
      (state.newPassword && state.newPassword.trim().length === 0) ||
      passRegx.test(state.newPassword) == false
    ) {
      setPasswordError(
        'Password must be 8-20 characters with at least 1 number, 1 Capital letter and 1 special character',
      );
      return;
    }
    const body = {
      old_password: state.oldPassword,
      password: state.newPassword,
      confirm_password: state.newPassword,
    };
    resetPasswordMutation.mutate(body);
  };

  const handleOldPassword = e => {
    setState({...state, oldPassword: e});
  };

  return (
    <Box>
      <Input
        place="Old Password"
        value={state.oldPassword}
        onChange={e => handleOldPassword(e)}
        hidePassword
      />
      <Input
        place="New Password"
        error={passwordError}
        value={state.newPassword}
        onChange={e => setState({...state, newPassword: e})}
        hidePassword
      />
      <Box height={45} mb="m">
        <Button label="Reset Password" onPress={handleResetPassword} />
      </Box>
    </Box>
  );
};

export default ResetPassword;
