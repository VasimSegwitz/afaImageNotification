import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header} from '../../ReusableComponents';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from '../Intro/styles';
import WalletTab from './walletTab';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {EntypoIcon} from '../../ReusableComponents/Icons';

const WalletTransaction = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [amount, setAmount] = useState(0);
  const [lock, setLock] = useState(false);

  const handleSetPin = () => navigation.navigate('SetUpPin');
  const handleForgotPin = () => navigation.navigate('ForgotPin');
  const handleTopUp = () =>
    navigation.navigate('TopUp', {wallet_balance: amount});
  const handleShowall = () => navigation.navigate('MyTransactions');
  const handleLock = () => setLock(!lock);

  useEffect(() => {
    setLock(false);
  }, [isFocused]);

  return (
    <Box flex={1} backgroundColor="white">
      {lock && (
        <TouchableBox onPress={() => setLock(false)} style={[styles.overLay]} />
      )}
      <ImageBackground
        source={Images?.MyWalletBackground}
        style={{
          height: wp(60),
          width: '100%',
        }}
        resizeMode={FastImage?.resizeMode?.stretch}>
        <Header
          title="My Wallet"
          left
          RenderRightComponent={() => (
            <TouchableBox onPress={handleLock}>
              {EntypoIcon('lock', wp(6), palette?.white)}
            </TouchableBox>
          )}
        />
      </ImageBackground>
      <Box
        style={[
          styles.activateWalletBottomContainer,
          {alignItems: 'center', top: wp(-5)},
        ]}
        backgroundColor="white">
        <Box
          style={[styles.mybalance, TypographyStyles.cardShadow]}
          backgroundColor="white">
          <Box>
            <Text
              mt={'l'}
              variant={'blackshade18500'}
              style={{marginLeft: wp(7), fontWeight: 'bold'}}>
              My balance:
            </Text>
            <Box flexDirection={'row'} mt={'s'} style={{marginLeft: wp(7)}}>
              <Text variant={'blackshade20500'} style={{fontWeight: 'bold'}}>
                RM
              </Text>
              <Text
                variant={'black36500'}
                ml={'s'}
                style={{top: wp(-1), fontWeight: 'bold'}}>
                {amount}
              </Text>
              <FastImage
                source={Images.Protected}
                style={{
                  height: wp(5),
                  width: wp(5),
                  marginLeft: wp(2),
                  marginTop: wp(4),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </Box>
          </Box>
          <Box style={styles.divider} />
          <Box height={wp(14)} width={wp(30)} mr={'xl'} mt={'m'}>
            <Button
              onPress={handleTopUp}
              RenderComponent={() => (
                <Box flexDirection={'row'} alignItems={'center'}>
                  <FastImage
                    source={Images.WalletTopupIcon}
                    style={{
                      height: wp(6),
                      width: wp(6),
                      marginRight: wp(2),
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text variant={'tertiary14500'} color="white">
                    Top-up
                  </Text>
                </Box>
              )}
            />
          </Box>
        </Box>
      </Box>
      <Box
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        style={{marginHorizontal: wp(5), top: wp(-12)}}>
        <Text variant={'blackshade18500'}>Wallet Transactions</Text>
        <TouchableBox onPress={handleShowall}>
          <Text variant={'primary12500'}>Show all</Text>
        </TouchableBox>
      </Box>
      <WalletTab setAmount={setAmount} />
      {lock && (
        <Box
          backgroundColor={'white'}
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              zIndex: 2,
            },
            TypographyStyles.cardShadow,
          ]}>
          <TouchableBox onPress={handleSetPin}>
            <Text textAlign={'center'} mt={'m'} variant={'blackshade16400'}>
              Update PIN
            </Text>
          </TouchableBox>
          <Box
            borderWidth={0.5}
            marginVertical={'m'}
            style={{borderColor: palette?.tertiary1}}
          />
          <TouchableBox onPress={handleForgotPin}>
            <Text textAlign={'center'} mb={'m'} variant={'blackshade16400'}>
              Forgot PIN
            </Text>
          </TouchableBox>
        </Box>
      )}
    </Box>
  );
};

export default WalletTransaction;
