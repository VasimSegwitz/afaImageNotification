import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {TextInput, FlatList, Keyboard} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {displayErrorToast, displaySuccessToast, ios} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import {Button, Header, LoadingOverlay} from '../../ReusableComponents';
import {feather, Ionicon} from '../../ReusableComponents/Icons';
import {walletTopup} from '../../Services/WalletApi';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './styles';
import WebView from 'react-native-webview';
import {getUserProfile} from '../../Services/ProfileApi';
import {AuthConstants} from '../../../Redux';
import {useDispatch} from 'react-redux';
import Animated, {
  BounceIn,
  BounceOut,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
const Touch = Animated.createAnimatedComponent(TouchableWithoutFeedback);

const TopUp = props => {
  const {wallet_balance} = props?.route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const initial_state = {
    amount: '',
    selected_id: 0,
    show_hover: false,
    openPicker: false,
    is_loading: false,
  };
  const [state, setState] = useState(initial_state);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [webViewUrl, setWebViewUrl] = useState('');

  const topupAmount = [
    {id: 1, payable_amount: 30},
    {id: 2, payable_amount: 50},
    {id: 3, payable_amount: 100},
    {id: 4, payable_amount: 150},
    {id: 5, payable_amount: 200},
    {id: 6, payable_amount: 250},
  ];

  const renderItem = items => {
    const {payable_amount, id} = items.item;

    return (
      <TouchableBox
        style={
          id == state.selected_id ? styles.selectedChip : styles.amountChip
        }
        onPress={() =>
          setState({...state, amount: payable_amount, selected_id: id})
        }>
        <Box
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'center'}>
          <Box
            style={{
              marginLeft: id == state.selected_id ? wp(4) : 0,
              marginRight: id == state.selected_id ? wp(-1) : 0,
            }}>
            {id == state.selected_id ? (
              feather('check-circle', wp('4'), palette?.white)
            ) : (
              <></>
            )}
          </Box>
          <Text
            p={'m'}
            style={{textAlign: 'center'}}
            variant={
              id == state.selected_id ? 'white14400' : 'blackshade14500'
            }>
            {payable_amount}
          </Text>
        </Box>
      </TouchableBox>
    );
  };

  const handleHover = () => setState({...state, show_hover: !state.show_hover});
  const onChangeText = value => setState({...state, amount: value});
  const togglePicker = () => {
    Keyboard.dismiss();
    setState({...state, openPicker: !state.openPicker});
  };

  const topupWalletMutation = useMutation('walletTopup', walletTopup, {
    onSuccess: data => {
      if (data?.data?.success == 0)
        return displayErrorToast('Something went wrong');
      setState({...state, is_loading: false});

      // navigation.goBack();

      setPaymentUrl(data?.data?.payment_url);
    },
    onError: error => {
      displayErrorToast('Something went wrong');
      setState({...state, is_loading: false});
    },
  });

  const getUserProfileQuery = useQuery('getUserProfile', getUserProfile, {
    enabled: false,
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        //navigation?.navigate('TopupSuccess', {topup: state.amount});
      }
    },
    onError: error => {
      console.log(error);
    },
  });

  const handleTopup = () => {
    if (parseInt(state.amount) < 30)
      return displayErrorToast('Minimum allowed Top up amount is 30');
    if (parseInt(state.amount) > 250)
      return displayErrorToast('Maximum allowed Top up amount is 250');
    if (parseInt(state.amount) + parseInt(wallet_balance) > 500)
      return displayErrorToast('Maximum Wallet balance limit is 500');
    setState({...state, is_loading: true});
    const body = {amount: state.amount};
    topupWalletMutation.mutate(body);
  };

  const onPaymentStatus = () => {
    if (webViewUrl?.includes('error')) {
      displayErrorToast('Payment Failed');
      setPaymentUrl('');
      setWebViewUrl('');
    } else if (webViewUrl?.includes('success')) {
      getUserProfileQuery.refetch();
      displaySuccessToast('Wallet top-up successfully');
      navigation.goBack();
      setPaymentUrl('');
      setWebViewUrl('');
    } else if (webViewUrl?.includes('failure')) {
      displayErrorToast('Payment Failed');
      setPaymentUrl('');
      setWebViewUrl('');
    }
  };

  useEffect(() => {
    onPaymentStatus();
  }, [webViewUrl]);

  if (paymentUrl) {
    return (
      <Box style={{flex: 1}}>
        <Header title="Topup" left navigation={navigation} />
        <WebView
          source={{
            uri: paymentUrl,
          }}
          style={{flex: 1}}
          onNavigationStateChange={e => setWebViewUrl(e?.url)}
          scalesPageToFit={ios}
          useWebKit={ios}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="white">
      {state.openPicker && (
        <TouchableBox onPress={togglePicker} style={[styles.overLay]} />
      )}
      <Header title={'Top-up'} left />
      <Box justifyContent={'center'} alignItems={'center'}>
        <Box
          flexDirection={'row'}
          alignItems={'center'}
          style={{marginTop: wp(10)}}>
          <Text variant={'blackshade18500'} fontWeight={'bold'}>
            Top Up Your AFA Pay
          </Text>
          <TouchableBox style={{marginLeft: wp(2)}} onPress={handleHover}>
            {feather('alert-circle', wp(5), palette?.warmGrey)}
          </TouchableBox>
        </Box>
        <Text
          variant={'blackshade112400'}
          textAlign={'center'}
          style={{
            marginHorizontal: wp(3),
            marginTop: wp(1),
          }}>{`Minimum top up of RM30`}</Text>
        {state.show_hover && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={[styles.hoverCard, TypographyStyles.cardShadow]}
            backgroundColor="white">
            <Box
              flexDirection={'row'}
              justifyContent={'space-between'}
              marginHorizontal={'m'}
              mt={'m'}>
              <Text variant="blackshade12500">Funds Limitations.</Text>
              <TouchableBox onPress={handleHover}>
                {Ionicon('close', 20, palette?.blackshade)}
              </TouchableBox>
            </Box>
            <Text ml={'m'} variant="blackshade112400">
              {`Top-up limit : RM250 per transaction. \nWallet balance limit : RM500.`}
            </Text>
          </Animated.View>
        )}
      </Box>
      <Animated.View
        exiting={SlideInUp.delay(500)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: state.show_hover ? 0 : wp(6),
          marginLeft: wp(8),
        }}>
        <Text variant={'blackshade20500'} style={styles.rm}>
          RM
        </Text>
        <TextInput
          placeholder="0"
          placeholderTextColor={palette?.primary3}
          onChangeText={onChangeText}
          keyboardType={'number-pad'}
          maxLength={3}
          editable={false}
          value={state.amount.toString()}
          style={[
            styles.placeHolder,
            {color: state.amount == 0 ? palette.primary3 : palette.primary},
          ]}
        />
      </Animated.View>
      <Text style={styles.walletBalance} variant={'blackshade16400'}>
        Wallet balance: RM {wallet_balance || 0}
      </Text>
      <Box flex={1} alignItems="center" justifyContent={'center'} mt={'l'}>
        <FlatList
          data={topupAmount}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
        />
      </Box>
      <Box height={46} marginHorizontal={'m'} mb="m">
        <Button
          disabled={state.amount == 0}
          label="Next"
          onPress={togglePicker}
        />
      </Box>
      {state.openPicker && (
        <>
          {state.is_loading && <LoadingOverlay />}
          <Animated.View
            entering={SlideInDown}
            exiting={FadeOut}
            style={[
              {
                flex: 1,
                zIndex: 2,
                backgroundColor: 'white',
              },
              styles.confirmationModal,
              TypographyStyles.cardShadow,
            ]}>
            <Box
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              marginHorizontal={'l'}
              marginVertical={'l'}>
              <Text variant={'blackshade20500'}>Review & Confirm</Text>
              <TouchableBox onPress={togglePicker}>
                {Ionicon('close', 20, palette?.blackshade)}
              </TouchableBox>
            </Box>
            <Box
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              marginHorizontal={'l'}>
              <Text variant={'blackshade16400'}>Top-up amount</Text>
              <Text variant={'blackshade16400'}>RM {state.amount}.00</Text>
            </Box>
            <Box
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              marginHorizontal={'l'}
              marginVertical={'s'}>
              <Text variant={'blackshade12800'}>TOTAL</Text>
              <Text variant={'blackshade16400'}>RM {state.amount}.00</Text>
            </Box>
            <Box
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              marginHorizontal={'l'}>
              <Text variant={'blackshade16400'}>Payment method</Text>
              <Text variant={'blackshade16400'}>Online</Text>
            </Box>
            <Box
              marginHorizontal="l"
              height={wp(0.3)}
              marginVertical={'l'}
              backgroundColor="tertiary2"
            />
            <Box height={46} marginHorizontal={'m'}>
              <Button label="Top Up Now" onPress={handleTopup} />
            </Box>
            <TouchableBox
              style={{
                alignItems: 'center',
                marginTop: wp(2),
                marginBottom: wp(2),
              }}
              onPress={togglePicker}>
              <Text variant="blackshade14400" marginVertical={'s'}>
                Change another amount
              </Text>
            </TouchableBox>
          </Animated.View>
        </>
      )}
    </Box>
  );
};

export default TopUp;
