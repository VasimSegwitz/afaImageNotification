import React, {useCallback, useState} from 'react';
import {FlatList, Pressable} from 'react-native';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import Button from '../../Button';
import {Ionicon, feather} from '../../Icons';
import {styles} from './styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getAmountFromPercent} from '../../../../utils';
import moment from 'moment';
import {getBooking} from '../../../Services/ProfileApi';
import {useQuery} from 'react-query';
import {wp} from '../../../Helpers/responsive-ratio';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import RadioButton from '../../RadioButton';
const badminton = require('../../../../assets/Home/badminton/badminton.png');
const Location = require('../../../../assets/Home/Location/Location.png');

const SelectBookingForActivity = props => {
  const {route} = props;
  const {onPress, sel, date} = route?.params;
  const navigation = useNavigation();

  const renderItem = items => {
    const amount = items.item?.final_amount;
    const court = items?.item?.courts;
    const venue = items?.item.sports_facility?.sports_complex?.name;
    const address = items?.item.sports_facility?.sports_complex?.info?.address;
    const info = items?.item.sports_facility?.sports_complex?.info;
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
      info?.platform_fee,
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
      info?.platform_fee,
      // remaining_amount != 0 ? remaining_amount : 0,
      // ),
    );

    const totalmerchant_fees = parseFloat(
      getAmountFromPercent(info?.merchant_fees, amount),
    );

    const totalmerchant_gst = parseFloat(
      getAmountFromPercent(info?.merchant_gst, amount),
    );

    const totalplatform_fee = parseFloat(
      // getAmountFromPercent(
      info?.platform_fee,
      //  amount),
    );

    const cancellation_charge =
      parseFloat(items?.item?.info?.cancellation_charge) || 0;

    return (
      <TouchableBox
        style={[
          styles.parentBookedUpcoming,
          TypographyStyles.cardShadow,
          {
            // borderColor: palette?.primary,
            // borderWidth: selectBooking == items?.item?.id ? 1 : 0,
          },
        ]}
        onPress={() => setSelectBooking(items?.item?.id)}>
        <Box
          flexDirection={'row'}
          justifyContent={'space-between'}
          flexWrap="wrap"
          p="s"
          alignItems={'flex-start'}>
          <Box mt="m" ml="s" flex={1}>
            <RadioButton
              radio
              selected={selectBooking == items?.item?.id}
              size={16}
              onPress={() => setSelectBooking(items?.item?.id)}
            />
          </Box>
          <Box>
            <Box flexDirection="row" mt="m" alignItems="center">
              <FastImage
                source={badminton}
                style={{
                  height: wp(4),
                  width: wp(4),
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Box width={wp(69)}>
                <Text ml="m" variant="blackshade16800">
                  {venue || 'Not Provided'}
                </Text>
              </Box>
            </Box>

            <Box style={styles.divider} />
            <Box flexDirection="row" justifyContent="center">
              <FastImage
                source={Location}
                style={{marginTop: 5, height: wp(4), width: wp(4)}}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Box width={wp(69)}>
                <Text ml="m" variant="blackshade14400" numberOfLines={2}>
                  {address}
                </Text>
              </Box>
            </Box>
            <Box style={styles.flexrow} mt="m" mb="s">
              {feather('clock', wp('4'), palette?.warmGrey)}
              <Text style={{marginLeft: 10}} variant="blackshade14400">
                {moment(date)?.format('DD MMM YYYY, ')}
                {moment(time, 'hh:mm')?.format('LT')}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* {is_upcoming && ( */}
        {/* <Box
          flexDirection="row"
          justifyContent="space-between"
          marginVertical={'m'}
          marginHorizontal={'m'}
          mb={'m'}>
          {remaining_amount != 0 && (
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
          )}
        </Box> */}
        {/* )} */}
      </TouchableBox>
    );
  };

  const [booking, setBooking] = useState([]);
  const [pagecount, setPageCount] = useState(1);
  const [selectBooking, setSelectBooking] = useState(sel);

  const bookingReqBody = {status: 2, per_page: 5, page: pagecount};

  const getBookingQuery = useQuery(['getBooking', bookingReqBody], getBooking, {
    onSuccess: result => {
      setBooking({
        ...booking,
        transaction_data: booking.transaction_data.concat(
          result?.data?.filter(i => moment(i?.date)?.isSame(date)),
        ),
        new_transaction_data: result?.data || [],
      });
    },
    onError: error => {},
  });

  useFocusEffect(
    useCallback(() => {
      setPageCount(1);
      setBooking({...booking, transaction_data: [], new_transaction_data: []});
      getBookingQuery.refetch();
    }, []),
  );

  const handleOnEndReached = () =>
    booking.length >= 5 && setPageCount(pagecount + 1);

  return (
    <Box flex={1}>
      <Pressable
        style={styles.overlay}
        onPress={() => navigation.goBack(null)}
      />
      <Box style={styles.modalStyle}>
        <Box style={styles.whiteCard}>
          <Box style={styles.buttonsWrap} mb="m">
            <Text style={styles.blessingImg}>Select Booking</Text>
            <TouchableBox
              style={styles.closeIcon}
              onPress={() => navigation.goBack(null)}>
              {Ionicon('close', 20, palette?.black)}
            </TouchableBox>
          </Box>
          {booking?.transaction_data?.length > 0 ? (
            <FlatList
              data={booking?.transaction_data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={handleOnEndReached}
            />
          ) : (
            <Box flex={1} justifyContent={'center'} alignItems={'center'}>
              <Text variant="blackshade116500" textAlign={'center'}>
                {getBookingQuery?.isFetching
                  ? 'Loading'
                  : `No Upcoming Booking To Select \nFor This Activity`}
              </Text>
            </Box>
          )}
        </Box>
        <Box flex={0.25} bottom={0}>
          <Button
            label="Confirm"
            onPress={() => {
              onPress(selectBooking);
              navigation?.goBack(null);
            }}
          />
          <TouchableBox onPress={() => navigation.goBack(null)}>
            <Box style={styles.textEditWrap}>
              <Text style={styles.Editnumber}>Cancel</Text>
            </Box>
          </TouchableBox>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectBookingForActivity;
