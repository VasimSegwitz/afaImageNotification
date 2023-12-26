import React, {useState} from 'react';
import {Linking, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Button, Header} from '../../../ReusableComponents';
import {EvilIcon, feather} from '../../../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import styles from './styles';
import {Images} from '../../../../Constant/Image';
import moment from 'moment';
import AccordianButton from '../../../ReusableComponents/AccordianButton';
import CancelBooking from '../cancelBooking';
import {useSelector} from 'react-redux';
import {getAmountFromPercent} from '../../../../utils';

const SingleUpcoming = props => {
  const navigation = useNavigation();

  const {from, data} = props?.route?.params;
  const is_upcoming = from === 'upcoming';
  const is_cancelled = from === 'cancelled';
  const is_completed = from === 'completed';

  const initialState = {is_booking_cancelled: false, booking_id: 0};
  const [state, setState] = useState(initialState);

  const venue = data?.sports_facility?.sports_complex?.name;
  const court = data?.courts;
  const address = data?.sports_facility?.sports_complex?.info?.address;
  const center_policy =
    data?.sports_facility?.sports_complex?.info?.center_policy;
  const date = moment(data?.date).format('ddd, DD MMM');
  const start_time = moment(data?.start, 'HH:mm:ss').format('HH:mm');
  const end_time = moment(data?.end, 'HH:mm:ss').format('HH:mm');
  const booking_amount = data?.booking_amount;
  const final_amount = data?.final_amount;
  const total_discount = data?.total_discount;
  const fullWallet =
    data?.payment?.is_wallet_full == true &&
    data?.payment?.is_afa_full_payment == true;
  const is_afa_payment =
    data?.payment?.is_wallet_full == true ||
    data?.payment?.is_wallet_deposit == true;

  const totalWithOnline =
    data?.payment?.is_afa_full_payment == true &&
    data?.payment?.is_afa_deposit_payment == true &&
    data?.payment?.is_wallet_full == false &&
    data?.payment?.is_wallet_deposit == false;

  const depositwithwallet =
    data?.payment?.is_afa_deposit_payment == true &&
    data?.payment?.is_wallet_deposit == true &&
    data?.payment?.is_afa_full_payment == false &&
    data?.payment?.is_wallet_full == false;

  const deposit = data?.payment?.is_afa_deposit_payment
    ? data?.info?.deposit_amount
    : 0;
  const remaining_amount = data?.payment?.is_afa_deposit_payment
    ? data?.info?.remaining_amount
    : 0;

  const sports_facility_name = data?.sports_facility?.name;
  const endLat = data?.sports_facility?.sports_complex?.location_lat;
  const endLong = data?.sports_facility?.sports_complex?.location_long;
  const currency = data?.sports_facility?.sports_complex?.info?.currency;
  const receiptNo =
    data?.receipt_full_no !== undefined
      ? data?.receipt_full_no
      : data?.receipt_deposit_no;

  const loc = useSelector(state => state?.auth?.user?.userlocation);
  const startLat = loc?.location_lat;
  const startLong = loc?.location_long;
  const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLong}&destination=${endLat},${endLong}`;
  const wazeUrl = `https://waze.com/ul?ll=${endLat},${endLong}&navigate=yes&z=10`;

  const info = data.info;

  const merchant_fees = parseFloat(
    getAmountFromPercent(
      info?.merchant_fees,
      remaining_amount != 0 ? deposit : final_amount,
    ),
  );

  const merchant_gst = parseFloat(
    getAmountFromPercent(
      info?.merchant_gst,
      remaining_amount != 0 ? deposit : final_amount,
    ),
  );

  const platform_fee = parseFloat(
    // getAmountFromPercent(

    remaining_amount == 0 && fullWallet
      ? 0
      : fullWallet && is_afa_payment
      ? 0
      : depositwithwallet
      ? 0
      : info?.platform_fee,
    // remaining_amount != 0 ? deposit : final_amount,
    // ),
  );

  const remmerchant_fees = parseFloat(
    getAmountFromPercent(
      info?.merchant_fees,
      remaining_amount != 0 ? remaining_amount : 0,
    ),
  );
  const remmerchant_gst = parseFloat(
    getAmountFromPercent(
      info?.merchant_gst,
      remaining_amount != 0 ? remaining_amount : 0,
    ),
  );

  const remplatform_fee = parseFloat(
    // getAmountFromPercent(
    remaining_amount == 0 && fullWallet
      ? 0
      : fullWallet && is_afa_payment
      ? 0
      : remaining_amount != 0
      ? 0
      : depositwithwallet
      ? 0
      : info?.platform_fee,
    // remaining_amount != 0 ? remaining_amount : 0,
    // ),
  );

  const totalmerchant_fees = parseFloat(info?.merchant_fees);
  const totalmerchant_gst = parseFloat(
    (info?.merchant_gst / data.booking_amount) *
      (data?.final_amount - info?.remaining_amount),
  );

  console.log({
    final_amount: data?.final_amount,
    gst: info?.merchant_gst / data.booking_amount,
    merchant_gst:
      (info?.merchant_gst / data.booking_amount) *
      (data?.booking_amount - info?.remaining_amount),
    booking_amount: data.booking_amount,
    remaining_amount: remaining_amount,
  });

  const totalplatform_fee = parseFloat(
    // getAmountFromPercent(
    remaining_amount == 0 && fullWallet
      ? 0
      : fullWallet && is_afa_payment
      ? 0
      : totalWithOnline
      ? info?.platform_fee * 2
      : depositwithwallet
      ? 0
      : info?.platform_fee,
    // final_amount),
  );

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

  const invoiceUrl =
    remaining_amount != 0 ? data?.receipt_deposit : data?.receipt_full;

  console.log({
    total:
      final_amount +
      totalmerchant_gst +
      totalmerchant_fees +
      totalplatform_fee +
      data?.info?.insurance_price,
    final_amount,
    totalmerchant_gst,
    totalmerchant_fees,
    totalplatform_fee,
  });

  return (
    <Box flex={1} style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}>
      <Box flex={1} backgroundColor="white">
        {state.is_booking_cancelled && (
          <TouchableBox
            onPress={() => setState({...state, is_booking_cancelled: false})}
            style={[styles.overLay]}
          />
        )}
        <Header title="Booking Details" left />
        <ScrollView
          style={{marginHorizontal: 5}}
          showsVerticalScrollIndicator={false}>
          {is_upcoming && (
            <Box style={styles.parent}>
              <TouchableBox onPress={() => navigation?.navigate('QRscanner')}>
                <Box
                  style={[styles.autolighting, TypographyStyles?.cardShadow]}>
                  <FastImage
                    source={Images.autoLightingWhite}
                    style={[styles.image]}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                </Box>
              </TouchableBox>
              <Box style={{marginLeft: 10}}>
                <Text variant="primary16500">Scan QR to:</Text>
                <Box
                  style={{flexDirection: 'row', top: -5, alignItems: 'center'}}>
                  <FastImage
                    source={Images.light}
                    style={{height: 10, width: 10, top: -1}}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text style={{marginLeft: 4}} variant="blackshade112400">
                    turn on light
                  </Text>
                  <Box style={styles.divider} />
                  {feather('unlock', wp('3'), palette?.blackshade)}
                  <Text style={{marginLeft: 4}} variant="blackshade112400">
                    unlock door
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
          <Box style={styles.bookingDetailHeader}>
            <Text variant="blackshade16500" mb={'s'}>
              Booking Details
            </Text>
            {!is_cancelled && (
              <Box flexDirection="row" alignItems="center">
                <Text variant="primary16500" mr={'s'}>
                  +{final_amount}
                </Text>
                <FastImage
                  source={Images.Points}
                  style={[styles.image, {top: -2}]}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
              </Box>
            )}
          </Box>
          <Box style={styles.horizontalDivider} />
          <Box flexDirection="row" alignItems="center" marginLeft="l">
            <Text
              variant="primary14500"
              style={{marginLeft: wp(7), fontWeight: 'bold'}}>
              {receiptNo !== undefined ? receiptNo?.toUpperCase() : ''}
            </Text>
          </Box>
          {/* {is_cancelled && ( */}
          <Box flexDirection="row" alignItems="center" marginLeft="s">
            <FastImage
              source={Images.ErrorSad}
              style={[styles.image, {marginLeft: 5}]}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text
              variant="primary14500"
              textTransform="capitalize"
              style={{marginLeft: wp(4.5), fontWeight: 'bold'}}>
              Status: {from == 'awaiting' ? 'Awaiting Payment' : from}
            </Text>
          </Box>
          {/* )} */}
          <Box flexDirection="row" alignItems="center" marginLeft="s" mt={'s'}>
            <Box mt={'l'}>
              {EvilIcon('location', wp(7), palette?.blackshade)}
            </Box>
            <Box>
              <Text
                variant={'blackshade14600'}
                style={{marginLeft: wp(4.5), width: wp(75)}}>
                #{data?.id}
              </Text>
              <Text
                variant={'blackshade14600'}
                style={{marginLeft: wp(4.5), width: wp(75)}}>
                {venue}
              </Text>
            </Box>
          </Box>
          <Text
            variant={'blackshade14400'}
            style={{marginLeft: wp(12)}}
            marginVertical={'s'}>
            {court.map((item, index) => {
              if (index === court.length - 1) return item;
              else return item + ', ';
            })}{' '}
            | {sports_facility_name}
          </Text>
          <Box flexDirection="row" justifyContent="space-between">
            <Box flex={2}>
              <Text variant={'placeholder14400'} style={{marginLeft: wp(12)}}>
                {address}
              </Text>
            </Box>
            <TouchableBox onPress={handleWazeNavigation}>
              <FastImage
                source={Images.Chat}
                style={{height: 45, width: 45}}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </TouchableBox>
            <TouchableBox onPress={handleNavigation}>
              <FastImage
                source={Images.Google}
                style={{height: 45, width: 45, marginRight: 10}}
                resizeMode={FastImage?.resizeMode?.contain}
              />
            </TouchableBox>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            marginLeft="s"
            marginVertical="m">
            {EvilIcon('calendar', wp(7), palette?.blackshade)}
            <Text variant={'blackshade14600'} style={{marginLeft: wp(4.5)}}>
              {date}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            marginLeft="s"
            style={{top: -2}}>
            {EvilIcon('clock', wp(7), palette?.blackshade)}
            <Text variant={'blackshade14600'} style={{marginLeft: wp(4.5)}}>
              {moment(start_time, 'HH:mm:ss').format('hh:mm A')} -{' '}
              {moment(end_time, 'HH:mm:ss').format('hh:mm A')}
            </Text>
          </Box>
          <Box marginHorizontal={'m'}>
            <AccordianButton
              title={() => (
                <Box flexDirection="row" alignItems="center">
                  <FastImage
                    source={Images.Dollar}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text variant="blackshade16500" ml="m">
                    Payment
                  </Text>
                </Box>
              )}
              data={() => (
                <Box mt="m">
                  <Box
                    marginHorizontal="m"
                    justifyContent="space-between"
                    flexDirection="row"
                    mt="m">
                    <Text ml="m" variant="blackshade14400">
                      Price
                    </Text>
                    <Text mr="m" variant="blackshade14400">
                      {currency == 1 ? 'RM' : 'SGD'}{' '}
                      {booking_amount?.toFixed(2)}
                    </Text>
                  </Box>
                  {/* <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    mb={'s'}>
                    <Text variant="blackshade16800Regular">Platform fee</Text>
                    <Text variant="blackshade16800Regular">
                      {currency} {parseFloat(totalplatform_fee).toFixed(2)}
                    </Text>
                  </Box> */}
                  <Box
                    marginHorizontal="m"
                    justifyContent="space-between"
                    flexDirection="row">
                    <Text ml="m" variant="blackshade14400">
                      Platform fee
                    </Text>
                    <Text mr="m" variant="blackshade14400">
                      {currency == 1 ? 'RM' : 'SGD'}{' '}
                      {totalplatform_fee?.toFixed(2)}
                    </Text>
                  </Box>
                  {totalmerchant_gst !== 0 ? (
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row">
                      <Text ml="m" variant="blackshade14400">
                        Merchant GST
                      </Text>
                      <Text mr="m" variant="blackshade14400">
                        {currency == 1 ? 'RM' : 'SGD'}{' '}
                        {totalmerchant_gst?.toFixed(2)}
                      </Text>
                    </Box>
                  ) : null}
                  <Box
                    marginHorizontal="m"
                    justifyContent="space-between"
                    flexDirection="row"
                    mb="m">
                    <Text ml="m" variant="blackshade14400">
                      {data?.info?.user_reward_discount !== null
                        ? 'Voucher Discount'
                        : data?.info?.coupon_discount !== null
                        ? 'Coupon Discount'
                        : ''}{' '}
                    </Text>
                    {total_discount !== 0 ? (
                      <Text mr="m" variant="blackshade14400">
                        - {currency == 1 ? 'RM' : 'SGD'}{' '}
                        {total_discount?.toFixed(2)}
                      </Text>
                    ) : null}
                  </Box>
                  {data?.info?.is_insured ? (
                    <Box
                      marginBottom={'m'}
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row">
                      <Text ml="m" variant="blackshade14400">
                        Insurance Fee
                      </Text>
                      <Text mr="m" variant="blackshade14800">
                        {currency == 1 ? 'RM' : 'SGD'}{' '}
                        {data?.info?.insurance_price?.toFixed(2) || '0.00'}
                      </Text>
                    </Box>
                  ) : null}
                  <Box
                    marginHorizontal="m"
                    justifyContent="space-between"
                    flexDirection="row">
                    <Text
                      ml="m"
                      variant={
                        remaining_amount != 0
                          ? 'blackshade14600'
                          : 'blackshade14400'
                      }>
                      {remaining_amount != 0 ? 'TOTAL' : 'Paid price'}
                    </Text>
                    <Text
                      mr="m"
                      variant={
                        remaining_amount != 0
                          ? 'blackshade14600'
                          : 'blackshade14400'
                      }>
                      {currency == 1 ? 'RM' : 'SGD'}{' '}
                      {parseFloat(
                        final_amount +
                          totalmerchant_gst +
                          totalmerchant_fees +
                          totalplatform_fee +
                          data?.info?.insurance_price,
                      ).toFixed(2)}
                    </Text>
                  </Box>
                  {remaining_amount != 0 && (
                    <>
                      <Box
                        marginHorizontal="m"
                        marginVertical="m"
                        justifyContent="space-between"
                        flexDirection="row">
                        <Text ml="m" variant="blackshade14400">
                          Deposit
                        </Text>
                        <Text mr="m" variant="blackshade14400">
                          {currency == 1 ? 'RM' : 'SGD'}{' '}
                          {parseFloat(
                            deposit +
                              merchant_fees +
                              merchant_gst +
                              platform_fee,
                          ).toFixed(2)}
                        </Text>
                      </Box>
                      <Box
                        marginHorizontal="m"
                        justifyContent="space-between"
                        flexDirection="row">
                        <Text ml="m" variant="blackshade14400">
                          Remaining
                        </Text>
                        <Text mr="m" variant="blackshade14400">
                          {currency == 1 ? 'RM' : 'SGD'}{' '}
                          {parseFloat(
                            remaining_amount +
                              remmerchant_fees +
                              remmerchant_gst +
                              remplatform_fee,
                          )?.toFixed(2)}
                        </Text>
                      </Box>
                    </>
                  )}
                  {(is_upcoming || is_completed) && (
                    <TouchableBox
                      onPress={() =>
                        navigation.navigate('DownloadInvoice', {
                          url: invoiceUrl,
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
                  )}
                </Box>
              )}
              defaultExpand={true}
            />
          </Box>
          {/* {is_cancelled && (
            <Box marginHorizontal={'m'}>
              <AccordianButton
                title={() => (
                  <Box flexDirection="row">
                    <FastImage
                      source={Images.Refund}
                      style={styles.image}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                    <Text variant="blackshade16500" ml="m">
                      Refund
                    </Text>
                  </Box>
                )}
                data={() => (
                  <Box mt="m">
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="s">
                      <Text ml="m" variant="blackshade14400">
                        Refund amount
                      </Text>
                      <Text mr="m" variant="blackshade14400">
                        {currency == 1 ? 'RM' : 'SGD'}{' '}
                        {remaining_amount != 0
                          ? (deposit - cancellation_charge).toFixed(2)
                          : (final_amount - cancellation_charge).toFixed(2)}
                      </Text>
                    </Box>
                    <Box
                      marginHorizontal="m"
                      justifyContent="space-between"
                      flexDirection="row"
                      mt="s">
                      <Text ml="m" variant="blackshade14400">
                        Refund to
                      </Text>
                      <Text mr="m" variant="blackshade14400">
                        AFA Wallet
                      </Text>
                    </Box>
                  </Box>
                )}
                defaultExpand={true}
              />
            </Box>
          )} */}
          <Box marginHorizontal={'m'}>
            <AccordianButton
              title={() => (
                <Box flexDirection="row" alignItems="center">
                  <FastImage
                    source={Images.CenterPolicy}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text variant="blackshade16500" ml="m">
                    Center Policy
                  </Text>
                </Box>
              )}
              data={() => (
                <Box mt="m">
                  <Text ml="m" variant="blackshade14400">
                    {center_policy}
                  </Text>
                </Box>
              )}
              defaultExpand={false}
            />
          </Box>
        </ScrollView>
      </Box>
      {!state.is_booking_cancelled ? (
        <Box width={wp(100)} backgroundColor={'white'}>
          {is_upcoming ? (
            <>
              {/* <Box height={46} marginHorizontal={"m"} mb="m">
                                <Button label="Create Activity" onPress={() => {
                                    navigation.navigate("CreateActivity")
                                }} />
                            </Box> */}
              <Box marginVertical="s" marginHorizontal={'m'} mb="xl">
                <TouchableBox
                  onPress={() =>
                    setState({
                      ...state,
                      is_booking_cancelled: true,
                      booking_id: data?.id,
                    })
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
            </>
          ) : (
            // <Box height={46} marginHorizontal={"m"} mb="m">
            //     <Button label="Go to Activity Page" onPress={() => {
            //         // navigation.navigate("CreateActivity")
            //     }} />
            // </Box>
            <></>
          )}
        </Box>
      ) : (
        <Box>
          <CancelBooking
            state={state}
            setState={setState}
            currency={currency}
          />
        </Box>
      )}
    </Box>
  );
};

export default SingleUpcoming;
