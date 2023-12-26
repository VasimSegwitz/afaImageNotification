import React from 'react';
import {Pressable} from 'react-native';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';
import Button from '../../Button';
import {Ionicon} from '../../Icons';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import Animated, {SlideInDown} from 'react-native-reanimated';

const MobileConfirmation = props => {
  const {route} = props;
  const {onPress, number, signupCountryCode} = route?.params;
  const navigation = useNavigation();

  return (
    <Animated.View
      entering={SlideInDown}
      style={{
        flex: 1,
      }}>
      <Pressable
        style={styles.overlay}
        onPress={() => navigation.goBack(null)}
      />
      <Box style={styles.modalStyle}>
        <Box style={styles.whiteCard}>
          <Box style={styles.buttonsWrap}>
            <Text style={styles.blessingImg}>Confirm your phone number</Text>
            <TouchableBox
              style={styles.closeIcon}
              onPress={() => navigation.goBack(null)}>
              {Ionicon('close', 20, palette?.black)}
            </TouchableBox>
          </Box>
          <Box style={styles.textWrap} paddingVertical="l">
            <Text style={styles.midText}>
              An OTP code will be send to this phone number
            </Text>
          </Box>
          <Box style={styles.textWrap} paddingVertical="xxl">
            <Text style={styles.number}>
              {signupCountryCode} {number}
            </Text>
          </Box>

          <Button
            label="Send Verification Code"
            onPress={() => {
              navigation.goBack(null);
              onPress();
            }}
          />
          <TouchableBox onPress={() => navigation.goBack(null)}>
            <Box style={styles.textEditWrap}>
              <Text style={styles.Editnumber}>Edit the phone number</Text>
            </Box>
          </TouchableBox>
        </Box>
      </Box>
    </Animated.View>
  );
};

export default MobileConfirmation;
