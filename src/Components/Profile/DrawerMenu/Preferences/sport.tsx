import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import styles from './style';
import {Button} from '../../../ReusableComponents';
import {useMutation, useQuery} from 'react-query';
import {
  getUserProfile,
  updateFavouriteSport,
} from '../../../Services/ProfileApi';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {AuthConstants} from '../../../../Redux';

const Sport = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const sports_data = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );
  let temp_sport = sports_data;
  const [sport, setSport] = useState(temp_sport);

  const onSelectAnotherSport = item => {
    setSport([...sport, ...item]);
  };

  const handleRemoveSport = id => {
    const item = sport.filter(
      data => data?.category?.id != id && data?.id != id,
    );
    setSport(item);
  };

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

  const updateFavouriteSportMutation = useMutation(
    'updateFavouriteSportMutation',
    updateFavouriteSport,
    {
      onSuccess: data => {
        if (data?.success == 0) return displayErrorToast(data?.message);
        if (data?.success == 1) {
          getUserProfileQuery.refetch();
          displaySuccessToast(data?.message);
          navigation.goBack();
          return;
        }
      },
      onError: error => {
        if (error?.data?.success == 0)
          return displayErrorToast(error?.data?.message);
      },
    },
  );

  const onSportSubmit = () => {
    const prev_sport = sport?.map(data => data?.category?.id);
    const new_sport = sport?.map(data => data?.id);
    const pre_body = [...prev_sport, ...new_sport];
    const body = pre_body.filter(item => !isNaN(parseInt(item)));
    if (body?.length < 1) {
      displayErrorToast('You have not selected any sports');
      return;
    }
    updateFavouriteSportMutation.mutate({favorite_sports: body});
  };

  return (
    <Box>
      <TouchableBox
        onPress={() => {
          navigation?.navigate('SelectSports', {
            selectSport: onSelectAnotherSport,
            from: 'greeting',
          });
        }}
        flexDirection="row"
        borderRadius={10}
        height={40}
        backgroundColor={'primary2'}
        justifyContent="center"
        m="vs"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: 0.5,
          },
          shadowOpacity: 0.15,
          shadowRadius: 2.62,
          elevation: 4,
        }}
        alignItems="center">
        <Box flexDirection="row" justifyContent={'center'} width={wp(80)}>
          <Box flexDirection="row">
            <FastImage
              source={Images?.Running}
              style={{height: 24, width: 24}}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Text numberOfLines={2} variant="blackshade14800" ml={'m'}>
              Select a Sport
            </Text>
          </Box>
        </Box>
      </TouchableBox>
      <Box flexDirection={'row'} flexWrap="wrap" mt={'l'}>
        {sport?.map((data, i) => {
          return (
            <Box
              key={i}
              flexDirection={'row'}
              alignItems={'center'}
              mb={'m'}
              mr={'m'}
              ml={'s'}>
              <Box
                backgroundColor="white"
                style={[styles.mysportChip, TypographyStyles.cardShadow]}>
                <FastImage
                  source={
                    data?.category?.images.length > 0 || data?.images.length > 0
                      ? {uri: data?.category?.images[0] || data?.images[0]}
                      : Images.Tennis
                  }
                  style={{height: wp(5), width: wp(5)}}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text marginHorizontal={'m'} variant={'blackshade14400'}>
                  {data?.category?.name || data?.name}
                </Text>
                <TouchableBox
                  alignItems={'flex-end'}
                  onPress={() =>
                    handleRemoveSport(
                      data?.category?.id ? data?.category?.id : data?.id,
                    )
                  }>
                  {Ionicon('close', wp(5), palette?.blackshade)}
                </TouchableBox>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box height={45} mt="l">
        <Button label="Submit" onPress={onSportSubmit} />
      </Box>
    </Box>
  );
};

export default Sport;
