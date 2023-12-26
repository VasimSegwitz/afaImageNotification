import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {
  Back,
  BackSpace,
  feather,
  Ionicon,
} from '../../ReusableComponents/Icons';
import {wp} from '../../Helpers/responsive-ratio';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Images} from '../../../Constant/Image';
import {Button} from '../../ReusableComponents';
import {useQuery} from 'react-query';
import {getBooking} from '../../Services/ProfileApi';
import moment from 'moment';
import {getAmountFromPercent} from '../../../utils';
import {Shimmer} from '../../ReusableComponents/index';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const BookedHistoryCard = props => {
  const {
    state,
    setState,
    from,
    profile,
    data,
    setModalVisible,
    setBookingData,
    setrePay,
  } = props;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const initialBookingState = {transaction_data: [], new_transaction_data: []};
  const [booking, setBooking] = useState(initialBookingState);
  const [pagecount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const is_upcoming = from === 'upcoming';
  const is_completed = from === 'completed';
  const is_cancelled = from === 'cancelled';
  const is_awaiting = from == 'awaiting';
  const filter_key = is_upcoming ? 2 : is_completed ? 3 : is_cancelled ? 4 : 1;

  const bookingReqBody = {status: filter_key, per_page: 5, page: pagecount};
  const getBookingQuery = useQuery(['getBooking', bookingReqBody], getBooking, {
    onSuccess: result => {
      setLoading(false);
      setBooking({
        ...booking,
        transaction_data: booking.transaction_data.concat(result?.data),
        new_transaction_data: result?.data || [],
      });
    },
    onError: error => {
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    setPageCount(1);
    setBooking({...booking, transaction_data: [], new_transaction_data: []});
    getBookingQuery.refetch();
  }, [isFocused]);

  useEffect(() => {
    if (is_upcoming) {
      const upcoming = booking?.transaction_data
        .sort((a, b) => moment(a.date).diff(b.date))
        .filter(data => data.date >= moment().format('YYYY-MM-DD'));
      setBooking({...booking, transaction_data: upcoming});
      state && setState({...state, total_booking: upcoming.length});
    } else {
      state &&
        setState({...state, total_booking: booking.transaction_data.length});
    }
  }, [booking.transaction_data.length]);

  const handleOnEndReached = () =>
    booking.new_transaction_data.length >= 5 && setPageCount(pagecount + 1);
  const handleCancelBooking = id =>
    setState({...state, is_booking_cancelled: true, booking_id: id});
  const handleBookedUpcoming = data =>
    navigation.navigate('SingleUpcoming', {
      from: profile ? 'upcoming' : from,
      data: data,
    });

  // const [merchantGST, setMerchantgst] = useState('');
  // const [merchantFee, setMerchantfee] = useState('');
  // const [platformFee, setPlatformfee] = useState('');

  // const [remmerchantGST, setRemMerchantgst] = useState('');
  // const [remmerchantFee, setRemMerchantfee] = useState('');
  // const [remplatformFee, setRemPlatformfee] = useState('');

  // useEffect(() => {
  //   setMerchantfee(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.merchant_fees,
  //         is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
  //       ),
  //     ),
  //   );
  //   setMerchantgst(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.merchant_gst,
  //         is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
  //       ),
  //     ),
  //   );
  //   setPlatformfee(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.platform_fee,
  //         is_deposit ? booking?.info?.deposit_amount : booking?.final_amount,
  //       ),
  //     ),
  //   );

  //   setRemMerchantfee(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.merchant_fees,
  //         is_deposit
  //           ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
  //           : 0,
  //       ),
  //     ),
  //   );
  //   setRemMerchantgst(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.merchant_gst,
  //         is_deposit
  //           ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
  //           : 0,
  //       ),
  //     ),
  //   );
  //   setRemPlatformfee(
  //     parseFloat(
  //       getAmountFromPercent(
  //         booking?.sports_facility?.sports_complex?.info?.platform_fee,
  //         is_deposit
  //           ? parseFloat(booking?.final_amount - booking?.info?.deposit_amount)
  //           : 0,
  //       ),
  //     ),
  //   );

  // }, [booking]);

  const renderItem = items => {
    const amount = items.item?.final_amount;
    const insured = items?.item?.info?.insurance_price;
    const court = items?.item?.courts;
    const venue = items?.item.sports_facility?.sports_complex?.name;
    const address = items?.item.sports_facility?.sports_complex?.info?.address;
    const info = items?.item?.info;
    const time = items?.item?.start;
    const end = items?.item?.end;
    const date = items?.item?.date;
    const sports_facility_name = items?.item?.sports_facility?.name;

    const currency =
      items?.item.sports_facility?.sports_complex?.info?.currency;
    const deposit = items?.item?.payment?.is_afa_deposit_payment
      ? items?.item?.info?.deposit_amount
      : 0;
    const remaining_amount = items?.item?.payment?.is_afa_deposit_payment
      ? items?.item?.info?.remaining_amount
      : 0;

    const fullWallet =
      items?.item?.payment?.is_wallet_full == true &&
      items?.item?.payment?.is_afa_full_payment == true;

    const is_afa_payment =
      items?.item?.payment?.is_wallet_full == true ||
      items?.item?.payment?.is_wallet_deposit == true;

    const totalWithOnline =
      items?.item?.payment?.is_afa_full_payment == true &&
      items?.item?.payment?.is_afa_deposit_payment == true &&
      items?.item?.payment?.is_wallet_full == false &&
      items?.item?.payment?.is_wallet_deposit == false;

    const depositwithwallet =
      items?.item?.payment?.is_afa_deposit_payment == true &&
      items?.item?.payment?.is_wallet_deposit == true &&
      items?.item?.payment?.is_afa_full_payment == false &&
      items?.item?.payment?.is_wallet_full == false;

    const merchant_fees = parseFloat(
      getAmountFromPercent(
        info?.merchant_fees,
        remaining_amount != 0 ? deposit : amount,
      ),
    );

    const merchant_gst = parseFloat(
      getAmountFromPercent(
        info?.merchant_gst,
        remaining_amount != 0 ? deposit : amount,
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
      // remaining_amount != 0 ? deposit : amount,
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

    const totalmerchant_fees = parseFloat(
      (info?.merchant_fees / items.item.booking_amount) *
        (amount - info?.remaining_amount),
    );

    const totalmerchant_gst = parseFloat(
      (info?.merchant_gst / items.item.booking_amount) *
        (amount - info?.remaining_amount),
    );
    console.log(`-------${items.item?.id}--------`);
    console.log({
      final_amount: items.item?.final_amount,
      merchant_gst:
        (info?.merchant_gst / items.item?.booking_amount) *
        (items?.item?.booking_amount - info?.remaining_amount),
      gst: info?.merchant_gst / items.item?.booking_amount,
      remaining_amount: info?.remaining_amount,
      booking_amount: items.item.booking_amount,
      amount,
      totalmerchant_fees,
      totalmerchant_gst,
      insured,
    });
    console.log(`---------------`);
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
      // amount),
    );

    const cancellation_charge =
      parseFloat(items?.item?.info?.cancellation_charge) || 0;

    return (
      <TouchableBox
        style={[styles.parentBookedUpcoming, TypographyStyles.cardShadow]}
        onPress={() => handleBookedUpcoming(items?.item)}>
        <Box style={styles.childBookedUpcoming}>
          <Box style={styles.dateSection}>
            <Text variant="blackshade14400">{moment(date).format('MMM')}</Text>
            <Text variant="blackshade14600">{moment(date).format('DD')}</Text>
            <Text variant="blackshade14400">{moment(date).format('ddd')}</Text>
          </Box>
          <Box style={styles.divider} />
          <Box style={styles.addressSection}>
            <Text variant="blackshade16500">#{items.item?.id}</Text>
            <Text variant="blackshade16500">{venue}</Text>
            <Text variant="blackshade14400">{address}</Text>
            <Box flex={1} alignItems={'flex-start'}>
              <Box>
                <Box style={styles.flexrow}>
                  {feather('clock', wp('4'), palette?.warmGrey)}
                  <Text style={{marginLeft: 5}} variant="blackshade14400">
                    {moment(time, 'HH:mm:ss').format('hh:mm A')}
                  </Text>
                </Box>
                <Box style={{flexDirection: 'row'}}>
                  <Box style={{marginTop: 2}}>
                    {feather('grid', wp('4'), palette?.warmGrey)}
                  </Box>
                  <Text
                    style={{marginLeft: 5, width: wp(65)}}
                    variant="blackshade14400">
                    {court.map((item, index) => {
                      if (index === court.length - 1) return item;
                      else return item + ', ';
                    })}{' '}
                    | {sports_facility_name}
                  </Text>
                </Box>
              </Box>
            </Box>
            {remaining_amount != 0 && !is_cancelled ? (
              <>
                <Box style={styles.flexrow}>
                  <FastImage
                    source={Images.Dollar}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text style={{marginLeft: 5}} variant="blackshade14400">
                    {' Deposit : '}
                    {currency == 1 ? 'RM ' : 'SGD '}
                    {parseFloat(
                      deposit + merchant_fees + merchant_gst + platform_fee,
                    ).toFixed(2)}
                  </Text>
                </Box>
                <Box style={styles.flexrow}>
                  <FastImage
                    source={Images.remainingAmount}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text style={{marginLeft: 5}} variant="blackshade14400">
                    {'Remaining : '}
                    {currency == 1 ? 'RM ' : 'SGD '}
                    {parseFloat(
                      remaining_amount +
                        remmerchant_fees +
                        remmerchant_gst +
                        remplatform_fee,
                    )?.toFixed(2)}
                  </Text>
                </Box>
              </>
            ) : (
              !is_cancelled && (
                <Box style={styles.flexrow}>
                  <FastImage
                    source={Images.Dollar}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text style={{marginLeft: 5}} variant="blackshade14400">
                    {currency == 1 ? 'RM' : 'SGD'}{' '}
                    {amount +
                      totalmerchant_fees +
                      totalmerchant_gst +
                      insured +
                      totalplatform_fee}{' '}
                    {!is_awaiting ? 'paid' : ''}
                  </Text>
                </Box>
              )
            )}
          </Box>
        </Box>
        {is_upcoming && (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            marginVertical={'m'}
            marginHorizontal={'m'}
            mb={'m'}>
            {remaining_amount != 0 ? (
              <TouchableBox
                onPress={() => {
                  setrePay(
                    parseFloat(
                      remaining_amount +
                        remmerchant_fees +
                        remmerchant_gst +
                        remplatform_fee,
                    )?.toFixed(2),
                  );
                  setModalVisible(true);
                  setBookingData(items.item);
                }}
                backgroundColor="white"
                height={40}
                borderWidth={1}
                borderColor="primary"
                justifyContent="center"
                alignItems="center"
                paddingHorizontal="t"
                borderRadius={10}>
                <Box style={styles.flexrow}>
                  <Text variant="blackshade13500">Pay the Remaining</Text>
                </Box>
              </TouchableBox>
            ) : (
              <TouchableBox
                onPress={() => navigation?.navigate('QRscanner')}
                backgroundColor="white"
                height={40}
                borderWidth={1}
                borderColor="primary"
                justifyContent="center"
                alignItems="center"
                paddingHorizontal="t"
                borderRadius={10}>
                <Box style={styles.flexrow}>
                  <FastImage
                    source={Images.autoLighting}
                    style={[styles.image, {marginLeft: 5}]}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                  <Text style={{padding: 5}} variant="blackshade14500">
                    Autolighting
                  </Text>
                </Box>
              </TouchableBox>
            )}

            <TouchableBox
              onPress={() => {
                setBookingData(items.item);
                handleCancelBooking(items?.item?.id);
              }}
              backgroundColor="primary"
              height={40}
              paddingHorizontal="t"
              justifyContent="center"
              alignItems="center"
              borderRadius={10}>
              <Text style={{padding: 5}} variant="white14400">
                Cancel booking
              </Text>
            </TouchableBox>
          </Box>
        )}
        {is_awaiting && (
          <TouchableBox
            onPress={() => {
              setrePay(
                parseFloat(
                  amount +
                    totalmerchant_fees +
                    totalmerchant_gst +
                    totalplatform_fee,
                )?.toFixed(2),
              );
              setModalVisible(true);
              setBookingData(items.item);
            }}
            backgroundColor="white"
            height={40}
            borderWidth={1}
            borderColor="primary"
            justifyContent="center"
            alignItems="center"
            marginHorizontal="m"
            borderRadius={10}
            mb={'m'}>
            <Box style={styles.flexrow}>
              <Text variant="blackshade13500">Complete Payment</Text>
            </Box>
          </TouchableBox>
        )}
      </TouchableBox>
    );
  };

  return booking?.transaction_data.length > 0 || data?.length > 0 ? (
    <FlatList
      data={profile ? data : booking.transaction_data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={handleOnEndReached}
    />
  ) : (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <Text variant="blackshade116500">No {from} Booking</Text>
    </Box>
  );
};

export default BookedHistoryCard;

// ListEmptyComponent={() => {
//   return (
//     <Box flex={1}>
//       {booking?.transaction_data.length === 0 && !loading ? (
//         <Box
//           height={size?.height / 2}
//           justifyContent={'center'}
//           alignItems={'center'}>
//           <Text variant="blackshade116500">No {from} Booking</Text>
//         </Box>
//       ) : (
//         <Box flex={1} paddingHorizontal="m">
//           <ScrollView
//             contentContainerStyle={{flexGrow: 1}}
//             showsVerticalScrollIndicator={false}>
//             {[0, 0, 0, 0, 1, 1].map((item, index) => {
//               return (
//                 <Animated.View
//                   entering={FadeIn.delay(100 * index)}
//                   exiting={FadeOut.delay(150 * index)}>
//                   <Box
//                     borderWidth={1}
//                     mb="m"
//                     key={index.toString()}
//                     borderRadius={12}
//                     backgroundColor="white"
//                     overflow="hidden"
//                     style={[
//                       {borderColor: '#ebebeb'},
//                       TypographyStyles.cardShadow,
//                     ]}>
//                     <Box
//                       mt="l"
//                       marginHorizontal="s"
//                       ml="m"
//                       flexDirection="row">
//                       <Box>
//                         <Shimmer height={80} width={40} />
//                       </Box>
//                       <Box ml="m">
//                         <Shimmer
//                           height={20}
//                           width={size.width / 1.5}
//                           borderRadius={5}
//                         />
//                         <Shimmer
//                           style={{marginTop: 10}}
//                           height={20}
//                           width={size.width / 1.3}
//                           borderRadius={5}
//                         />
//                         <Shimmer
//                           style={{marginTop: 10}}
//                           height={20}
//                           width={size.width / 3}
//                           borderRadius={5}
//                         />
//                       </Box>
//                     </Box>
//                     <Box
//                       marginHorizontal="m"
//                       mb="m"
//                       justifyContent="center"
//                       alignItems="center">
//                       <Shimmer
//                         style={{marginTop: 15}}
//                         height={40}
//                         width={size.width / 1.3}
//                         borderRadius={5}
//                       />
//                     </Box>
//                   </Box>
//                 </Animated.View>
//               );
//             })}
//           </ScrollView>
//         </Box>
//       )}
//     </Box>
//   );
// }}
