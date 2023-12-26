import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {getIsWalletActivated} from '../Helpers/utils';
import WalletIntro from './Intro/walletIntro';
import WalletTransaction from './Transaction/walletTransaction';
import {useSelector} from 'react-redux';

const Wallet = () => {
  const isFocused = useIsFocused();
  const is_wallet_activated = useSelector(
    state => state?.auth?.user?.user?.data?.wallet?.activated_at,
  );
  //console.log(is_wallet_activated);
  const [IsWalletActivated, setIsWalletActivated] = useState('false');

  const IsWalletActivatedHelper = async () => {
    return await getIsWalletActivated()
      .then(val => {
        setIsWalletActivated(val);
      })
      .catch(error => {});
  };

  useEffect(() => {
    IsWalletActivatedHelper();
  }, [isFocused]);

  return is_wallet_activated != null || IsWalletActivated == 'true' ? (
    <WalletTransaction />
  ) : (
    <WalletIntro />
  );
};

export default Wallet;
