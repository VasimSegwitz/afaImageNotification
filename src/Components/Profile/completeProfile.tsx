import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {getIsEmailVerified, getIsWalletActivated} from '../Helpers/utils';
import {feather} from '../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../Theme/Index';
import styles from './styles';

const CompleteProfile = props => {
  const {is_email_verified, is_wallet_activated} = props;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const handleVerifyEmail = () => navigation.navigate('VerifyEmail');
  const handleActivateAFA = () => navigation.navigate('Wallet');

  const [isEmailVerified, setIsEmailVerified] = useState('false');
  const [IsWalletActivated, setIsWalletActivated] = useState('false');

  const IsEmailVerifiedHelper = async () => {
    return await getIsEmailVerified()
      .then(val => {
        setIsEmailVerified(val);
      })
      .catch(error => {});
  };

  const IsWalletActivatedHelper = async () => {
    return await getIsWalletActivated()
      .then(val => {
        setIsWalletActivated(val);
      })
      .catch(error => {});
  };

  useEffect(() => {
    IsEmailVerifiedHelper();
    IsWalletActivatedHelper();
  }, [isFocused]);

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {is_email_verified == null && isEmailVerified != 'true' && (
        <TouchableBox
          backgroundColor={'white'}
          style={[styles.emailVerification, TypographyStyles.cardShadow]}
          onPress={handleVerifyEmail}>
          <Box ml={'l'}>
            <FastImage
              source={Images.EmailVerification}
              style={{height: wp(6), width: wp(6)}}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant="blackshade12400" mt={'s'}>
              VERIFICATION
            </Text>
          </Box>
          <Box ml={'l'} mt={'l'} flexDirection={'row'} alignItems={'center'}>
            <Box mr={'l'}>
              <Text variant={'blackshade16500'}>Verify</Text>
              <Text variant={'blackshade16500'}>Your email</Text>
            </Box>
            {feather('arrow-right', wp(10), palette?.primary)}
          </Box>
        </TouchableBox>
      )}

      {is_wallet_activated == null && IsWalletActivated != 'true' && (
        <TouchableBox
          onPress={handleActivateAFA}
          backgroundColor={'white'}
          style={[
            styles.emailVerification,
            TypographyStyles.cardShadow,
            {marginRight: wp(4)},
          ]}>
          <Box ml={'l'}>
            <FastImage
              source={Images.WalletVerification}
              style={{height: wp(6), width: wp(6)}}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text variant="blackshade12400" mt={'s'}>
              WALLET
            </Text>
          </Box>
          <Box ml={'l'} mt={'l'} flexDirection={'row'} alignItems={'center'}>
            <Box mr={'l'}>
              <Text variant={'blackshade16500'}>Activate AFA</Text>
              <Text variant={'blackshade16500'}>Pay</Text>
            </Box>
            {feather('arrow-right', wp(10), palette?.primary)}
          </Box>
        </TouchableBox>
      )}
    </ScrollView>
  );
};

export default CompleteProfile;
