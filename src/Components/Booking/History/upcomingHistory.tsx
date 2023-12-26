import React, {useState, useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import PaymentOptions from '../../ReusableComponents/Modals/PaymentOptions';
import {getWalletBalance} from '../../Services/WalletApi';
import {Box, Text, TouchableBox} from '../../Theme/Index';

import TypesOfSports from '../SearchVenues/BookingSearch/TypesOfSports/TypesOfSports';
import BookedHistoryCard from './bookedHistoryCard';
import CancelBooking from './cancelBooking';
import styles from './styles';
import {displayErrorToast} from '../../../utils';
import {payTheRemaining} from '../../Services/Booking';
import {currencyCode} from '../../Helpers/Enums';

const UpcomingHistory = props => {
  const {from} = props;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const initialState = {
    is_booking_cancelled: false,
    total_booking: 0,
    booking_id: 0,
  };

  const [state, setState] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [bookingData, setBookingData] = useState();
  const [rePay, setrePay] = useState(0);

  const togglePicker = () => setState({...state, is_booking_cancelled: false});

  const body = {type: 2, action: 1, per_page: 5, page: 1};
  const getWalletData = useQuery(['getWalletBalance', body], getWalletBalance, {
    onSuccess: result => {
      setAmount(result?.data?.wallet?.balance);
    },
    onError: error => {},
  });

  useEffect(() => {
    getWalletData.refetch();
  }, [isFocused]);

  const onSubmit = () => {
    if (paymentMethod == 0)
      return displayErrorToast('Choose Valid Payment Method');
    if (paymentMethod == 1) {
      setModalVisible(false);
      navigation.navigate('PinVerification', {
        type: 'is_payremaining',
        bookingData: bookingData,
      });
    }
    if (paymentMethod == 2) {
      setModalVisible(false);
      navigation?.navigate('PaymentLoading', {
        url: bookingData?.payment_url,
      });
    }
  };

  return (
    <>
      <Box flex={1} backgroundColor="white">
        <Box flex={1} mt="l">
          {state.is_booking_cancelled && (
            <TouchableBox onPress={togglePicker} style={[styles.overLay]} />
          )}
          <View style={styles.parent}>
            <Text style={styles.bookingLable} variant="blackshade116500">
              {state.total_booking} Booking
            </Text>
          </View>
          <BookedHistoryCard
            state={state}
            setState={setState}
            from={from}
            setModalVisible={setModalVisible}
            setBookingData={setBookingData}
            setrePay={setrePay}
          />
        </Box>
        <PaymentOptions
          visible={modalVisible}
          onChooseWallet={() => setPaymentMethod(1)}
          onChooseOnline={() => setPaymentMethod(2)}
          onClose={() => setModalVisible(!modalVisible)}
          buttonLabel="Next"
          onWallet={() => {
            setModalVisible(!modalVisible);
            navigation?.navigate('Wallet');
          }}
          title="Choose your payment method"
          detail={{
            amount: rePay,
            balance: amount,
          }}
          paymentMethod={paymentMethod}
          is_payremaining={true}
          onPress={onSubmit}
          is_deposit_payment={false}
          currency={
            currencyCode(
              bookingData?.sports_facility?.sports_complex?.info?.currency,
            )?.name
          }
          is_awaiting={from == 'awaiting'}
        />
      </Box>
      {state.is_booking_cancelled && (
        <CancelBooking
          state={state}
          setState={setState}
          currency={
            bookingData?.sports_facility?.sports_complex?.info?.currency
          }
        />
      )}
    </>
  );
};

export default UpcomingHistory;
