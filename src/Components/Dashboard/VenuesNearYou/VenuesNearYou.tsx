import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Box, Text, TouchableBox, TypographyStyles} from '../../Theme/Index';
import {size} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../Helpers/responsive-ratio';
import {Images} from '../../../Constant/Image';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {getFacility} from '../../Services/SportFacility';
import {useNavigation} from '@react-navigation/core';
import {getSportComplex} from '../../Services/SportComplex';

const VenuesNearYou = props => {
  const {is_profile} = props;
  const navigation = useNavigation();
  const [list, setlist] = useState([]);
  const [height, setHeight] = useState();

  const location = useSelector(state => state?.auth?.user?.userlocation);
  const loc_lat = location?.location_lat;
  const loc_long = location?.location_long;

  const body = {
    loc_lat: loc_lat,
    loc_long: loc_long,
    start: 0,
    length: is_profile ? 6 : 10,
    order: [
      {
        column: 0,
        dir: 'asc',
      },
    ],
  };

  const vanueList = useQuery(['getSportComplex', body], getSportComplex, {
    enabled: false,
    onSuccess: result => {
      setlist(
        result?.data?.data?.map(i => {
          return {
            ...i,
            flag: false,
          };
        }),
      );
    },
    onError: error => {
      setlist([]);
    },
  });

  useEffect(() => {
    vanueList.refetch();
  }, [loc_lat]);

  const renderItem = useCallback(({item, index}) => {
    const {name, info, facilities, icon, images, flag} = item;

    var g = info && info?.address.split(',');
    const loc = g.splice(g.length - 2).join(',');

    if (is_profile)
      return (
        <Box flex={1}>
          <TouchableBox
            borderRadius={10}
            paddingBottom="m"
            mt="m"
            mb="m"
            ml={'vs'}
            maxWidth={wp(66)}
            style={TypographyStyles.cardShadow}
            backgroundColor="white"
            mr="s"
            onPress={() => {
              navigation.navigate('VenuInfo', {vanue: item});
            }}
            mb={'s'}>
            <FastImage
              source={images ? {uri: images[0]} : Images?.AFAC}
              style={{
                height: wp(30),
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
            <Box
              mt="m"
              p="m"
              overflow="hidden"
              onLayout={event => {
                var {x, y, width, height} = event.nativeEvent.layout;
                setHeight(height);
              }}>
              <Box>
                <Text
                  // style={{width: wp(55)}}
                  numberOfLines={1}
                  variant="blackshade16500">
                  {name}
                </Text>
              </Box>
              <Box>
                <Text
                  style={{width: wp(55)}}
                  numberOfLines={1}
                  variant="blackshade114400"
                  fontSize={12}>
                  {info?.city}, {info?.state}, {info?.postcode}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <FastImage
                  source={Images.VenueStar}
                  style={{height: 12, width: 12}}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text variant="blackshade114400" ml={'s'} fontSize={12}>
                  {info?.rating.toFixed(2)}
                </Text>
                <Text variant="blackshade114400" ml={'m'} fontSize={12}>
                  {info?.reviews_count} ratings
                </Text>
              </Box>
              <Box backgroundColor="tertiary2" height={1} marginVertical="m" />
              <Box
                flexDirection="row"
                flexWrap={flag ? 'wrap' : 'nowrap'}
                // width={wp(50)}
                flex={1}
                alignItems={'center'}
                justifyContent={'space-between'}
                // height={flag ? 'auto'}
              >
                {facilities &&
                  facilities.map((item, index) => {
                    if (index == 0)
                      return item?.categories?.map((data, i) => {
                        if (i == 0)
                          return (
                            <Text
                              variant="blackshade110400"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{maxWidth: wp(30)}}>
                              {data?.category?.name}{' '}
                              {/* {i + 1 < item?.categories?.length &&
                            data?.category != null
                              ? '|'
                              : ''} */}
                            </Text>
                          );
                        // else
                        //   return (
                        //     <Text
                        //       variant="blackshade114500"
                        //       numberOfLines={1}
                        //       ellipsizeMode="tail"
                        //       style={{maxWidth: wp(20)}}>
                        //       {data?.category?.name}{' '}
                        //       {i + 1 < item?.categories?.length &&
                        //       data?.category != null
                        //         ? '|'
                        //         : ''}
                        //     </Text>
                        //   );
                      });
                  })}
                <TouchableBox
                  // mt="s"
                  onPress={() => {
                    const p = list.map((it, ind) => {
                      return {
                        ...it,
                        flag: index == ind ? !item?.flag : false,
                      };
                    });

                    navigation.navigate('VenuInfo', {vanue: item});

                    // setlist(p);
                  }}>
                  <Text textAlign="right" mr="vs" variant={'blackshade110400'}>
                    {flag ? '' : 'View More'}
                  </Text>
                </TouchableBox>
              </Box>

              {/* )} */}
            </Box>
          </TouchableBox>
        </Box>
      );
    else
      return (
        <TouchableBox
          borderRadius={10}
          paddingBottom="m"
          mt="m"
          style={TypographyStyles.cardShadow}
          backgroundColor="white"
          marginHorizontal="l"
          onPress={() => {
            navigation.navigate('VenuInfo', {vanue: item});
          }}
          mb={'s'}>
          <Box flexDirection="row" flex={1}>
            <Box mt="m" style={{width: wp(30), alignItems: 'center'}}>
              <FastImage
                source={images ? {uri: images[0]} : Images?.AFAC}
                style={{height: wp(25), width: wp(25), borderRadius: 10}}
                resizeMode={FastImage?.resizeMode?.stretch}
              />
            </Box>
            <Box
              mt="m"
              overflow="hidden"
              onLayout={event => {
                var {x, y, width, height} = event.nativeEvent.layout;
                setHeight(height);
              }}>
              <Box>
                <Text
                  style={{width: wp(55)}}
                  numberOfLines={2}
                  variant="blackshade14800">
                  {name}
                </Text>
              </Box>
              <Box>
                <Text
                  style={{width: wp(55)}}
                  numberOfLines={2}
                  variant="blackshade114500">
                  {info?.city}, {info?.state}, {info?.postcode}
                </Text>
              </Box>
              <Box flexDirection="row" alignItems="center">
                <FastImage
                  source={Images.VenueStar}
                  style={{height: 15, width: 15}}
                  resizeMode={FastImage?.resizeMode?.contain}
                />
                <Text variant="blackshade114500" ml={'s'}>
                  {info?.rating.toFixed(2)}
                </Text>
                <Text variant="blackshade114500" ml={'m'}>
                  {info?.reviews_count} ratings
                </Text>
              </Box>
              <Box
                backgroundColor="tertiary2"
                height={1}
                // marginHorizontal="m"
              />
              <Box
                flexDirection="row"
                flexWrap={flag ? 'wrap' : 'nowrap'}
                width={wp(51)}
                // height={flag ? 'auto'}
              >
                {facilities &&
                  facilities.map((item, index) => {
                    return item?.categories?.map((data, i) => {
                      if (!flag && i < 1)
                        return (
                          <Text variant="blackshade114500">
                            {data?.category?.name}{' '}
                            {i + 1 < item?.categories?.length &&
                            data?.category != null
                              ? '|'
                              : ''}
                          </Text>
                        );
                      else
                        return (
                          <Text variant="blackshade114500">
                            {data?.category?.name}{' '}
                            {i + 1 < item?.categories?.length &&
                            data?.category != null
                              ? '|'
                              : ''}
                          </Text>
                        );
                    });
                  })}
              </Box>
              {!flag && (
                <TouchableBox
                  mt="s"
                  onPress={() => {
                    const p = list.map((it, ind) => {
                      return {
                        ...it,
                        flag: index == ind ? !item?.flag : false,
                      };
                    });
                    setlist(p);
                  }}>
                  <Text textAlign="right" mr="vs" variant={'blackshade110400'}>
                    {flag ? '' : 'View More'}
                  </Text>
                </TouchableBox>
              )}
            </Box>
          </Box>

          {/* <Box
          flex={1}
          flexDirection="row"
          marginHorizontal="m"
          mt="m"
          justifyContent="center"> */}
          {/* <Box
            style={{width: wp(25)}}
            justifyContent="center"
            alignItems="center">
            <Box flexDirection="row">
              <Text variant="blackshade8800" mt="s" mr={'s'}>
                {info?.currency == 1 ? 'RM' : 'SGD'}
              </Text>
              <Text variant="blackshade16400" fontSize={15}>
                {(facilities && parseInt(facilities[0]?.min_price)) || 0}-
                {(facilities && parseInt(facilities[0]?.max_price)) || 0}
              </Text>
            </Box>
            <Box height={1} backgroundColor="tertiary2" width={40} />
            <Box>
              <Text variant="blackshade16400" fontSize={14}>
                hour
              </Text>
            </Box>
          </Box> */}
          {/* <Box style={{flex: 1}} marginHorizontal="m">
            <TouchableBox
              onPress={() => {
                navigation.navigate('VenuInfo', {vanue: item});
              }}
              flex={1}
              backgroundColor="white"
              height={40}
              borderWidth={1}
              borderColor="primary"
              justifyContent="center"
              alignItems="center"
              borderRadius={10}>
              <Text variant="blackshade14800">Book</Text>
            </TouchableBox>
          </Box> */}
          {/* </Box> */}
        </TouchableBox>
      );
  }, []);

  return (
    <Box flex={1}>
      <FlatList
        style={{flex: 1, marginHorizontal: 20}}
        data={list || []}
        horizontal={is_profile}
        ItemSeparatorComponent={<Box height={10} width={10} />}
        ListEmptyComponent={() => {
          return (
            <Box mt="l" justifyContent="center">
              <Text textAlign={'center'} variant="blackshade16500">
                {vanueList?.isRefetching ? 'Loading...' : 'No Venue Nearby'}
              </Text>
            </Box>
          );
        }}
        renderItem={renderItem}
      />
    </Box>
  );
};

export default memo(VenuesNearYou);
