import React, {memo, useMemo, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  BackHandler,
  Linking,
} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {Header, Button} from '../../../ReusableComponents/index';
import {Input} from '../../../ReusableComponents/Input';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AccordianButton from '../../../ReusableComponents/AccordianButton';
import CancelBooking from '../../History/cancelBooking';
import {wp} from '../../../Helpers/responsive-ratio';
import {getAmountFromPercent} from '../../../../utils';
import {currencyCode} from '../../../Helpers/Enums';
import {useQuery} from 'react-query';
import {getBooking} from '../../../Services/Booking';
import {Images} from '../../../../Constant/Image';
const Points = require('../../../../assets/Points/Points.png');
const Time = require('../../../../assets/Home/Time/Time.png');
const Dollar = require('../../../../assets/Home/Dollar/Dollar.png');
const BelowArrow = require('../../../../assets/Booking/SearchResults/BelowArrow/BelowArrow.png');
const CenterPolicy = require('../../../../assets/Booking/SearchResults/CenterPolicy/CenterPolicy.png');
const User = require('../../../../assets/Home/User/User.png');
const Location = require('../../../../assets/Home/Location/Location.png');
const Calender = require('../../../../assets/Home/Calender/Calender.png');
const Google = require('../../../../assets/Google/Google.png');
const Chat = require('../../../../assets/Chat/Chat.png');

