import React from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../../../Constant/Image';
import {wp} from '../../../../Helpers/responsive-ratio';
import {Button} from '../../../../ReusableComponents';
import {Box, palette, Text} from '../../../../Theme/Index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
export default props => {
  const inset = useSafeAreaInsets();
  const {navigation, route} = props;
  const {booking, vanue} = route?.params;
  const {user} = useSelector(state => state?.auth?.user);

  const onSubmit = () => {
    navigation.navigate('BookingConfirmation', {
      booking: booking,
      vanue: vanue,
    });
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} backgroundColor="white" alignItems={'center'} p="l">
        <FastImage
          source={Images?.successGif}
          style={{
            height: wp(100),
            width: wp(100),
            marginTop: wp(0),
            position: 'absolute',
          }}
          resizeMode="contain"
        />
        <Box alignItems={'center'} justifyContent="center" flex={1} top={wp(0)}>
          <FastImage
            source={Images?.successPoints}
            style={{height: 80, width: 80}}
            resizeMode="contain"
          />
          <Text variant={'primary20900'} mt="l">
            Hooray!
          </Text>
          <Text variant={'blackshade16400'}>You just earned</Text>
          <Text
            variant={'primary20900'}
            mt="l"
            fontSize={80}
            letterSpacing={0}
            lineHeight={100}>
            {booking?.info?.deposit_amount > 0
              ? booking?.info?.deposit_amount - booking?.total_discount
              : booking?.final_amount}
          </Text>
          <Text variant={'blackshade16400'} textAlign="center">
            for booking this venue.
          </Text>
          <Text variant={'blackshade16400'} textAlign="center">
            Enjoy your activity!
          </Text>
          <Box
            height={1}
            width={wp(100) - 50}
            style={{backgroundColor: '#D4D4D4'}}
            marginVertical="l"
          />
          <Box>
            <Text variant={'blackshade16400'}>Points Balance:</Text>
            <Text variant={'blackshade18500'} textAlign="center" mt="s">
              {user?.data?.total_loyalty_points}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box
        style={{marginBottom: inset?.bottom}}
        paddingBottom="l"
        marginHorizontal={'l'}
        alignItems="center">
        <Box width={'60%'} pb="l">
          <Text variant={'blackshade12400'} textAlign="center">
            * If this booking is cancelled, these points will not be reflected
            your account.
          </Text>
        </Box>
        <Button label={'High five!'} onPress={() => onSubmit()} />
      </Box>
    </Box>
  );
};
