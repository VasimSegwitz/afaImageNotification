import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {feather} from '../../ReusableComponents/Icons';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import styles from './styles';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {CancelBookingMutation, checkCancel} from '../../Services/Booking';
import {getUserProfile} from '../../Services/ProfileApi';
import {useDispatch} from 'react-redux';
import {AuthConstants} from '../../../Redux';

const CancelBooking = props => {
  const {state, setState, booking_confirmed, currency} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cancellationAmount, setCancellationAmount] = useState(null);

  const handleCancel = () => setState({...state, is_booking_cancelled: false});
  const handleRefundPolicy = () => navigation.navigate('RefundPolicy');

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    enabled: false,
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
      }
    },
    onError: error => {},
  });

  const {mutate} = useMutation('CancelBooking', CancelBookingMutation, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `Something Went Wrong`);
      } else {
        getUserProfileQuery.refetch();
        displaySuccessToast(data?.message || 'Booking Cancelled Successfully');
        booking_confirmed
          ? navigation.navigate('BookingHistory')
          : navigation?.goBack();
      }
    },
  });

  const handleCancelBooking = () => {
    const payload = {
      id: state?.booking_id,
    };

    mutate(payload);
  };

  const CheckCancelMutation = useMutation('checkCancel', checkCancel, {
    onSuccess(data) {
      if (data?.success == 1) {
        setCancellationAmount(data?.data?.cancellation_amount);
      }
    },
    onError(err) {},
  });

  useEffect(() => {
    const body = {booking_id: state?.booking_id};
    CheckCancelMutation.mutate(body);
  }, []);

  return (
    <Box backgroundColor={'white'} style={styles.cancelBooking} pb="s">
      <Box style={styles.cancelBookingHeader} pt="s">
        <Text variant={'blackshade20500'} marginVertical={'m'}>
          Confirm Cancel Booking?
        </Text>
        <TouchableOpacity onPress={handleCancel}>
          {feather('x-circle', wp('6'), palette?.warmGrey)}
        </TouchableOpacity>
      </Box>
      <Box style={styles.cancelBookingBody}>
        <Text variant={'blackshade14400'} fontWeight={'800'} mb={'s'}>
          MONEY REFUND
        </Text>
        {cancellationAmount != 0 && (
          <Text style={{marginVertical: 10}} variant={'blackshade16400'}>
            You are eligible for a refund of {currency == 1 ? 'RM' : 'SGD'}{' '}
            {cancellationAmount} if you proceed to cancel this booking. Your
            refund will be credited to your AFA Wallet.
          </Text>
        )}
        {cancellationAmount == 0 && (
          <Text style={{marginVertical: 10}} variant={'blackshade16400'}>
            You are not eligible for any refund upon cancellation of this
            booking.
          </Text>
        )}
        <TouchableOpacity
          style={[styles.flexrow, {marginBottom: 15}]}
          onPress={handleRefundPolicy}>
          {feather('alert-circle', wp('6'), palette?.warmGrey)}
          <Text
            style={{marginLeft: 5}}
            variant={'blackshade112400'}
            marginVertical={'s'}>
            Read more about our Refund Policy
          </Text>
        </TouchableOpacity>
        <Box>
          <TouchableBox
            onPress={handleCancelBooking}
            backgroundColor="primary"
            height={40}
            justifyContent="center"
            alignItems="center"
            borderRadius={10}>
            <Text style={{padding: 5}} variant="white14400">
              Cancel booking
            </Text>
          </TouchableBox>
          <TouchableOpacity
            style={{alignItems: 'center', marginTop: 5}}
            onPress={handleCancel}>
            <Text variant="blackshade14400" marginVertical={'s'}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

export default CancelBooking;
