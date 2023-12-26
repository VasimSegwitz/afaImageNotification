import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {
  Box,
  palette,
  TouchableBox,
  Text,
  fonts,
  TypographyStyles,
} from '../../../Theme/Index';
import {styles} from './styles';
import Button from '../../Button';
import {Down, Ionicon} from '../../Icons';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Input} from '../../Input';
import RadioButton from '../../RadioButton';
import FastImage from 'react-native-fast-image';

const PaymentOptions = ({
  visible = false,
  onClose,
  onPress,
  onItemPress,

  title,

  buttonLabel,
  detail,
  left = false,
  buttonColor = palette?.primary,
  number = 12345678,
  onWallet,
  onChooseWallet,
  onChooseOnline,
  paymentMethod,
  currency,
  onChooseDepositPayment,
  onChooseFullPayment,
  paymentOption,
  is_deposit_payment,
  is_payremaining,
  is_awaiting,
}) => {
  const onClickItem = item => {
    const d = reason?.map(i => {
      if (item == i)
        return {
          ...i,
          flag: true,
        };
      else
        return {
          ...i,
          flag: false,
        };
    });

    setReason(d);

    onItemPress(item);
  };

  const Data = [
    {name: 'Insufficient Players', flag: false, value: 1},
    {name: 'Bad Weather', flag: false, value: 2},
    {name: 'No Venue available to book', flag: false, value: 3},
  ];

  const [reason, setReason] = useState(Data);

  return (
    <Modal
      transparent
      isVisible={visible}
      propagateSwipe={true}
      // swipeDirection="down"
      onSwipeComplete={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <Pressable style={styles.overlay} onPress={() => onClose()} />
      <Box style={styles.modalStyle}>
        <Box style={styles.whiteCard}>
          <TouchableBox
            style={styles.closeIcon}
            onPress={() => onClose()}
            alignSelf="flex-end"
            m="m">
            {Ionicon('close', 20, palette?.black)}
          </TouchableBox>
          <Box style={{top: wp(-8)}}>
            <Text textAlign="center" variant="blackshade24500">
              Total: {currency} {parseFloat(detail?.amount).toFixed(2)}
            </Text>
            {!is_payremaining && detail?.deposite_amount > 0 && (
              <Text textAlign="center" variant="blackshade16400">
                {`(Deposit: ${currency} ${parseFloat(
                  detail?.deposite_amount,
                ).toFixed(2)})`}
              </Text>
            )}
          </Box>
          <Box borderWidth={0.5} style={{borderColor: palette?.tertiary1}} />
          <ScrollView>
            {is_deposit_payment && (
              <Box style={styles.textWrap} pt="l">
                <Text variant={'blackshade16600'} mb={'s'}>
                  Payment options
                </Text>
                <Box flexDirection={'row'} justifyContent="space-evenly" mt="m">
                  <TouchableBox
                    onPress={onChooseFullPayment}
                    style={[
                      TypographyStyles.cardShadow,
                      {borderColor: paymentOption == 1 && palette?.primary},
                    ]}
                    backgroundColor="white"
                    borderRadius={15}
                    height={wp(20)}
                    justifyContent="center"
                    alignItems={'center'}
                    borderWidth={paymentOption == 1 ? 1 : 0}
                    width={wp(28)}>
                    <Text variant={'blackshade16400'}>Full</Text>
                    <Text variant={'blackshade16400'}>Payment</Text>
                  </TouchableBox>
                  <TouchableBox
                    onPress={onChooseDepositPayment}
                    style={[
                      TypographyStyles.cardShadow,
                      {borderColor: paymentOption == 2 && palette?.primary},
                    ]}
                    backgroundColor="white"
                    borderRadius={15}
                    height={wp(20)}
                    justifyContent="center"
                    alignItems={'center'}
                    borderWidth={paymentOption == 2 ? 1 : 0}
                    width={wp(28)}>
                    <Text variant={'blackshade16400'}>Deposit</Text>
                    <Text variant={'blackshade16400'}>Payment</Text>
                  </TouchableBox>
                </Box>
              </Box>
            )}
            <Box style={styles.textWrap} paddingVertical="l">
              <Text variant={'blackshade16600'} mb={'s'}>
                Payment methods
              </Text>
              <Box flexDirection={'row'} justifyContent="space-evenly" mt="m">
                <Box>
                  {currency != 'SGD' && !is_awaiting && (
                    <TouchableBox
                      onPress={onChooseWallet}
                      style={[
                        TypographyStyles.cardShadow,
                        {borderColor: paymentMethod == 1 && palette?.primary},
                      ]}
                      backgroundColor="white"
                      borderRadius={15}
                      height={wp(23)}
                      justifyContent="center"
                      alignItems={'center'}
                      borderWidth={paymentMethod == 1 ? 1 : 0}
                      width={wp(28)}>
                      <FastImage
                        source={Images?.AFAWallet}
                        style={{
                          height: wp(7),
                          width: wp(7),
                          marginBottom: 8,
                          marginLeft: 2,
                        }}
                      />
                      <Text variant={'blackshade16400'}>AFA</Text>
                      <Text variant={'blackshade16400'}>Pay</Text>
                    </TouchableBox>
                  )}
                  <Box width={wp(30)}>
                    <Text
                      // variant={'blackshade110400'}
                      fontSize={9}
                      textAlign="center"
                      fontFamily={fonts?.boldItalic}
                      color="primary"
                      pt="m">
                      Use AFA Pay
                    </Text>
                    <Text
                      // variant={'blackshade110400'}
                      fontSize={9}
                      textAlign="center"
                      fontFamily={fonts?.boldItalic}
                      color="primary"
                      pt="vs">
                      enjoy ZERO platform Fee
                    </Text>
                  </Box>
                </Box>

                <TouchableBox
                  onPress={onChooseOnline}
                  style={[
                    TypographyStyles.cardShadow,
                    {borderColor: paymentMethod == 2 && palette?.primary},
                  ]}
                  backgroundColor="white"
                  borderRadius={15}
                  height={wp(23)}
                  justifyContent="center"
                  alignItems={'center'}
                  borderWidth={paymentMethod == 2 ? 1 : 0}
                  width={wp(28)}>
                  <FastImage
                    source={Images?.primaryDollar}
                    style={{height: wp(7), width: wp(7), marginBottom: 8}}
                  />
                  <Text variant={'blackshade16400'}>Online</Text>
                  <Text variant={'blackshade16400'}>Payment</Text>
                </TouchableBox>
              </Box>
            </Box>
            {currency != 'SGD' && !is_awaiting && (
              <Box style={styles.textWrap} mb="xl" mt="l">
                <Text
                  variant="blackshade16400"
                  // style={styles.midText}

                  textAlign={left ? 'left' : 'center'}>
                  AFA Wallet Balance: RM {detail?.balance}
                </Text>
              </Box>
            )}
            {/* <Box style={styles.textWrap} marginVertical="l">
              {reason?.map(item => {
                return (
                  <Box mb="s">
                    <RadioButton
                      text={item?.name}
                      selected={item?.flag}
                      onPress={() => onClickItem(item)}
                      textStyle={{
                        fontSize: 16,
                        fontWeight: '400',
                        fontFamiliy: fonts?.regular,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                    />
                  </Box>
                );
              })}
            </Box> */}
            {/* <Box style={styles.textWrap} paddingBottom="l">
              <Text
                variant="blackshade12900"
                // style={styles.midText}
                textTransform="uppercase"
                textAlign={left ? 'left' : 'center'}>
                Money refund
              </Text>
            </Box> */}
            {/* <Box style={styles.textWrap}>
              <Text
                variant="blackshade16400"
                // style={styles.midText}

                textAlign={left ? 'left' : 'center'}>
                For the Activity that needs to Pay by Wallet, the money will be
                automatically refunded to the Players.
              </Text>
            </Box> */}
            {/* <Box style={styles?.textWrap} mt="l">
              <Box flexDirection="row">
                <FastImage
                  source={Images?.Info}
                  style={{
                    height: 18,
                    width: 18,
                  }}
                  resizeMode="contain"
                />
                <Text variant="blackshade12400" ml="m">
                  Read more about our Refund Policy
                </Text>
              </Box>
            </Box> */}
          </ScrollView>
          {/* <Box
            height={1}
            width={wp(90)}
            backgroundColor="tertiary2"
            marginVertical="t"
            alignSelf="center"
          /> */}
          {/* <Box style={styles.textWrap} paddingVertical="xxl">
            <Text style={styles.number}>+60 {number}</Text>
          </Box> */}

          <Button
            label={buttonLabel}
            onPress={onPress}
            buttonColor={buttonColor}
          />
          {currency != 'SGD' && !is_awaiting && (
            <TouchableBox onPress={onWallet} mt="s">
              <Box style={styles.textEditWrap}>
                <Text style={styles.Editnumber}>Top-up my Wallet now</Text>
              </Box>
            </TouchableBox>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentOptions;
