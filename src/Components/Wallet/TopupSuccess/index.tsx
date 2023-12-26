import React from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {Box, palette, Text} from '../../Theme/Index';

export default props => {
  const {navigation, route} = props;
  const {topup} = route?.params;
  const {user} = useSelector(state => state?.auth?.user);

  const onSubmit = () => {
    navigation?.pop(2);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} backgroundColor="white" alignItems={'center'} p="xl">
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
        <Box
          alignItems={'center'}
          justifyContent="center"
          flex={1}
          top={wp(10)}>
          <FastImage
            source={Images?.successPoints}
            style={{height: 80, width: 80}}
            resizeMode="contain"
          />
          <Text variant={'primary20900'} mt="l">
            Ka-chinggg!
          </Text>
          {/* <Text variant={'blackshade16400'}>You just earned</Text> */}
          <Text
            variant={'primary20900'}
            mt="l"
            fontSize={80}
            letterSpacing={0}
            lineHeight={100}>
            {topup || '30'}
          </Text>
          <Box bottom={20}>
            <Text
              variant={'blackshade16400'}
              letterSpacing={5}
              style={{
                color: '#525252',
              }}>
              points
            </Text>
          </Box>

          <Text variant={'blackshade16400'} textAlign="center">
            for topping up your AFA Pay.
          </Text>

          <Box
            height={1}
            width={wp(100) - 50}
            style={{backgroundColor: '#D4D4D4'}}
            marginVertical="xl"
          />
          <Box>
            <Text variant={'blackshade16400'}>Points Balance:</Text>
            <Text variant={'blackshade18500'} textAlign="center" mt="s">
              {user?.data?.total_loyalty_points}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box paddingBottom="l" marginHorizontal={'l'} alignItems="center">
        {/* <Box width={'60%'} pb="xl">
          <Text variant={'blackshade12400'} textAlign="center">
            * If this booking is cancelled, these points will not be reflected
            your account.
          </Text>
        </Box> */}
        <Button label={'High five!'} onPress={() => onSubmit()} />
      </Box>
    </Box>
  );
};
