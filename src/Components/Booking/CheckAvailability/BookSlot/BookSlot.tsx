import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {ScrollView, StyleSheet, FlatList, Modal} from 'react-native';
import theme, {
  Box,
  fonts,
  palette,
  size,
  Text,
  TouchableBox,
} from '../../../Theme/Index';
import {Header, Button} from '../../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {LockSlot} from '../../../Services/Booking';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast} from '../../../../utils';
import PaymentOptions from '../../../ReusableComponents/Modals/PaymentOptions';
import {getWalletBalance} from '../../../Services/WalletApi';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {currencyCode} from '../../../Helpers/Enums';
import {wp} from '../../../Helpers/responsive-ratio';
import {AuthConstants, BookingConstants} from '../../../../Redux';
import {useDispatch, useSelector} from 'react-redux';
import {getUserProfile} from '../../../Services/ProfileApi';

const BookSlot = ({navigation, route, value, onChangeText}) => {
  const is_wallet_activated = useSelector(
    state => state?.auth?.user?.user?.data?.wallet?.activated_at,
  );

  const {APIBody, vanue, courtsData, facility_id} = route?.params;
  const isFocused = useIsFocused();
  const [courtData, setCourtdata] = useState(courtsData || []);
  const [booking, setBooking] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [paymentOption, setPaymentOption] = useState(1);
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();

  const currency = currencyCode(vanue?.info?.currency)?.name;
  const filter_facility = vanue?.facilities?.filter(
    data => data?.id == facility_id,
  );

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
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

  useFocusEffect(
    useCallback(() => {
      getUserProfileQuery?.refetch();
    }, []),
  );

  const is_deposit_payment =
    filter_facility[0]?.is_deposit_payment && booking?.info?.deposit_amount > 0;

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      apiBody: APIBody,
    },
  );

  const refresh = () => {
    navigation.goBack(null);
  };

  /**
   * @function getSlotLock
   * @description this function will call the LockSlot api
   */

  const getSlotLock = useMutation('LockSlot', LockSlot, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        if (data?.data !== undefined) {
          navigation.navigate('CheckAvailabilityModal', {
            data: data.data,
            refresh: refresh,
          });
        } else {
          displayErrorToast(data?.data?.message);
        }
      } else {
        setBooking({...data?.data, insurance_price: data?.insurance_price});

        // if (is_wallet_activated === null) {
        //   navigation.navigate("AFANotAvailableModal")

        // } else {
        //   setModalVisible(true);
        // }
        // navigation.navigate('PaymentOptionsModal', {
        //   onChooseWallet: () => {
        //     setPaymentMethod(1);
        //   },
        //   onChooseOnline: () => {
        //     setPaymentMethod(2);
        //   },
        //   onChooseFullPayment: () => {
        //     setPaymentOption(1);
        //   },
        //   onChooseDepositPayment: () => setPaymentOption(2),
        //   onClose: () => {
        //     setModalVisible(!modalVisible);
        //   },
        //   buttonLabel: 'Next',
        //   onWallet: () => {
        //     setModalVisible(!modalVisible);
        //     navigation?.navigate('Wallet');
        //   },
        //   title: 'Choose your payment method',
        //   detail: {
        //     amount: booking?.final_amount,
        //     balance: amount,
        //     deposite_amount: booking?.info?.deposit_amount,
        //   },
        //   paymentMethod: val => {
        //     setPaymentMethod(val);
        //   },
        //   onPress: () => onSubmit,
        //   currency: currency,
        //   paymentOption: paymentOption,
        //   is_deposit_payment: is_deposit_payment,
        // });
        setModalVisible(true);
      }
    },
  });

  /**
   * @function BookSlots
   * @description this function will create the body and call the api
   */

  const BookSlots = () => {
    let court = courtData.filter(item => item?.flag == true);

    if (court?.length < 1) {
      displayErrorToast('Select The court to book');
      return;
    }

    const body = {
      ...APIBody,
      court_nos: court.map(item => item?.court),
      is_deposit: true,
    };

    setState({
      apiBody: body,
    });

    getSlotLock?.mutate(body);
  };

  useEffect(() => {
    getWalletData?.refetch();
  }, []);

  const onSubmit = () => {
    if (paymentMethod == 0) {
      return displayErrorToast('Choose Valid Payment Method');
    }
    if (paymentMethod == 1) {
      if (is_wallet_activated === null) {
        setModalVisible(!modalVisible);
        return navigation.navigate('AFANotAvailableModal');
      }
      if (
        parseInt(booking?.final_amount) > parseInt(amount) &&
        paymentOption == 1
      ) {
        setModalVisible(!modalVisible);

        navigation.navigate('AFAInSufficentModal');

        return;
      }
      if (
        parseInt(booking?.info?.deposit_amount) > parseInt(amount) &&
        paymentOption == 2
      ) {
        setModalVisible(!modalVisible);
        navigation.navigate('AFAInSufficentModal');
        return;
      }

      setModalVisible(!modalVisible);
      // navigation.navigate('Insurance', {
      //   apiBody: state?.apiBody,
      //   booking: booking,
      //   mode: 'afa_pay',
      //   vanue: vanue,
      //   is_deposit: paymentOption == 1 ? false : true,
      // })

      navigation.navigate('BookingSummary', {
        apiBody: state?.apiBody,
        booking: booking,
        mode: 'afa_pay',
        vanue: vanue,
        is_deposit: paymentOption == 1 ? false : true,
      });
    } else if (paymentMethod == 2) {
      setModalVisible(!modalVisible);
      // navigation?.navigate('Insurance', {
      //   apiBody: state?.apiBody,
      //   mode: 'online_payment',
      //   vanue: vanue,
      //   booking: booking,
      //   is_deposit: paymentOption == 1 ? false : true,
      // });

      navigation.navigate('BookingSummary', {
        apiBody: state?.apiBody,
        booking: booking,
        mode: 'online_payment',
        vanue: vanue,
        is_deposit: paymentOption == 1 ? false : true,
        is_insured: false,
      });
    }
  };

  const body = {type: 2, action: 1, per_page: 5, page: 1};
  const getWalletData = useQuery(['getWalletBalance', body], getWalletBalance, {
    onSuccess: result => {
      setAmount(result?.data?.wallet?.balance);
      dispatch({
        type: BookingConstants?.PAYMENTURL,
        url: null,
      });
    },
    onError: error => {},
  });

  useEffect(() => {
    getWalletData.refetch();
  }, [isFocused]);

  return (
    <Box flex={1} backgroundColor="white">
      <Header title="Book Slot" left />
      {preview && (
        <TouchableBox
          onPress={() => setPreview(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            height: '100%',
            width: '100%',
            zIndex: 1,
            borderRadius: 10,
            padding: 5,
          }}>
          {vanue?.info?.floor_plan.length > 0 && (
            <FastImage
              source={{uri: vanue?.info?.floor_plan[0]}}
              style={{height: wp(60), width: wp(100)}}
              resizeMode={'contain'}
            />
          )}
        </TouchableBox>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1}>
          {vanue?.info?.floor_plan.length > 0 && (
            <>
              <Box mt="l" marginHorizontal="m">
                <Box flexDirection="row">
                  <Text ml="m" variant="blackshade16800">
                    Centre Layout
                  </Text>
                </Box>
              </Box>
              <TouchableBox mt="m" ml="l" onPress={() => setPreview(true)}>
                <FastImage
                  source={{uri: vanue?.info?.floor_plan[0]}}
                  style={{height: wp(60), width: wp(90)}}
                  resizeMode={'contain'}
                />
              </TouchableBox>
            </>
          )}
          <Box flexDirection="row" marginHorizontal="m" mt="m">
            <Text ml="m" variant="blackshade16800">
              Choose From These Available Slots
            </Text>
          </Box>
          <Box marginHorizontal="l">
            <FlatList
              keyExtractor={(item, index) => index?.toString()}
              style={{flexGrow: 1, marginBottom: 10}}
              contentContainerStyle={{flex: 1, paddingBottom: 60}}
              data={courtData}
              ListEmptyComponent={() => {
                return (
                  <Box
                    mt="xxl"
                    pt="xxl"
                    justifyContent="center"
                    marginHorizontal={'l'}>
                    <Text textAlign={'center'} variant="blackshade16500">
                      No courts are available {'\n'}for the selected time.
                      Please choose a different time or date.
                    </Text>
                  </Box>
                );
              }}
              renderItem={({item}) => {
                const {name} = item;
                return (
                  <Box mt="m">
                    <RadioButton
                      text={item?.court}
                      selected={item?.flag}
                      onPress={() => {
                        const d = courtData?.map(it => {
                          if (item?.court == it?.court)
                            return {...it, flag: !it?.flag};
                          else return {...it};
                        });
                        setCourtdata(d);
                      }}
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                        marginLeft: 10,
                      }}
                    />
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      </ScrollView>
      <Box flex={1} justifyContent="flex-end" mb="l">
        <Box height={46} marginHorizontal="l" mt="l">
          <Button
            label="Book Now"
            disabled={courtData?.length < 1}
            onPress={() => {
              BookSlots();
            }}
          />
        </Box>
      </Box>
      <PaymentOptions
        visible={modalVisible}
        onChooseWallet={() => setPaymentMethod(1)}
        onChooseOnline={() => setPaymentMethod(2)}
        onChooseFullPayment={() => setPaymentOption(1)}
        onChooseDepositPayment={() => setPaymentOption(2)}
        onClose={() => setModalVisible(!modalVisible)}
        buttonLabel="Next"
        onWallet={() => {
          setModalVisible(!modalVisible);
          navigation?.navigate('Wallet');
        }}
        title="Choose your payment method"
        detail={{
          amount: booking?.final_amount,
          balance: amount,
          deposite_amount: booking?.info?.deposit_amount,
        }}
        paymentMethod={paymentMethod}
        onPress={onSubmit}
        currency={currency}
        paymentOption={paymentOption}
        is_deposit_payment={is_deposit_payment}
      />
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

export default BookSlot;