const BookingConfirmation = ({navigation, route, value, onChangeText}) => {
  const handleShowUpcoming = () => navigation.navigate('BookingHistory');
  const {vanue, booking} = route?.params;
  const {location} = useSelector(state => state.auth.user);
  const initialState = {
    is_booking_cancelled: false,
    booking_id: booking?.id,
    url: '',
  };
  const [state, setState] = useState(initialState);
  const currency = currencyCode(vanue?.info?.currency)?.name;
  const is_deposit = parseInt(booking?.info?.deposit_amount) > 0;

  const backButtonHandler = () => {
    handleShowUpcoming();
    return true;
  };

  BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

  const loc = useSelector(state => state?.auth?.user?.userlocation);
  const startLat = loc && loc?.location_lat;
  const startLong = loc && loc?.location_long;
  const endLat = location && location?.location_lat;
  const endLong = location && location?.location_long;
  const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLong}&destination=${endLat},${endLong}`;
  const wazeUrl = `https://waze.com/ul?ll=${endLat},${endLong}&navigate=yes&z=10`;

  const is_afa_payment =
    booking?.payment?.is_wallet_full == true ||
    booking?.payment?.is_wallet_deposit == true;
  const handleNavigation = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
    } catch (error) {}
  };

  const handleWazeNavigation = async () => {
    try {
      const supported = await Linking.canOpenURL(wazeUrl);
      if (supported) Linking.openURL(wazeUrl);
    } catch (error) {}
  };

  const [merchantGST, setMerchantgst] = useState('');
  const [merchantFee, setMerchantfee] = useState('');
  const [platformFee, setPlatformfee] = useState('');

  const [remmerchantGST, setRemMerchantgst] = useState('');
  const [remmerchantFee, setRemMerchantfee] = useState('');
  const [remplatformFee, setRemPlatformfee] = useState('');

  useEffect(() => {
    setMerchantfee(
      parseFloat(
        getAmountFromPercent(
          booking?.sports_facility?.sports_complex?.info?.merchant_fees,
          is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
        ),
      ),
    );

    // setMerchantGst(booking?.info?.merchant_gst);
    setMerchantgst(
      parseFloat(
        (booking?.info?.merchant_gst / booking.booking_amount) *
          (booking?.booking_amount - booking?.info?.remaining_amount),
        // getAmountFromPercent(
        //   booking?.sports_facility?.sports_complex?.info?.merchant_gst,
        //   is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
        // ),
      ),
    );

    setPlatformfee(
      parseFloat(
        // getAmountFromPercent(
        is_afa_payment ? 0 : booking?.info?.platform_fee,
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
            : 0,
        ),
      ),
    );
    setRemMerchantgst(
      parseFloat(
        getAmountFromPercent(
          booking?.sports_facility?.sports_complex?.info?.merchant_gst,
          is_deposit
            ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
            : 0,
        ),
      ),
    );
    setRemPlatformfee(
      parseFloat(
        // getAmountFromPercent(
        is_afa_payment ? 0 : is_deposit ? 0 : booking?.info?.platform_fee,
        // is_deposit
        // ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
        // : 0,
        // ),
      ),
    );
  }, [booking]);

  console.log({
    booking: booking?.final_amount,
    merchant_gst:
      (booking?.info?.merchant_gst / booking.booking_amount) *
      (booking?.booking_amount - booking?.info?.remaining_amount),
    booking_amount: booking?.booking_amount,
  });

  const getBookingQuery = useQuery(['getBooking', booking?.id], getBooking, {
    onSuccess(data) {
      if (data?.success == 1) {
        if (data?.data?.info?.remaining_amount != 0)
          setState({...state, url: data?.data?.receipt_deposit});
        if (data?.data?.info?.remaining_amount == 0)
          setState({...state, url: data?.data?.receipt_full});
      }
    },
    onError(err) {},
  });

  useEffect(() => {
    getBookingQuery.refetch();
  }, []);

  return (
    <>
      <Box flex={1} backgroundColor="white">
        {state.is_booking_cancelled && (
          <TouchableBox
            onPress={() => setState({...state, is_booking_cancelled: false})}
            style={[styles.overLay]}
          />
        )}
        <Header title="Booking Confirmed" left onback={handleShowUpcoming} />
        <ScrollView contentContainerStyle={styles.content}>
          <Box flex={1} mt="m">
            <Box
              justifyContent="space-between"
              marginHorizontal="l"
              flexDirection="row">
              <Text variant="blackshade16800">Booking Details</Text>
              <Box flexDirection="row" alignItems={'center'}>
                <Text variant="primary16500">+{booking?.final_amount}</Text>
                <FastImage
                  source={Points}
                  style={[styles.image, {marginBottom: 3}]}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
            </Box>
            <Box
              marginHorizontal="l"
              mt="m"
              backgroundColor="tertiary2"
              height={1}
            />
            <Box flexDirection="row" marginLeft="m" mt="l">
              <Box>
                <FastImage
                  source={Location}
                  style={styles.image}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
              <Box ml="m" flex={1}>
                <Text variant="blackshade14800Semi">#{booking?.id}</Text>
                <Text variant="blackshade14800Semi">{vanue?.name}</Text>
                <Text variant="blackshade14800">
                  Court:{' '}
                  {booking?.courts?.map((item, index) => {
                    if (index === booking?.courts?.length - 1) return item;
                    else return item + ', ';
                  })}
                </Text>
                <Box
                  flex={1}
                  flexDirection="row"
                  justifyContent="space-between">
                  <Box flex={2}>
                    <Text variant="blackshade114500">
                      Add: {vanue?.info?.address}
                    </Text>
                  </Box>
                  <Box
                    mr="l"
                    flex={1}
                    flexDirection="row"
                    justifyContent="flex-end">
                    <TouchableBox onPress={handleWazeNavigation}>
                      <FastImage
                        source={Chat}
                        style={{height: 40, width: 40}}
                        resizeMode={FastImage?.resizeMode?.contain}
                      />
                    </TouchableBox>
                    <TouchableBox onPress={handleNavigation}>
                      <FastImage
                        source={Google}
                        style={{height: 40, width: 40}}
                        resizeMode={FastImage?.resizeMode?.contain}
                      />
                    </TouchableBox>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box flexDirection="row" marginLeft="m" mt="l">
              <Box>
                <FastImage
                  source={Calender}
                  style={styles.image}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
              <Box ml="m" flex={1}>
                <Text variant="blackshade14800Semi">
                  {moment(booking?.date).format('ddd, Do MMM')}
                </Text>
              </Box>
            </Box>
            <Box flexDirection="row" marginLeft="m" mt="s">
              <Box>
                <FastImage
                  source={Time}
                  style={{
                    marginLeft: 10,
                    height: wp(4.2),
                    width: wp(4.2),
                  }}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
              <Box ml="m" flex={1}>
                <Text variant="blackshade14800Semi">
                  {moment(booking?.start, 'hh:mm').format('LT')} -{' '}
                  {moment(booking?.start, 'hh:mm')
                    .add(booking?.no_of_hours, 'hour')
                    .format('LT')}
                </Text>
              </Box>
            </Box>
            <Box paddingHorizontal="l">
              <AccordianButton
                title={() => (
                  <Box flexDirection="row">
                    <FastImage
                      source={Dollar}
                      style={{
                        height: 22,
                        width: 22,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text ml="m" variant="blackshade16800">
                      Payment
                    </Text>
                  </Box>
                )}
                data={() => (
                  <>
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="l">
                      <Text ml="m" variant="blackshade14400">
                        Price
                      </Text>
                      <Text mr="m" variant="blackshade14800">
                        {currency} {booking?.booking_amount?.toFixed(2)}
                      </Text>
                    </Box>
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="s">
                      <Text ml="m" variant="blackshade14400">
                        Platform fee
                      </Text>
                      <Text mr="m" variant="blackshade14800">
                        {currency} {parseFloat(platformFee)?.toFixed(2)}
                      </Text>
                    </Box>
                    {merchantGst !== 0 ? (
                      <Box
                        marginHorizontal="m"
                        justifyContent="space-between"
                        flexDirection="row"
                        mt="s">
                        <Text ml="m" variant="blackshade14400">
                          Merchant GST
                        </Text>
                        <Text mr="m" variant="blackshade14800">
                          {currency} {parseFloat(merchantGst)?.toFixed(2)}
                        </Text>
                      </Box>
                    ) : null}
                    <Box
                      marginLeft="s"
                      marginRight="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="s">
                      <Text ml="m" variant="blackshade14400">
                        {booking?.info?.user_reward_discount !== null
                          ? 'Voucher'
                          : booking?.info?.coupon_discount !== null
                          ? 'Coupon'
                          : ''}{' '}
                        Discount
                      </Text>
                      <Text mr="m" variant="blackshade14800">
                        - {currency}{' '}
                        {booking?.total_discount?.toFixed(2) || '0.00'}
                      </Text>
                    </Box>
                    {booking?.info?.is_insured ? (
                      <Box
                        marginHorizontal="m"
                        justifyContent="space-between"
                        flexDirection="row"
                        mt="s">
                        <Text ml="m" variant="blackshade14400">
                          Insurance Fee
                        </Text>
                        <Text mr="m" variant="blackshade14800">
                          {currency}{' '}
                          {booking?.info?.insurance_price?.toFixed(2) || '0.00'}
                        </Text>
                      </Box>
                    ) : null}
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="s">
                      <Text
                        ml="m"
                        variant="blackshade14400"
                        fontWeight={'bold'}>
                        Total
                      </Text>
                      <Text
                        mr="m"
                        variant="blackshade14800"
                        fontWeight={'bold'}>
                        {currency}{' '}
                        {parseFloat(
                          booking?.final_amount +
                            booking?.info?.insurance_price +
                            merchantFee +
                            merchantGST +
                            platformFee +
                            remmerchantFee +
                            remmerchantGST,
                          //remplatformFee
                        ).toFixed(2)}
                      </Text>
                    </Box>
                    {is_deposit && (
                      <>
                        <Box
                          marginHorizontal="m"
                          justifyContent="space-between"
                          flexDirection="row"
                          mt="s">
                          <Text ml="m" variant="blackshade14400">
                            Deposit
                          </Text>
                          <Text mr="m" variant="blackshade14800">
                            {currency}{' '}
                            {parseFloat(
                              booking?.info?.deposit_amount +
                                booking?.info?.insurance_price +
                                merchantFee +
                                merchantGST +
                                platformFee,
                            ).toFixed(2)}
                          </Text>
                        </Box>
                        <Box
                          marginHorizontal="m"
                          justifyContent="space-between"
                          flexDirection="row"
                          mt="s">
                          <Text ml="m" variant="blackshade14400">
                            Remaining
                          </Text>
                          <Text mr="m" variant="blackshade14800">
                            {currency}{' '}
                            {parseFloat(
                              booking?.total_discount > 0
                                ? booking?.final_amount -
                                    booking?.info?.deposit_amount +
                                    booking?.total_discount
                                : booking?.final_amount -
                                    booking?.info?.deposit_amount,
                            ).toFixed(2)}
                          </Text>
                        </Box>
                      </>
                    )}
                    <TouchableBox
                      onPress={() =>
                        navigation.navigate('DownloadInvoice', {
                          url: state?.url,
                        })
                      }
                      flexDirection="row"
                      marginHorizontal="m"
                      mt="m">
                      <FastImage
                        source={Images?.DownloadInvoice}
                        style={{
                          marginLeft: 10,
                          height: wp(6),
                          width: wp(6),
                        }}
                        resizeMode={FastImage?.resizeMode?.contain}
                      />
                      <Text
                        variant="primary16500"
                        textDecorationLine="underline"
                        ml="m">
                        Show Receipt
                      </Text>
                    </TouchableBox>
                  </>
                )}
                defaultExpand={true}
              />
            </Box>
            <Box paddingHorizontal="l">
              <AccordianButton
                title={() => (
                  <Box flexDirection="row">
                    <FastImage
                      source={CenterPolicy}
                      style={{
                        height: 22,
                        width: 22,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text ml="m" variant="blackshade16800">
                      Centre Policy
                    </Text>
                  </Box>
                )}
                data={() => (
                  <>
                    <Text variant="blackshade12400" marginHorizontal="l" mt="l">
                      • Strictly no refund, no rescheduling, and no carry
                      forward of the non-utilized sessions.
                    </Text>
                    <Text variant="blackshade12400" marginHorizontal="l" mt="l">
                      • Please do not leave your valuables unattended. We will
                      not be responsible for any theft.
                    </Text>
                  </>
                )}
                defaultExpand={true}
              />
            </Box>

            <Box flex={1} justifyContent="flex-end" mb="l">
              {/* <Box height={46} marginHorizontal={'m'} mb="m">
              <Button
                label="Create Activity"
                onPress={() => {
                  navigation.navigate('CreateActivity');
                }}
              />
            </Box> */}
              <Box marginHorizontal={'m'} mt="l">
                <TouchableBox
                  onPress={() =>
                    setState({...state, is_booking_cancelled: true})
                  }
                  backgroundColor="white"
                  height={46}
                  borderWidth={1}
                  borderColor="primary"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius={10}>
                  <Text variant="primary16500Medium">Cancel Booking</Text>
                </TouchableBox>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
      {state.is_booking_cancelled && (
        <Box style={{zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0)'}}>
          <CancelBooking
            state={state}
            setState={setState}
            booking_confirmed
            currency={vanue?.info?.currency}
          />
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  image: {
    marginLeft: 10,
    height: wp(4.5),
    width: wp(4.5),
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
  overLay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay,
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
});

export default BookingConfirmation;
