import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import theme, {
  Box,
  fonts,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {
  Header,
  Button,
  LoadingOverlay,
} from '../../../ReusableComponents/index';
import {Input} from '../../../ReusableComponents/Input';
import moment from 'moment';
import {wp} from '../../../Helpers/responsive-ratio';
import {LockSlot} from '../../../Services/Booking';
import {useMutation} from 'react-query';
import {
  displayErrorToast,
  displaySuccessToast,
  getAmountFromPercent,
} from '../../../../utils';
import {currencyCode} from '../../../Helpers/Enums';
import {useSelector} from 'react-redux';
import {Images} from '../../../../Constant/Image';
import FastImage from 'react-native-fast-image';

const BookingSummary = ({navigation, route, value, onChangeText}) => {
  const {apiBody, mode, vanue, is_deposit, is_insured, depositAmount} =
    route?.params;

  const is_afa_pay = mode == 'afa_pay';
  const is_online_payment = mode == 'online_payment';
  const [counter, setCounter] = useState(300);
  const currency = currencyCode(vanue?.info?.currency)?.name;
  const [booking, setBooking] = useState(route?.params?.booking);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const {url} = useSelector(state => state?.book?.booking);
  const [voucher, setVoucher] = useState('');

  useEffect(() => {
    if (is_insured !== undefined) {
      const body = {
        ...apiBody,
        is_insured: is_insured !== undefined ? is_insured : false,
        is_deposit: is_deposit !== undefined ? is_deposit : false,
      };
      getSlotLockk?.mutate(body);
    }
  }, [is_insured]);

  /**
   * @function useEffect
   * @description it will set the timeout first time when the screen focus
   */

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const boBack = () => {
    navigation.goBack(null);
  };

  const handleConfirmBooking = () => {
    //     return
    //setVoucher('');
    if (is_afa_pay) {
      navigation.navigate('PinVerification', {
        boBack: boBack,
        is_insured: is_insured,
        apiBody:
          coupon != ''
            ? {
                ...apiBody,
                coupon_code: coupon,
              }
            : voucher != ''
            ? {
                ...apiBody,
                user_reward_code: voucher,
              }
            : apiBody,
        vanue: vanue,
        is_deposit: is_deposit,
      });
    }
    if (is_online_payment) {
      navigation?.navigate('PaymentLoading', {
        boBack: boBack,
        is_insured: is_insured,
        apiBody:
          coupon != ''
            ? {
                ...apiBody,

                coupon_code: coupon,
              }
            : voucher != ''
            ? {
                ...apiBody,
                user_reward_code: voucher,
              }
            : apiBody,
        vanue: vanue,
        is_deposit: is_deposit,
        url: url != null ? url : null,
      });
    }
  };

  /**
   * @function getSlotLock
   * @description this function will call the LockSlot api
   */

  const getSlotLockk = useMutation('LockSlot', LockSlot, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        if (data?.data?.data) {
          const key = Object.keys(data?.data?.data)[0];
          displayErrorToast(data?.data?.data[key]);
        } else {
          displayErrorToast(data?.data?.message);
        }
      } else {
        setBooking({...data?.data, insurance_price: data.insurance_price});
        // setModalVisible(true);
        setVoucher('');
      }
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  /**
   * @function getSlotLock
   * @description this function will call the LockSlot api
   */

  const getSlotLock = useMutation('LockSlot', LockSlot, {
    onSuccess: data => {
      console.log(data);
      setLoading(false);
      if (data?.data?.success == 0) {
        if (data?.data !== undefined && data?.data.EMOJI == 1) {
          displayErrorToast(data?.data?.message);
          setTimeout(() => {
            setVoucher('');
          }, 300);
        } else if (data?.data !== undefined && data?.data.EMOJI) {
          const key = Object.keys(data?.data?.data)[0];
          displayErrorToast(data?.data?.data[key]);
        } else {
          if (data?.data !== undefined && data?.data.data) {
            displayErrorToast(data?.data?.message);
            if (
              data?.data?.message ===
              'User reward cannot be applied on this complex'
            ) {
              setVoucher('');
            }
          }
        }

        if (data?.data?.message !== undefined) {
          displayErrorToast(data?.data?.message);
        }
      } else {
        if (coupon !== '') {
          displaySuccessToast('Coupon Applied');
        } else if (voucher !== '') {
          displaySuccessToast('Voucher Applied');
        } else if (data.message !== undefined) {
          displayErrorToast(data?.message);
        }

        setBooking({
          ...data?.data,

          summary_merchant_fees: data?.data?.summary_merchant_fees,
          summary_merchant_gst: data?.data?.summary_merchant_gst,
          summary_final_amount: data?.data?.summary_final_amount,
          insurance_price: data.insurance_price,
        });
        // setModalVisible(true);
      }
    },
    onError: error => {
      setLoading(false);
      setVoucher('');
    },
  });

  const [merchantGST, setMerchantgst] = useState('');
  const [merchantFee, setMerchantfee] = useState('');
  const [platformFee, setPlatformfee] = useState('');

  const [remmerchantGST, setRemMerchantgst] = useState('');
  const [remmerchantFee, setRemMerchantfee] = useState('');
  const [remplatformFee, setRemPlatformfee] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setMerchantfee(
      parseFloat(
        booking?.summary_merchant_fees,
        // getAmountFromPercent(
        //   booking?.sports_facility?.sports_complex?.info?.merchant_fees,
        //   is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
        // ),
      ),
    );

    setMerchantgst(
      parseFloat(
        // getAmountFromPercent(
        booking?.summary_merchant_gst,
        //   is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
        // ),
      ),
    );
    setPlatformfee(
      parseFloat(
        // getAmountFromPercent(
        is_afa_pay ? 0 : booking?.info?.platform_fee,
        // is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
        // ),
      ),
    );

    setRemMerchantfee(
      parseFloat(
        getAmountFromPercent(
          booking?.sports_facility?.sports_complex?.info?.merchant_fees,
          is_deposit
            ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
            : booking?.final_amount,
        ),
      ),
    );
    setRemMerchantgst(
      parseFloat(
        getAmountFromPercent(
          booking?.sports_facility?.sports_complex?.info?.merchant_gst,
          is_deposit
            ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
            : booking?.final_amount,
        ),
      ),
    );
    setRemPlatformfee(
      parseFloat(
        // getAmountFromPercent(
        is_afa_pay ? 0 : is_deposit ? 0 : booking?.info?.platform_fee,
        // is_deposit
        // ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
        // : booking?.final_amount,
        // ),
      ),
    );
  }, [booking]);

  useEffect(() => {
    let totalTemp = 0;
    if (is_deposit) {
      let deposit = 0;
      if (booking?.info?.coupon_discount !== undefined) {
        if (
          booking?.info?.coupon_discount >=
          booking?.info?.deposit_amount + platformFee
        ) {
          deposit = parseFloat(-platformFee);
        } else {
          deposit = parseFloat(
            booking?.info?.deposit_amount - booking?.info?.coupon_discount,
          );
        }
      } else if (booking?.info?.user_reward_discount !== undefined) {
        if (
          booking?.info?.user_reward_discount >
          booking?.info?.deposit_amount + platformFee
        ) {
          deposit = parseFloat(-platformFee);
        } else {
          deposit = parseFloat(
            booking?.info?.deposit_amount - booking?.info?.user_reward_discount,
          );
        }
      } else {
        deposit = parseFloat(booking?.info?.deposit_amount);
      }
      if (booking?.info?.insurance_price !== undefined) {
        totalTemp = parseFloat(
          deposit +
            merchantFee +
            merchantGST +
            platformFee +
            booking.info.insurance_price,
        ).toFixed(2);
      } else {
        totalTemp = parseFloat(
          deposit + merchantFee + merchantGST + platformFee,
        ).toFixed(2);
      }
    } else {
      if (booking?.info?.insurance_price !== undefined) {
        totalTemp = parseFloat(
          booking?.final_amount +
            merchantFee +
            merchantGST +
            platformFee +
            booking.info.insurance_price,
        ).toFixed(2);
      } else {
        totalTemp = parseFloat(
          booking?.final_amount + merchantFee + merchantGST + platformFee,
        ).toFixed(2);
      }
    }

    setTotal(booking?.summary_final_amount);
  }, [is_deposit, booking]);

  const OnApplyCoupon = () => {
    if (coupon.trim() == '') {
      displayErrorToast('Please enter coupon code');
      return;
    } else {
      setLoading(true);
      const body = {
        ...apiBody,
        is_insured: is_insured !== undefined ? is_insured : false,
        coupon_code: coupon,
      };

      getSlotLock?.mutate(body);
    }
  };

  const OnRemoveCoupon = () => {
    setLoading(true);
    const body = {
      ...apiBody,
      is_insured: is_insured !== undefined ? is_insured : false,
      is_deposit: is_deposit !== undefined ? is_deposit : false,
    };
    getSlotLock?.mutate(body);
  };

  const applied = code => {
    setVoucher(code);
    OnApplyVoucher(code);
  };

  const OnApplyVoucher = value => {
    if (value.trim() == '') {
      displayErrorToast('Please apply voucher code');
      return;
    } else {
      const body = {
        ...apiBody,
        is_insured: is_insured !== undefined ? is_insured : false,
        is_deposit: is_deposit !== undefined ? is_deposit : false,
        user_reward_code: value,
      };

      getSlotLock?.mutate(body);
    }
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header navigation={navigation} title="Book Summary" left />
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1}>
          <Box
            mt="m"
            marginHorizontal="l"
            style={TypographyStyles.cardShadow}
            backgroundColor="white"
            borderRadius={20}
            flex={1}>
            <Box alignItems="center" mt="l">
              <Text variant="primary36500">
                {counter > 60
                  ? parseInt(counter / 60) + ':' + (counter % 60)
                  : '0 :' + ' ' + counter}
              </Text>
              <Box width={size.width / 2}>
                <Text variant="blackshade14800" textAlign="center">
                  Complete your booking before the timer runs out
                </Text>
              </Box>
            </Box>
            <Box
              mt="m"
              marginHorizontal="l"
              borderWidth={1}
              borderColor="tertiary2"
              borderStyle="dotted"
            />
            <Box marginHorizontal="l" mt="l">
              <Box
                flexDirection="row"
                justifyContent="space-between"
                width={wp(80)}>
                {/* <Text variant="blackshade16800Regular">Venue</Text> */}
                <Text variant="blackshade16800Regular">{vanue?.name}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mt="m">
                <Text variant="blackshade16800Regular">Date</Text>
                <Text variant="blackshade16800Regular">
                  {moment(booking?.date).format('DD MMM YYYY')}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mt="m">
                <Text variant="blackshade16800Regular">Start time</Text>
                <Text variant="blackshade16800Regular">
                  {moment(booking?.start, 'HH:mm').format('LT')}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mt="m">
                <Text variant="blackshade16800Regular">End time</Text>
                <Text variant="blackshade16800Regular">
                  {moment(booking?.end, 'HH;mm').format('LT')}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mt="m">
                <Text variant="blackshade16800Regular">Court</Text>
                <Box>
                  {booking?.courts?.map(item => (
                    <Text variant="blackshade16800Regular">{item}</Text>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              mt="m"
              marginHorizontal="l"
              height={2}
              backgroundColor="tertiary2"
            />
            <Box marginHorizontal="l" mt="m">
              <Box flexDirection="row" justifyContent="space-between" mb={'s'}>
                <Text variant="blackshade16800Regular" fontWeight={'bold'}>
                  Price
                </Text>
                <Text variant="blackshade16800Regular" fontWeight={'bold'}>
                  {currency} {parseFloat(booking?.booking_amount).toFixed(2)}
                </Text>
              </Box>
              {is_deposit && (
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mb={'s'}>
                  <Text variant="blackshade16800Regular">Deposit</Text>
                  <Text variant="blackshade16800Regular">
                    {currency}{' '}
                    {parseFloat(
                      route?.params?.booking?.info?.deposit_amount,
                    ).toFixed(2)}
                  </Text>
                </Box>
              )}
              {booking?.info?.coupon_discount && (
                <>
                  {is_deposit ? (
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      mb={'s'}>
                      <Text variant="blackshade16800Regular">
                        Coupon Discount
                      </Text>
                      <Text variant="blackshade16800Regular" color="primary">
                        - {currency}{' '}
                        {booking?.info?.coupon_discount >=
                        route?.params?.booking?.info?.deposit_amount +
                          platformFee
                          ? parseFloat(
                              route?.params?.booking?.info?.deposit_amount +
                                platformFee,
                            ).toFixed(2)
                          : parseFloat(booking?.info?.coupon_discount).toFixed(
                              2,
                            )}
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      mb={'s'}>
                      <Text variant="blackshade16800Regular">
                        Coupon Discount
                      </Text>
                      <Text variant="blackshade16800Regular" color="primary">
                        - {currency}{' '}
                        {parseFloat(booking?.info?.coupon_discount).toFixed(2)}
                      </Text>
                    </Box>
                  )}
                </>
              )}
              <Box flexDirection="row" justifyContent="space-between" mb={'s'}>
                <Text variant="blackshade16800Regular">Platform fee</Text>
                <Text variant="blackshade16800Regular">
                  {currency} {parseFloat(platformFee).toFixed(2)}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mb={'s'}>
                <Text variant="blackshade16800Regular">Merchant fee</Text>
                <Text variant="blackshade16800Regular">
                  {currency} {parseFloat(merchantFee).toFixed(2)}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between" mb={'s'}>
                <Text variant="blackshade16800Regular">Merchant GST</Text>
                <Text variant="blackshade16800Regular">
                  {currency} {parseFloat(merchantGST).toFixed(2)}
                </Text>
              </Box>
              {is_insured ? (
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mb={'s'}>
                  <Text variant="blackshade16800Regular">Insurance Fee</Text>
                  <Text variant="blackshade16800Regular">
                    {currency}{' '}
                    {parseFloat(booking?.info?.insurance_price).toFixed(2)}
                  </Text>
                </Box>
              ) : null}
              <Box flexDirection="row" justifyContent="space-between">
                <Text variant="blackshade16800Regular">Payment method</Text>
                <Text variant="blackshade16800Regular">
                  {is_afa_pay ? 'AFA Pay' : 'Online Payment'}
                </Text>
              </Box>
            </Box>
            {voucher === '' ? (
              <Box marginHorizontal="l" mt="l">
                <Text variant="blackshade16800Semi">Apply Coupon</Text>
                <Box flexDirection="row" justifyContent="space-between">
                  <Input
                    inputStyle={{width: size.width / 2, marginTop: 10}}
                    place="Coupon..."
                    value={coupon}
                    error={''}
                    onChange={e => setCoupon(e)}
                  />
                  {booking?.info?.coupon_discount === undefined ? (
                    <TouchableBox
                      mt="l"
                      borderRadius={10}
                      borderColor="blackshade"
                      height={28}
                      borderWidth={1}
                      alignItems="center"
                      justifyContent="center"
                      onPress={() => OnApplyCoupon()}>
                      <Text paddingHorizontal="m" variant="blackshade12400">
                        Apply
                      </Text>
                    </TouchableBox>
                  ) : (
                    <TouchableBox
                      flexDirection="row"
                      mt="l"
                      borderRadius={10}
                      backgroundColor="blackshade"
                      height={28}
                      borderWidth={1}
                      alignItems="center"
                      justifyContent="center"
                      onPress={() => {
                        setCoupon('');
                        setTimeout(() => {
                          OnRemoveCoupon();
                        }, 200);
                      }}>
                      <FastImage
                        style={{height: 15, width: 15, marginLeft: 5}}
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.CircleCheckmark}
                      />
                      <Text
                        ml="s"
                        paddingHorizontal="m"
                        variant="white12Medium">
                        Remove
                      </Text>
                    </TouchableBox>
                  )}
                </Box>
              </Box>
            ) : null}
            {coupon === '' ? (
              <Box>
                {voucher === '' ? (
                  <Box
                    marginHorizontal="l"
                    marginVertical="m"
                    flex={1}
                    justifyContent="space-between"
                    flexDirection="row">
                    <Text variant="blackshade16800Semi">Apply Voucher</Text>
                    <TouchableBox
                      onPress={() => {
                        navigation.navigate('VouchersListModal', {
                          applied: applied,
                        });
                      }}>
                      <Text variant="primary16500">Apply</Text>
                    </TouchableBox>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      marginHorizontal="l"
                      mt="s"
                      alignItems="center">
                      <Text variant="lightGreen14600">Voucher Applied</Text>
                      <TouchableBox
                        onPress={() => {
                          setVoucher('');
                          setTimeout(() => {
                            OnRemoveCoupon();
                          }, 200);
                        }}>
                        <FastImage
                          style={{height: 30, width: 30}}
                          source={Images?.Cross}
                        />
                      </TouchableBox>
                    </Box>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      marginHorizontal="l"
                      mt="s"
                      alignItems="center">
                      <Box flexDirection="row" alignItems="center">
                        <FastImage
                          style={{height: 20, width: 20}}
                          source={Images?.CouponPercent}
                        />
                        <Text ml="s" variant="blackshade16500">
                          {voucher}
                        </Text>
                      </Box>
                      {is_deposit ? (
                        <Box>
                          <Text variant="lightGreen16500">
                            -RM
                            {booking?.info?.user_reward_discount >=
                            route?.params?.booking?.info?.deposit_amount +
                              platformFee
                              ? parseFloat(
                                  route?.params?.booking?.info?.deposit_amount +
                                    platformFee,
                                ).toFixed(2)
                              : parseFloat(
                                  booking?.info?.user_reward_discount,
                                ).toFixed(2)}
                          </Text>
                        </Box>
                      ) : (
                        <Box>
                          <Text variant="lightGreen16500">
                            -RM
                            {parseFloat(
                              booking?.info?.user_reward_discount,
                            ).toFixed(2)}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : null}
            {/* <TouchableBox marginHorizontal="l" marginVertical="s">
              <Text
                textDecorationLine="underline"
                variant="blackshade16800Regular">
                Select your coupon from list
              </Text>
            </TouchableBox> */}
            <Box flex={1} justifyContent="flex-end" mb="l" marginHorizontal="l">
              <Box justifyContent="space-between" flexDirection="row" mb={'s'}>
                <Text variant="blackshade16800Semi">TOTAL </Text>
                <Text variant="blackshade16800Semi">
                  {currency} {total}
                </Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text variant="blackshade16800Regular">Remaining</Text>
                <Text variant="blackshade16800Regular">
                  {currency}{' '}
                  {is_deposit
                    ? parseFloat(
                        booking?.total_discount > 0
                          ? booking?.final_amount -
                              booking?.info?.deposit_amount +
                              booking?.total_discount
                          : booking?.final_amount -
                              booking?.info?.deposit_amount,
                      ).toFixed(2)
                    : parseFloat(booking?.info?.remaining_amount).toFixed(2)}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box flex={1} justifyContent="flex-end" mb="l">
            <Box height={46} marginHorizontal="l" mt="l">
              <Button label="Confirm Booking" onPress={handleConfirmBooking} />
            </Box>
            <Box marginHorizontal="l" mt="m">
              <Text textAlign="center" variant="blackshade12500">
                By continuing, I agree with the Terms & Conditions, and Refund
                Policies
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>

      {loading ? <LoadingOverlay /> : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  image: {
    marginLeft: 10,
    height: 22,
    width: 22,
  },
  text: {
    flex: 1,
    marginTop: 5,
    paddingRight: 40,
    height: 40,
    alignSelf: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});

export default BookingSummary;
