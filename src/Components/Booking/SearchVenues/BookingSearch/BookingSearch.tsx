import React, {memo, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Image} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';
import {Input, Button} from '../../../ReusableComponents/index';
const AnotherSport = require('../../../../assets/Booking/SearchVenues/AnotherSport/AnotherSport.png');
const Basketball = require('../../../../assets/Booking/SearchVenues/Basketball/Basketball.png');
const Cross = require('../../../../assets/Booking/SearchVenues/Cross/Cross.png');
const CurrentLocation = require('../../../../assets/Booking/SearchVenues/CurrentLocation/CurrentLocation.png');
const Filter = require('../../../../assets/Booking/SearchVenues/Filter/Filter.png');
const HeaderImage = require('../../../../assets/Booking/SearchVenues/HeaderImage/HeaderImage.png');
const LeftArrow = require('../../../../assets/Booking/SearchVenues/LeftArrow/LeftArrow.png');
const Swim = require('../../../../assets/Booking/SearchVenues/Swim/Swim.png');
const Tennis = require('../../../../assets/Booking/SearchVenues/Tennis/Tennis.png');
import Carousel from 'react-native-reanimated-carousel';
import {size} from '../../../Theme/Index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
import TypesOfSports from './TypesOfSports/TypesOfSports';
import TypeOfFacility from './TypesOfFacility/TypesOfFacility';
import Search from './Search/Search';
import {useQuery} from 'react-query';
import {getCategory} from '../../../Services/SportComplex';
import {useDispatch, useSelector} from 'react-redux';
import {AuthConstants, BookingConstants} from '../../../../Redux';
import {
  AntDesignIcon,
  feather,
  Ionicon,
} from '../../../ReusableComponents/Icons';
import {Images} from '../../../../Constant/Image';
import {displayErrorToast} from '../../../../utils';

