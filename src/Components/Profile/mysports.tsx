import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../Constant/Image';
import {wp} from '../Helpers/responsive-ratio';
import {Box, Text, TouchableBox, TypographyStyles} from '../Theme/Index';
import styles from './styles';

const MySports = props => {
  const {drawer, setDrawer} = props;
  const sports_data = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );

  const handleSportsLevel = (id, game_skill) =>
    setDrawer({
      ...drawer,
      toggle_mysports_drawer: true,
      selected_sport_id: id ? id : 0,
      game_skill: game_skill ? game_skill : 0,
    });

  const getGameSkill = item => {
    switch (item) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      default:
        '-';
    }
  };

  return (
    <Box flex={1} backgroundColor="white" mt={'l'}>
      {sports_data?.length >= 1 ? (
        sports_data.map((data, i) => {
          return (
            <Box
              key={i}
              flexDirection={'row'}
              alignItems={'center'}
              mb={'m'}
              justifyContent={'space-between'}
              style={{width: wp(85)}}>
              <TouchableBox
                backgroundColor="white"
                style={[styles.mysportChip, TypographyStyles.cardShadow]}
                onPress={() =>
                  handleSportsLevel(data?.category?.id, data?.game_skill)
                }>
                <FastImage
                  source={
                    data?.category?.images.length > 0
                      ? {uri: data?.category?.images[0]}
                      : Images.Tennis
                  }
                  style={{height: wp(7), width: wp(7)}}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text marginHorizontal={'m'} variant={'blackshade14400'}>
                  {data?.category?.name}
                </Text>
                <Box style={styles.count}>
                  <Text
                    p={'s'}
                    variant={'blackshade12500'}
                    textAlign={'center'}>
                    {data?.category?.order}
                  </Text>
                </Box>
              </TouchableBox>
              <Text variant={'blackshade16400'}>
                {getGameSkill(data?.game_skill)
                  ? getGameSkill(data?.game_skill)
                  : '-'}
              </Text>
            </Box>
          );
        })
      ) : (
        <Box flex={1} justifyContent={'center'} alignItems={'center'} mb={'l'}>
          <Text variant="blackshade16500">No Favourite Sports</Text>
        </Box>
      )}
    </Box>
  );
};

export default MySports;
