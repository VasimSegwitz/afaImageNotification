import React, {useEffect, useState} from 'react';
import {ScrollView, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import ActivitiesUpcoming from '../../Dashboard/ActivitiesUpcoming/ActivitiesUpcoming';
import {wp} from '../../Helpers/responsive-ratio';
import {getActivity} from '../../Services/ProfileApi';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import styles from './styles';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Shimmer} from '../../ReusableComponents/index';

const ActivityUpcoming = () => {
  const isFocused = useIsFocused();
  const sports_data = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState(sports_data);
  const initialActivityState = {transaction_data: [], new_transaction_data: []};
  const [activity, setActivity] = useState(initialActivityState);
  const [pagecount, setPageCount] = useState(1);
  const [sportId, setSportId] = useState(0);
  const handleSportsLevel = id => {
    setSportId(id);
    const d = sport?.map(i => {
      return {
        ...i,
        flag: i?.category?.id == id,
      };
    });

    setSport(d);
  };

  const reqBody = {status: 1, per_page: 5, page: pagecount};
  const getActivityQuery = useQuery(['getActivity', reqBody], getActivity, {
    onSuccess: result => {
      setLoading(false);
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm');
      setActivity({
        ...activity,
        transaction_data:
          activity.transaction_data.concat(
            (result?.data?.data).filter(data => data.date >= currentDate),
          ) || [],
        new_transaction_data: result?.data?.data || [],
      });
    },
    onError: error => {
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    setPageCount(1);
    setActivity({...activity, transaction_data: [], new_transaction_data: []});
    getActivityQuery.refetch();
  }, [isFocused]);

  const renderItem = items => {
    return (
      <Box marginHorizontal={'m'} mb={'l'}>
        <ActivitiesUpcoming showGoing={false} data={items.item} />
      </Box>
    );
  };

  const handleOnEndReached = () =>
    activity.new_transaction_data.length >= 5 && setPageCount(pagecount + 1);

  return (
    <Box backgroundColor={'white'} flex={1}>
      <Box alignItems={'flex-start'}>
        <ScrollView
          horizontal={true}
          style={{
            marginLeft: wp(3),
            marginVertical: wp(5),
          }}
          showsHorizontalScrollIndicator={false}>
          {sport?.length > 1
            ? sport.map((data, i) => {
                return (
                  <Box key={i} flexDirection={'row'} mb={'m'} mr={'m'} ml={'s'}>
                    <TouchableBox
                      backgroundColor="white"
                      style={[
                        styles.mysportChip,
                        TypographyStyles.cardShadow,
                        {
                          borderColor: palette?.primary,
                          borderWidth: data?.flag ? 1 : 0,
                        },
                      ]}
                      onPress={() => handleSportsLevel(data?.category?.id)}>
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
                          {
                            activity.transaction_data?.filter(
                              item =>
                                item?.setting?.category_id ==
                                data?.category?.id,
                            )?.length
                          }
                        </Text>
                      </Box>
                    </TouchableBox>
                  </Box>
                );
              })
            : null}
        </ScrollView>
      </Box>
      <Text
        style={{marginLeft: wp(3), marginBottom: wp(4)}}
        variant={'blackshade116500Regular'}>
        {sportId
          ? activity.transaction_data?.filter(
              item => item?.setting?.category_id == sportId,
            )?.length
          : activity.transaction_data.length}{' '}
        Activities
      </Text>

      <Box flex={1}>
        <FlatList
          data={
            sportId
              ? activity.transaction_data?.filter(
                  item => item?.setting?.category_id == sportId,
                )
              : activity.transaction_data
          }
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={handleOnEndReached}
          ListEmptyComponent={() => {
            return (
              <Box flex={1}>
                {activity.transaction_data.length === 0 && !loading ? (
                  <Box
                    height={size?.height / 2}
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Text variant="blackshade16500">
                      No Upcoming Activities
                    </Text>
                  </Box>
                ) : (
                  <Box flex={1} paddingHorizontal="m">
                    <ScrollView
                      contentContainerStyle={{flexGrow: 1}}
                      showsVerticalScrollIndicator={false}>
                      {[0, 0, 0, 0, 1, 1].map((item, index) => {
                        return (
                          <Animated.View
                            entering={FadeIn.delay(100 * index)}
                            exiting={FadeOut.delay(150 * index)}>
                            <Box
                              borderWidth={1}
                              mb="m"
                              key={index.toString()}
                              borderRadius={12}
                              backgroundColor="white"
                              overflow="hidden"
                              style={[
                                {borderColor: '#ebebeb'},
                                TypographyStyles.cardShadow,
                              ]}>
                              <Box
                                mt="l"
                                marginHorizontal="s"
                                ml="m"
                                flexDirection="row">
                                <Box>
                                  <Shimmer height={80} width={40} />
                                </Box>
                                <Box ml="m">
                                  <Shimmer
                                    height={20}
                                    width={size.width / 1.5}
                                    borderRadius={5}
                                  />
                                  <Shimmer
                                    style={{marginTop: 10}}
                                    height={20}
                                    width={size.width / 1.3}
                                    borderRadius={5}
                                  />
                                  <Shimmer
                                    style={{marginTop: 10}}
                                    height={20}
                                    width={size.width / 3}
                                    borderRadius={5}
                                  />
                                </Box>
                              </Box>
                              <Box
                                marginHorizontal="m"
                                mb="m"
                                justifyContent="center"
                                alignItems="center">
                                <Shimmer
                                  style={{marginTop: 15}}
                                  height={40}
                                  width={size.width / 1.3}
                                  borderRadius={5}
                                />
                              </Box>
                            </Box>
                          </Animated.View>
                        );
                      })}
                    </ScrollView>
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default ActivityUpcoming;
