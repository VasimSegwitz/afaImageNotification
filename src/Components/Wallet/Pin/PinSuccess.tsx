import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, Keyboard} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {Input} from '../../ReusableComponents/Input';
import {
  Box,
  fonts,
  os,
  palette,
  size,
  Text,
  TouchableBox,
} from '../../Theme/Index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useMutation} from 'react-query';
import {updatePin} from '../../Services/WalletApi';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

const PinSuccess = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const checkMarkRef = useRef(null);

  const refreshUpdate = () => {
    const {params} = route;
    const {refreshConfirm} = params;
    navigation.goBack(null);
    refreshConfirm();
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header left />
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Box flex={1} justifyContent={'center'} alignItems={'center'} p={'l'}>
          <Text textAlign="center" variant={'primary28500'} mb={'l'}>
            Your AFA PIN has been updated!
          </Text>
          <Box width={size?.width / 1.2}>
            <Text textAlign="center" variant={'tertiary16400'}>
              Yay! You will be asked to enter your PIN each time you book a
              Venue or make a payment.
            </Text>
          </Box>
        </Box>
        <Box flex={1} justifyContent="flex-end">
          <Box
            marginHorizontal={'m'}
            style={{marginBottom: insets?.bottom !== 0 ? insets?.bottom : 20}}>
            <Button label="Back to Wallet" onPress={() => refreshUpdate()} />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default PinSuccess;
