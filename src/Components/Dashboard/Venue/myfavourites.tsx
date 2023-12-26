import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, FlatList, Keyboard} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Button} from '../../ReusableComponents';
import {Ionicon} from '../../ReusableComponents/Icons';
import RadioButton from '../../ReusableComponents/RadioButton';
import {Shimmer} from '../../ReusableComponents/index';
import {getSportComplex} from '../../Services/SportComplex';
import {
  Box,
  palette,
  size,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../Theme/Index';
import {LazyImage} from '../../ReusableComponents';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MyFavourite = props => {
  const progress = useSharedValue(0);
  const {body} = props;

  const navigation = useNavigation();
  const [list, setlist] = useState([]);
  const [popup, setPopup] = useState(false);
  const [facility, setFacility] = useState([]);
  const [facilityId, setFacilityId] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useSelector(state => state?.auth?.user?.userlocation);
  const loc_lat = location?.location_lat;

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
  }, [loc_lat, body]);

  return (
    <Box flex={1} backgroundColor={'white'}>
      {popup && (
        <TouchableBox
          onPress={() => {
            setPopup(false);
            setFacility([]);
            setFacilityId(0);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.overlay,
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}
        />
      )}
      <FlatList
        estimatedItemSize={70}
        data={list}
        ListEmptyComponent={() => {
          return (
            <Box mt="l" justifyContent="center">
              {list.length === 0 && !loading ? (
                <Text textAlign={'center'} variant="blackshade16500">
                  {'No Venue Nearby'}
                </Text>
              ) : (
                <Box flex={1} paddingHorizontal="m">
                  <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    showsVerticalScrollIndicator={false}>
                    {[0, 0, 0, 0].map((item, index) => {
                      return (
                        <Animated.View
                          entering={FadeIn.delay(100 * index)}
                          exiting={FadeOut.delay(150 * index)}>
                          <Box
                            mb="m"
                            key={index.toString()}
                            borderRadius={12}
                            backgroundColor="white"
                            overflow="hidden"
                            style={TypographyStyles.cardShadow}
                            margin="s">
                            <Box ml="m" flexDirection="row">
                              <Shimmer height={92} width={92} />
                              <Box ml="m">
                                <Shimmer
                                  height={20}
                                  width={size.width / 2}
                                  borderRadius={5}
                                />
                                <Shimmer
                                  style={{marginTop: 10}}
                                  height={20}
                                  width={size.width / 2.3}
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

                            <Box ml="m">
                              <Shimmer
                                height={15}
                                width={size.width / 2}
                                borderRadius={5}
                                style={{marginTop: 10}}
                              />

                              <Box mt="xs" />
                              <Shimmer
                                style={{marginTop: 15}}
                                height={2}
                                width={size.width}
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
        renderItem={({item, index}) => {
          const {name, info, facilities, icon, images, flag} = item;
          var g = info && info?.address.split(',');
          const loc = g.splice(g.length - 3).join(',');
          return (
            <TouchableBox
              borderRadius={10}
              paddingBottom="m"
              mt="l"
              style={TypographyStyles.cardShadow}
              backgroundColor="white"
              marginHorizontal="l"
              onPress={() => {
                navigation.navigate('VenuInfo', {vanue: item});
              }}>
              <Box
                flexDirection="row"
                flex={1}
                overflow="hidden"
                style={{
                  marginRight: 15,
                }}>
                <Animated.View sharedTransitionTag={item.id.toString()}>
                  <Box mt="m" style={{width: wp(30)}}>
                    <LazyImage
                      source={images ? {uri: images[0]} : Images?.AFAC}
                      style={{
                        height: wp(25),
                        width: wp(25),
                        borderRadius: 10,
                        marginLeft: 10,
                      }}
                      resizeMode={FastImage?.resizeMode?.stretch}
                    />
                  </Box>
                </Animated.View>
                <Box mt="m">
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
                      style={{height: 15, width: 15, top: wp(-1)}}
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
                    marginVertical="s"
                  />
                  <Box
                    flexDirection="row"
                    flexWrap={flag ? 'wrap' : 'nowrap'}
                    width={wp(51)}>
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
                      <Text
                        textAlign="right"
                        mr="vs"
                        variant={'blackshade110400'}>
                        {flag ? '' : 'View More'}
                      </Text>
                    </TouchableBox>
                  )}
                </Box>
              </Box>
            </TouchableBox>
          );
        }}
      />
      {popup && (
        <Box
          backgroundColor={'white'}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 10,
            zIndex: 5,
          }}>
          <ScrollView>
            <Box
              backgrounColor={'white'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              marginHorizontal={'l'}
              marginVertical={'l'}>
              <Text variant={'blackshade20500'}>Facility type</Text>
              <TouchableBox
                onPress={() => {
                  setPopup(false);
                  setFacility([]);
                  setFacilityId(0);
                }}>
                {Ionicon('close', 20, palette?.blackshade)}
              </TouchableBox>
            </Box>
            <Text variant={'blackshade16400'} ml={'l'} mb={'l'}>
              Choose one option
            </Text>
            <Box>
              {facility?.facilities.length > 0 &&
                facility?.facilities.map(data => {
                  return (
                    data?.name && (
                      <TouchableBox key={data?.id} ml={'l'} mb={'m'}>
                        <RadioButton
                          text={data?.name}
                          selected={facilityId === data.id}
                          onPress={() => setFacilityId(data.id)}
                          radio={true}
                        />
                      </TouchableBox>
                    )
                  );
                })}
            </Box>
            <Box height={45} marginHorizontal={'l'} mt={'l'} mb={'m'}>
              <Button
                label="Book"
                onPress={() => {
                  navigation.navigate('CheckAvailability', {
                    vanue: facility,
                    facility_id: facilityId,
                  });
                }}
                disabled={facilityId == 0}
              />
            </Box>
            <TouchableBox
              style={{alignItems: 'center', marginBottom: wp(2)}}
              onPress={() => {
                navigation.navigate('VenuInfo', {
                  vanue: facility,
                });
              }}>
              <Text variant="blackshade14400" marginVertical={'s'}>
                View more Venue’s details
              </Text>
            </TouchableBox>
          </ScrollView>
        </Box>
      )}
    </Box>
  );
};

export default MyFavourite;
