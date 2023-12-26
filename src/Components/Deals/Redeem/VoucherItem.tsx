import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import theme, {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import moment from 'moment';
const VoucherItem = ({navigation, refresh, item}) => {
  const {
    cost,
    created_at,
    deleted_at,
    details,
    discount_type,
    discount_value,
    expiration,
    faq,
    id,
    images,
    max_usage,
    sports_complex_id,
    status,
    terms,
    title,
    type,
    updated_at,
    validity,
  } = item;

  return (
    <TouchableBox
      onPress={() => {
        navigation.navigate('VoucherDetails', {item, refresh});
      }}
      mt="m"
      flexDirection="row"
      marginHorizontal="m">
      <Box
        borderRadius={18}
        justifyContent="center"
        alignItems="center"
        style={[styles.dashed, styles.cardShadow]}
        minHeight={wp(27)}
        width={wp(27)}
        backgroundColor="white">
        <FastImage
          style={styles.boxx}
          resizeMode={FastImage?.resizeMode?.contain}
          source={images.length > 0 ? {uri: images[0]} : Images?.RedeemBox}
        />
      </Box>
      <Box
        flex={1}
        borderRadius={18}
        backgroundColor="white"
        style={styles.cardShadow}
        paddingLeft="m"
        justifyContent="center">
        <Text pt="m" variant="blackshade16800">
          {title}
        </Text>
        <Box flexDirection="row" alignItems="center">
          <FastImage source={Images?.Points} style={styles.points} />
          <Text variant="primary16500Medium">
            {'  '}
            {cost} points
          </Text>
        </Box>
        <Text mt="s" variant="blackshade114800Regular">
          {type === 1
            ? 'To book venue or join activity '
            : 'With one personal trainer'}
        </Text>
        <Text mb="m" variant="blackshade114800Regular">
          Validity:{' '}
          {validity !== null
            ? `${validity} days`
            : expiration !== null
            ? moment(expiration).format('DD/MM/YYYY')
            : '--'}
        </Text>
      </Box>
    </TouchableBox>
  );
};

const styles = StyleSheet.create({
  points: {
    height: wp(5),
    width: wp(5),
  },
  dashed: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: palette?.primary,
  },
  boxx: {
    borderRadius: 5,
    height: wp(22),
    width: wp(22),
  },
  content: {flexGrow: 1},
  headerImage: {
    height: wp(51),
    width: wp(100),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
});

export default VoucherItem;