const BookingSearch = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {category} = useSelector(state => state?.book?.booking);
  const sport = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );

  const [subCat, setSubcat] = useState(null);
  const [mainCat, setMaincat] = useState(sport);

  const [prefState, setPrefState] = useState('-');
  const [prefCity, setPrefCity] = useState('-');
  const [categoryId, setCategoryId] = useState(0);

  /**
   * @function CategoryList
   * @description this function will call the category api
   */

  const CategoryList = useQuery('getCategory', getCategory, {
    onSuccess: result => {
      const d = result?.data.map(item => {
        return {
          ...item,
          flag: false,
        };
      });

      dispatch({
        type: BookingConstants?.CATEGORY,
        category: d,
      });

      // setCateList(result?.data?.data);
    },
    onError: error => {},
  });

  /**
   * @function useEffect
   * @description will refetch the api
   */

  useEffect(() => {
    CategoryList?.refetch();
  }, []);

  const {location} = useSelector(state => state.auth.user);
  const {anothersport} = useSelector(state => state.auth.user);
  /**
   * @function useEffect
   * @description this function will set sub category once vanue have the facilities
   */

  useEffect(() => {
    setSubcat(location?.facilities);
  }, [location]);

  /**
   * @function onSelectFacility
   * @param item
   * @description this function will set flag true which is selected
   */

  const onSelectFacility = item => {
    const list = subCat?.map(i => {
      return {
        ...i,
        flag: i?.name == item?.name ? !i?.flag : i?.flag,
      };
    });
    setSubcat(list);
  };

  /**
   * @function onSelectCategory
   * @param item
   * @description this function will set flag true which is selected
   */

  const onSelectCategory = item => {
    setCategoryId(item?.category?.id);
    dispatch({
      type: AuthConstants?.ANOTHERSPORT,
      anothersport: [],
    });
    const temp = mainCat.map(cat => {
      return {
        ...cat,
        flag: cat?.category?.id == item?.category?.id ? true : false,
      };
    });

    setMaincat(temp);
  };

  /**
   * @function onDeleteAnotherSport
   * @description this dispatch the empty anothersport to the store
   */

  const onDeleteAnotherSport = () => {
    dispatch({
      type: AuthConstants?.ANOTHERSPORT,
      anothersport: [],
    });
  };

  useEffect(() => {
    setMaincat(sport);
    setCategoryId(anothersport[0]?.id);
  }, [anothersport[0]?.id]);

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <FastImage
          source={HeaderImage}
          style={styles.headerImage}
          resizeMode={FastImage?.resizeMode?.stretch}
        />
        <Box zIndex={100} position="absolute" top={40} left={wp(1)}>
          <TouchableBox
            style={{
              padding: 10,
            }}
            onPress={() => {
              navigation.goBack(null);
            }}>
            <Image
              source={LeftArrow}
              style={{
                tintColor: 'white',
                height: 20,
                width: 20,
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
          </TouchableBox>
        </Box>
        <Box
          zIndex={100}
          backgroundColor="white"
          flex={1}
          top={-30}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}>
          <Box flex={1} mt="l" marginHorizontal="l">
            <Text variant="blackshade16600">Type of Sport</Text>
            <Text variant="blackshade114400">
              Which sport facility do you want to book?
            </Text>
            <Box mt="m">
              <TypesOfSports
                TypeOfSportsData={mainCat}
                onSelect={onSelectCategory}
                navigation={navigation}
              />
            </Box>
            <Box>
              <TouchableBox
                onPress={() => {
                  navigation?.navigate('SelectSports', {from: 'booking'});
                }}
                flexDirection="row"
                borderRadius={10}
                height={40}
                backgroundColor={
                  anothersport?.length > 0 ? 'white' : 'primary2'
                }
                justifyContent="center"
                style={TypographyStyles?.cardShadow}
                alignItems="center">
                <Box
                  flexDirection="row"
                  justifyContent={
                    anothersport?.length < 1 ? 'center' : 'space-between'
                  }
                  width={wp(80)}>
                  {anothersport?.length < 1 && (
                    <Image
                      source={AnotherSport}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                  )}
                  <Text
                    textTransform="uppercase"
                    numberOfLines={2}
                    variant="blackshade14800">
                    {anothersport?.length > 0
                      ? anothersport[0]?.name
                      : ' Select another Sport'}
                  </Text>
                </Box>
                {anothersport?.length > 0 && (
                  <TouchableBox onPress={() => onDeleteAnotherSport()}>
                    {Ionicon('close', 20, palette?.blackshade)}
                  </TouchableBox>
                )}
              </TouchableBox>
            </Box>

            <Box mt={'l'}>
              <Text variant={'blackshade16600'}>Venue Location</Text>
              <Text variant={'blackshade14400'} mt={'s'}>
                Select your preference
              </Text>
            </Box>

            <TouchableBox
              mt={'l'}
              borderWidth={0.5}
              borderRadius={5}
              p={'s'}
              backgroundColor={'white'}
              style={{borderColor: palette?.tertiary2}}
              onPress={() => {
                navigation.navigate('SelectState', {
                  setPrefState: setPrefState,
                  setPrefCity: setPrefCity,
                });
              }}>
              <Box
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text ml={'s'} variant={'tertiary14500'}>
                  State
                </Text>
                {AntDesignIcon('down', wp(6), palette?.tertiary1)}
              </Box>
              <Text ml={'s'} mt={'s'} variant={'primary16500'}>
                {prefState}
              </Text>
            </TouchableBox>

            <TouchableBox
              mt={'l'}
              borderWidth={0.5}
              borderRadius={5}
              p={'s'}
              backgroundColor={'white'}
              style={{borderColor: palette?.tertiary2}}
              onPress={() => {
                if (prefState == '-')
                  return displayErrorToast('Select State For Choosing City');
                navigation.navigate('SelectCity', {
                  setPrefCity: setPrefCity,
                  prefState: prefState,
                });
              }}>
              <Box
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text ml={'s'} variant={'tertiary14500'}>
                  City
                </Text>
                {AntDesignIcon('down', wp(6), palette?.tertiary1)}
              </Box>
              <Text ml={'s'} mt={'s'} variant={'primary16500'}>
                {prefCity}
              </Text>
            </TouchableBox>
          </Box>
          {/* <Box flexGrow={1} justifyContent="flex-end" mt={'l'}> */}
          <Box height={46} marginHorizontal="l" mt={'l'}>
            <Button
              label="Search Venues"
              onPress={() => {
                navigation.navigate('SearchResults', {
                  category_id: categoryId,
                  prefCity: prefCity,
                  prefState: prefState,
                });
              }}
            />
          </Box>
          {/* </Box> */}
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  headerImage: {
    height: wp(51),
    width: wp(100),
  },
});

export default BookingSearch;
