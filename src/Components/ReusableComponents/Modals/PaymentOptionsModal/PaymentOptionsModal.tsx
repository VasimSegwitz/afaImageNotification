import React, {useEffect, useState} from 'react';
import {
  TouchableBox,
  Box,
  Text,
  palette,
  size,
  fonts,
  TypographyStyles,
} from '../../../Theme/Index';
import {Image, StyleSheet, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Images} from '../../../../Constant/Image';
import {Button} from '../..';
import {Down, Ionicon} from '../../Icons';

const PaymentOptionsModal = ({route, navigation}) => {
  const {params} = route;
  const {
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
  } = params;
  return (
    <Box flex={1} style={styles.content}>
      <TouchableBox
        flex={0.5}
        justifyContent="center"
        alignItems="center"
        onPress={() => {
          navigation.goBack(null);
        }}
      />
      <Box
        flex={1}
        backgroundColor="white"
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <TouchableBox
          m="l"
          style={styles.closeIcon}
          onPress={() => {
            navigation.goBack(null);
          }}
          alignSelf="flex-end">
          {Ionicon('close', 20, palette?.black)}
        </TouchableBox>
        <Box flex={1}>
          <Box style={styles.modalStyle}>
            <Box style={styles.whiteCard}>
              <Box mb="m">
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
              <Box
                borderWidth={0.5}
                style={{borderColor: palette?.tertiary1}}
              />
              <ScrollView>
                {is_deposit_payment && (
                  <Box style={styles.textWrap} pt="l">
                    <Text variant={'blackshade16600'} mb={'s'}>
                      Payment options
                    </Text>
                    <Box
                      flexDirection={'row'}
                      justifyContent="space-evenly"
                      mt="m">
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
                  <Box
                    flexDirection={'row'}
                    justifyContent="space-evenly"
                    mt="m">
                    <Box>
                      {currency != 'SGD' && !is_awaiting && (
                        <TouchableBox
                          onPress={onChooseWallet}
                          style={[
                            TypographyStyles.cardShadow,
                            {
                              borderColor:
                                paymentMethod == 1 && palette?.primary,
                            },
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
              </ScrollView>

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
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {backgroundColor: 'rgba(0,0,0,.7)'},
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  modalStyle: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    zIndex: 9999,
    overflow: 'hidden',
    padding: 15,
  },
  whiteCard: {
    backgroundColor: palette.white,
    zIndex: 9999,
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  modalHeader: {},
  dateText: {
    fontSize: 18,
    textAlign: 'center',
    color: palette.black,
    fontFamily: fonts.semibold,
    marginBottom: 5,
    marginTop: 10,
  },
  ButtonText: {
    fontSize: 20,
    color: palette.black,
    fontFamily: fonts.bold,
  },
  buttonsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  textWrap: {
    // alignItems: 'center',
    paddingHorizontal: 10,
    // paddingVertical: 20,
  },
  textEditWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  Editnumber: {
    fontSize: 14,
    color: '#737373',
    // paddingTop: 20,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  number: {
    fontSize: 24,
    color: palette.blackshade,
    // paddingTop: 40,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  buttonsWrapBtn: {
    paddingVertical: 50,
    width: '100%',
  },
  noButtonText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    textAlign: 'left',
    marginLeft: 20,
  },

  YesButton: {
    height: 60,
    width: '90%',
    backgroundColor: palette.primary1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    paddingVertical: 20,
  },

  visitText: {
    color: palette.white,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  btnText: {
    color: palette.black,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  blessingImg: {
    fontSize: 20,
    color: palette.blackshade,
    // paddingTop: 40,
    fontWeight: '500',
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  internalText: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midText: {
    fontSize: 16,
    color: palette.blackshade,
    fontWeight: '400',

    fontFamily: fonts.regular,
    // textAlign: 'center',
  },
});

export default PaymentOptionsModal;
