import React from 'react';
import {Box, size, Text} from '../Theme/Index';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {wp} from '../Helpers/responsive-ratio';
import {Images} from '../../Constant/Image';

const EarnedItem = ({item}) => {
  const {amount, action, mission, created_at, title, type} = item;

  // action = 1 = in (+)
  // action = 2 = out (-)

  // type = 3 = mission
  // type = 1 = booking
  // type  = 2 = wallet

  return (
    <Box marginHorizontal="l">
      <Box flex={1} flexDirection="row">
        <FastImage
          source={Images?.Wallet}
          style={{
            height: wp(5),
            width: wp(5),
          }}
        />
        <Box flex={1} justifyContent="space-between">
          <Box
            flex={1}
            flexDirection="row"
            justifyContent="space-between"
            ml="m">
            <Box width={size.width / 1.5}>
              <Text variant="blackshade14400">{title}</Text>
            </Box>
            <Text variant="blackshade16800Semi">
              {action === 1 ? '+' : '-'} {amount}
            </Text>
          </Box>
          <Text flex={1} ml="m" variant="blackshade112400">
            {moment(created_at).format('DD MMM YY')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default EarnedItem;
