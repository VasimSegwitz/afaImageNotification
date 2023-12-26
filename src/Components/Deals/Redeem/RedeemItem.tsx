import React, {memo, useEffect, useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import theme, {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import moment from 'moment';

const RedeemItem = ({navigation, route, item}) => {
  const {reward, reward_data} = item;

  return (
    <TouchableBox
      onPress={() => {
        navigation.navigate('RedeemDetails', {item});
      }}
      mt="m"
      flexDirection="row"
      marginHorizontal="m"
      alignItems="center">
      <Box
        borderRadius={18}
        justifyContent="center"
        alignItems="center"
        style={[styles.dashed, styles.cardShadow]}
        height={wp(27)}
        width={wp(27)}
        backgroundColor="white">
        <FastImage
          style={styles.boxx}
          resizeMode={FastImage?.resizeMode?.contain}
          source={
            reward?.images.length > 0
              ? {uri: reward?.images[0]}
              : Images?.RedeemBox
          }
        />
      </Box>
      <Box
        backgroundColor="primary"
        flex={1}
        borderRadius={18}
        backgroundColor="white"
        style={styles.cardShadow}
        paddingLeft="m">
        <Text pt="m" variant="blackshade16800">
          {reward_data?.title}
        </Text>
        <Box flexDirection="row" alignItems="center">
          <FastImage source={Images?.Points} style={styles.points} />
          <Text variant="primary16500Medium" ml="s">
            {reward_data?.cost !== null ? reward_data?.cost : 0} points
          </Text>
        </Box>
        <Text mt="m" variant="blackshade114800Regular">
          To book venue or join activity{' '}
        </Text>
        <Text variant="blackshade114800Regular">
          Validity: {reward_data?.validity} days
        </Text>
        <Text marginVertical="m" variant="blackshade114800Regular">
          Expiration: {moment(reward_data?.expiration).format('DD/MM/YY')}{' '}
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

export default RedeemItem;
