import React, {useState} from 'react';
import {Button} from '../../../ReusableComponents';
import {Box, Text} from '../../../Theme/Index';

const DeleteAccount = props => {
  const {setDeleteAcc} = props;

  const delete_account_points = [
    {
      id: 1,
      point: 'Your AFA account cannot be reinstated.',
    },
    {
      id: 2,
      point: 'You will no longer have access to your AFA account data.',
    },
    {
      id: 3,
      point:
        'AFA Wallet transaction history will be deleted and no longer accessible.',
    },
    {
      id: 4,
      point: 'All AFA rewards & benefits will be forfeited.',
    },
    {
      id: 5,
      // point: 'If you have remaining funds in your AFA Wallet, please send a balance refund request before the end of data retention period.'
      point:
        'All AFA Wallet funds will be forfeited once the account is deleted.',
    },
  ];

  const handleDeleteAccount = () => setDeleteAcc(true);

  return (
    <Box>
      <Text variant={'blackshade16400'}>
        You are about to delete your AFA account. This will go into effect after
        30 days. Please be aware and agree to the following conditions:
      </Text>
      {delete_account_points.map(data => {
        return (
          <Text key={data?.id} mt={'m'} variant={'blackshade16400'}>
            • {data?.point}
          </Text>
        );
      })}
      <Box height={45} mt="l">
        <Button label="Delete Account" onPress={handleDeleteAccount} />
      </Box>
    </Box>
  );
};

export default DeleteAccount;
