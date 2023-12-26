import React, {memo, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
  fonts,
} from '../../../Theme/Index';
import {Button, Header} from '../../../ReusableComponents/index';
const CurrentLocation = require('../../../../assets/Booking/SearchVenues/CurrentLocation/CurrentLocation.png');
const Logo = require('../../../../assets/Booking/SearchResults/Logo/Logo.png');
const Logo1 = require('../../../../assets/Booking/SearchResults/Logo1/Logo1.png');
const Logo2 = require('../../../../assets/Booking/SearchResults/Logo2/Logo2.png');
const Filter = require('../../../../assets/Booking/SearchVenues/Filter/Filter.png');
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
const Star = require('../../../../assets/Home/Star/Star.png');
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {getFacility} from '../../../Services/SportFacility';
import {useQuery} from 'react-query';
import LoadingOverlay from '../../../ReusableComponents/LoadingOverlay';

import Menu, {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from '../../../ReusableComponents/popup-menu/src';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {getSportComplex} from '../../../Services/SportComplex';
import {Ionicon} from '../../../ReusableComponents/Icons';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {Images} from '../../../../Constant/Image';

const SearchResults = ({navigation, route, TypeOfSportsData}) => {
  const {category_id, prefCity, prefState} = route?.params;
  const [list, setlist] = useState([]);
  const [loader, setloader] = useState(false);
  const [popup, setPopup] = useState(false);
  const [facility, setFacility] = useState([]);
  const [facilityId, setFacilityId] = useState(0);
  const [temp, setTemp] = useState([]);

  const body = {
    start: 0,
    length: 10,
    order: [
      {
        column: 0,
        dir: 'asc',
      },
    ],
    category_id: category_id,
    state: prefState,
    city: prefCity,
  };

  const vanueList = useQuery(['getSportComplex', body], getSportComplex, {
    enabled: false,
    onSuccess: result => {
      setlist(result?.data?.data);
    },
    onError: error => {
      setlist([]);
    },
  });

  /**
   * @function useEffect
   * @description will refetch the vanuelist
   */

  useEffect(() => {
    vanueList?.refetch();
  }, []);

  const getCheapest = () => {
    setTemp(
      list.sort(
        (obj1, obj2) =>
          obj1?.facilities[0]?.min_price - obj2?.facilities[0]?.min_price,
      ),
    );
    setloader(false);
  };

  const getNearest = () => {
    vanueList?.refetch();
  };

  const sortAlphabetical = () => {
    setTemp(
      list.sort((a, b) => (a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0)),
    );
    setloader(false);
  };

  if (vanueList?.isFetching || loader) return <LoadingOverlay />;
  else
    return (
      <Box flex={1} backgroundColor="white">
        <MenuProvider style={{flex: 1}}>
          <Box style={{flexGrow: 1}}>
            <Header navigation={navigation} title="Venues" left />
            {popup && (
              <TouchableBox
                onPress={() => {
                  setPopup(false);
                  setFacility([]);
                  setFacilityId(0);
                }}
                style={[styles.overLay]}
              />
            )}
            <ScrollView style={{flex: 1, marginBottom: 20}}>
              <Box flexGrow={1}>
                <Box
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row"
                  marginHorizontal="l"
                  mt="l">
                  <Box>
                    <Text
                      textDecorationLine="underline"
                      variant="blackshade116500">
                      {list?.length || 0} Venue(s) found
                    </Text>
                  </Box>
                  {/* 
                <TouchableBox>
                  <FastImage
                    source={Filter}
                    style={{
                      height: 40,
                      width: 40,
                    }}
                    resizeMode={FastImage?.resizeMode?.contain}
                  />
                </TouchableBox> */}
                  <Menu>
                    <MenuTrigger>
                      <FastImage
                        source={Filter}
                        style={{
                          height: 40,
                          width: 40,
                        }}
                        resizeMode={FastImage?.resizeMode?.contain}
                      />
                    </MenuTrigger>
                    <MenuOptions
                      customStyles={{optionText: styles.text}}
                      style={{
                        backgroundColor: '#FFEEE6',
                        padding: 5,
                      }}>
                      <MenuOption
                        onSelect={() => getNearest()}
                        text="Nearest"
                      />
                      <Box
                        style={{
                          marginVertical: 5,
                          marginHorizontal: 5,
                          borderBottomWidth: 1,
                          borderColor: '#E5E5E5',
                        }}
                      />
                      <MenuOption
                        onSelect={() => {
                          setloader(true);
                          getCheapest();
                        }}
                        text="Cheapest"
                      />
                      <Box
                        style={{
                          marginVertical: 5,
                          marginHorizontal: 5,
                          borderBottomWidth: 1,
                          borderColor: '#E5E5E5',
                        }}
                      />
                      <MenuOption
                        onSelect={() => {
                          setloader(true);
                          sortAlphabetical();
                        }}
                        text="Alphabetical (A to Z)"
                      />
                    </MenuOptions>
                  </Menu>
                </Box>
                <Box mt="l" mb="l">
                  <FlatList
                    contentContainerStyle={{paddingBottom: 20}}
                    data={temp.length > 0 ? temp : list}
                    ListEmptyComponent={() => {
                      return (
                        <Box
                          mt="xxl"
                          pt="xxl"
                          justifyContent="center"
                          marginHorizontal={'l'}>
                          <Text textAlign={'center'} variant="blackshade16500">
                            No Venues Found
                          </Text>
                          <Text
                            textAlign={'center'}
                            variant="blackshade112400"
                            mt="l">
                            Sorry, the keyword you entered cannot be found.{' '}
                            {'\n'}
                            please check again or search with another keyword
                          </Text>
                        </Box>
                      );
                    }}
                    renderItem={({item}) => {
                      const {name, facilities, info, images, icon} = item;
                      return (
                        <TouchableBox
                          borderRadius={10}
                          paddingBottom="m"
                          mt="l"
                          backgroundColor="white"
                          marginHorizontal="l"
                          onPress={() => {
                            navigation.navigate('VenuInfo', {
                              vanue: item,
                            });
                          }}
                          style={TypographyStyles.cardShadow}>
                          <Box flexDirection="row" flex={1}>
                            <Box mt="m" ml="m" flex={0.3}>
                              <FastImage
                                source={icon ? {uri: icon} : Images?.AFAC}
                                style={{height: wp(20), width: wp(20)}}
                                resizeMode={FastImage?.resizeMode?.contain}
                              />
                            </Box>
                            <Box mt="m" ml="m" flex={0.8}>
                              <Box width={'95%'}>
                                <Text
                                  numberOfLines={2}
                                  variant="blackshade14800">
                                  {name}
                                </Text>
                              </Box>
                              <Box width={size.width / 1.8}>
                                <Text
                                  numberOfLines={2}
                                  variant="blackshade114500">
                                  {info?.city}, {info?.state}, {info?.postcode}
                                </Text>
                              </Box>
                              <Box flexDirection="row" alignItems="center">
                                <Text variant="blackshade114500">
                                  {info?.rating.toFixed(2)}
                                </Text>
                                <FastImage
                                  source={Star}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    marginLeft: 5,
                                    top: -2,
                                  }}
                                  resizeMode={FastImage?.resizeMode?.contain}
                                />
                                <Text ml={'s'} variant="blackshade114500">
                                  {info?.reviews_count} ratings
                                </Text>
                              </Box>
                              <Box
                                flexDirection="row"
                                flexWrap="wrap"
                                width={wp(51)}>
                                {facilities &&
                                  facilities.map((item, index) => {
                                    return item?.categories?.map((data, i) => {
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
                            </Box>
                          </Box>
                          <Box
                            backgroundColor="tertiary2"
                            height={1}
                            marginHorizontal="m"
                          />
                          <Box
                            flex={1}
                            flexDirection="row"
                            marginHorizontal="m"
                            mt="m"
                            justifyContent="center">
                            <Box
                              flex={1}
                              justifyContent="center"
                              alignItems="center">
                              <Box flexDirection="row">
                                <Box flexDirection="row">
                                  <Text variant="blackshade8800" mt="s">
                                    RM
                                  </Text>
                                  <Text
                                    variant="blackshade16800Regular"
                                    ml={'s'}>
                                    {`${
                                      parseInt(facilities[0]?.min_price) || 0
                                    }-${
                                      parseInt(facilities[0]?.max_price) || 0
                                    }`}
                                  </Text>
                                </Box>
                              </Box>
                              <Box
                                height={1}
                                backgroundColor="tertiary2"
                                width={40}
                              />
                              <Box>
                                <Text variant="blackshade16800Regular">
                                  hour
                                </Text>
                              </Box>
                            </Box>
                            <Box flex={2.5} marginHorizontal="m">
                              <TouchableBox
                                onPress={() => {
                                  setPopup(true);
                                  setFacility(item);
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
                            </Box>
                          </Box>
                        </TouchableBox>
                      );
                    }}
                  />
                </Box>
              </Box>
            </ScrollView>
          </Box>
        </MenuProvider>
        {popup && (
          <Box backgroundColor={'white'} style={styles.confirmationModal}>
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
          </Box>
        )}
      </Box>
    );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
  text: {
    fontWeight: '400',
    fontFamiy: fonts?.regular,
    color: palette?.blackshade,
    fontSize: 16,
  },
  overLay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay,
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    zIndex: 5,
  },
});

export default SearchResults;
