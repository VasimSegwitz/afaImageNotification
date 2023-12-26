import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useReducer, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
// import Search from './Search/Search';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import AuthConstants from '../../../Redux/AuthConstants';
import {displayErrorToast} from '../../../utils';
import ActivitiesUpcoming from '../../Dashboard/ActivitiesUpcoming/ActivitiesUpcoming';
import {wp} from '../../Helpers/responsive-ratio';
import {Ionicon} from '../../ReusableComponents/Icons';
import {Header} from '../../ReusableComponents/index';
import {getSearchActivity} from '../../Services/Booking';
import {getSportComplex} from '../../Services/SportComplex';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import styles from './styles';
import Geocoder from 'react-native-geocoding';
import {googleApiKey} from '../../Helpers/constants';
import {Call} from '../../ReusableComponents/Icons';
import {LoadingOverlay} from '../../ReusableComponents/index';
import Menu, {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from '../../ReusableComponents/popup-menu/src';

const DATA = [
  {
    id: 1,
    name: 'Badminton',
  },
  {
    id: 2,
    name: 'setapak badminton',
  },
  {
    id: 3,
    name: 'yosin sport court',
  },
];

const SelectedData = [
  {
    id: 1,
    name: 'Badminton Single',
    date: '24 July, 10:30 AM',
    add: 'X-park Bandar Sri Sendayan',
  },
  {
    id: 2,
    name: 'Sunday badminton @Danau kota',
    date: '30 July, 10:30 PM',
    add: 'Danau kota Court',
  },
  {
    id: 3,
    name: 'Bare Foot Running',
    date: '24 July, 10:30 AM',
    add: 'Titi Wangsa',
  },
];

const DashboardSearch = ({navigation, route, TypeOfSportsData, ...props}) => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const {filterBody} = route?.params;
  const {sport, location} = useSelector(state => state.auth.user);
  const [subCat, setSubcat] = useState(null);
  const [filterData, setFilterData] = useState(filterBody);

  const recentLocation =
    useSelector(state => state.auth.user.recentLocation) || [];

  const [body, setBody] = useState({
    start: 0,
    length: 50,
    search: search,
    order: [
      {
        column: 0,
        dir: 'asc',
      },
    ],
  });

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      activity: [],
      showList: false,
      isLoading: false,
      result: false,
    },
  );

  /**
   * @function onPlaceSelect
   * @description this function will set when place will be selected
   */

  const onPlaceSelect = passedPlace => {
    const name = passedPlace?.name
      ? passedPlace?.name
      : passedPlace?.info?.address !== ',' && passedPlace?.info?.address;

    setSubcat(passedPlace?.facilities);

    Geocoder.from(name)
      .then(json => {
        var location = json.results[0].geometry.location;

        const ps = {
          ...passedPlace,
          location_lat: location?.lat,
          location_long: location?.lng,
          name: name,
        };

        dispatch({
          type: AuthConstants?.LOCATION,
          location: ps,
        });
        Keyboard.dismiss();
        setTimeout(() => {
          navigation.navigate('VenuInfo', {
            vanue: passedPlace,
          });
        }, 200);
      })
      .catch(error => {
        Keyboard.dismiss();
        setTimeout(() => {
          navigation.navigate('VenuInfo', {
            vanue: passedPlace,
          });
        }, 200);

        console.warn(error);
      });

    dispatch({
      type: AuthConstants?.RECENTLOCATION,
      recentLocation: [passedPlace, ...recentLocation],
    });
  };

  /**
   * @function onChange
   * @description this function will set the search word to variable
   */

  const onChange = e => {
    setFilterData(null);

    setSearch(e);

    let filteredData = SelectedData.filter(item =>
      item.name.toUpperCase().includes(e.toUpperCase()),
    );

    setBody({
      ...body,
      search: e,
    });

    setState({
      places: filteredData,
    });
  };

  const setBodyNow = b => {
    setFilterData(null);
    const c = JSON.parse(JSON.stringify(b));

    setBody({
      ...body,
      ...c,
    });
  };

  /**
   * @function useEffect
   * @description this will call first time
   */

  useEffect(() => {
    getList.refetch();
  }, []);

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const payload = filterData
    ? {
        ...filterData,
        start: 0,
        length: 50,
        order: [
          {
            column: 0,
            dir: 'asc',
          },
        ],
      }
    : body;

  const getList = useQuery(['getSportComplex', payload], getSportComplex, {
    // enabled: false,
    onSuccess: result => {
      setState({
        activity: result?.data?.data,
      });
    },
    onError: error => {},
  });

  const getCheapest = () => {
    const temp = state?.activity.sort(
      (obj1, obj2) =>
        obj1?.facilities[0]?.min_price - obj2?.facilities[0]?.min_price,
    );
    setState({isLoading: false});
    setState({activity: temp});
  };

  const getNearest = () => {
    getList?.refetch();
  };

  const sortAlphabetical = () => {
    setState({
      activity: state?.activity.sort((a, b) =>
        a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0,
      ),
    });
    setState({isLoading: false});
  };

  const loc = useSelector(state => state?.auth?.user?.userlocation);
  const handleNavigation = async (endLat, endLong) => {
    const startLat = loc?.location_lat;
    const startLong = loc?.location_long;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLong}&destination=${endLat},${endLong}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
    } catch (error) {}
  };

  return (
    // <Box backgroundColor="white">
    <Box style={{flexGrow: 1, flex: 1, paddingBottom: wp(35)}}>
      <MenuProvider style={{flex: 1}}>
        {/* <Box> */}
        <Header
          searchbar
          placeholder={'Venue Name, Location or Sport'}
          placeholderTextColor={palette?.placeholder}
          navigation={navigation}
          onChange={onChange}
          searchValue={search}
          // filter
          // primary
          // onFilter={() => navigation.navigate('ActivityFilter')}
          // renderRightComponent={() => (
          //   <TouchableBox
          //     onPress={() => {
          //       search?.length < 1
          //         ? navigation.navigate('ActivityFilter', {
          //             onSelectData: setBodyNow,
          //           })
          //         : setSearch('');
          //     }}
          //     style={styles.filter}>
          //     <Box>
          //       {search?.length < 1 ? (
          //         <FastImage
          //           source={Images.OptionsGray}
          //           style={{height: wp(5), width: wp(5)}}
          //           resizeMode={'contain'}
          //         />
          //       ) : (
          //         Ionicon('close', wp(5), palette?.border)
          //       )}
          //     </Box>
          //   </TouchableBox>
          // )}
        />
        {state?.activity?.length > 0 && (
          <Box mt="l" marginHorizontal="l">
            <TouchableBox
              justifyContent={'center'}
              alignItems="center"
              style={{
                marginLeft: wp(-1),
              }}
              width={wp(15)}>
              <Text variant={'blackshade16500'}>Venue</Text>
              <Box
                borderBottomWidth={3}
                width={30}
                borderBottomColor="primary"
              />
            </TouchableBox>
            <Box mt="l" flexDirection="row" justifyContent="space-between">
              <Text variant="blackshade116500">
                {state?.activity?.length} Venue(s) found
              </Text>
              <Box flexDirection={'row'} alignItems="center">
                <TouchableBox
                  onPress={() => {
                    navigation.navigate('VenueFilter', {
                      onSelectData: setBodyNow,
                    });
                  }}>
                  <FastImage
                    source={Images.Options}
                    style={{height: wp(5), width: wp(5), marginRight: 10}}
                    resizeMode={'contain'}
                  />
                </TouchableBox>

                <Menu>
                  <MenuTrigger>
                    <FastImage
                      source={Images?.filter}
                      style={{
                        height: wp(5),
                        width: wp(5),
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
                    <MenuOption onSelect={() => getNearest()} text="Nearest" />
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
                        setState({isLoading: true});
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
                        setState({isLoading: true});
                        sortAlphabetical();
                      }}
                      text="Alphabetical (A to Z)"
                    />
                  </MenuOptions>
                </Menu>

                {/* <TouchableBox
                onPress={() => {
                  dispatch({
                    type: AuthConstants?.RECENTLOCATION,
                    recentLocation: [],
                  });
                }}>
                <FastImage
                  source={Images?.filter}
                  style={{height: wp(5), width: wp(5)}}
                  resizeMode={'contain'}
                />
              </TouchableBox> */}
              </Box>
            </Box>
          </Box>
        )}

        {search?.length < 1 && state?.activity?.length < 1 ? (
          <Box>
            <Box
              mt="l"
              flexDirection="row"
              marginHorizontal="l"
              justifyContent="space-between">
              <Text variant="blackshade16500">RECENT SEARCHES</Text>
              <TouchableBox
                onPress={() => {
                  dispatch({
                    type: AuthConstants?.RECENTLOCATION,
                    recentLocation: [],
                  });
                }}>
                <Text variant="primary14500">Clear</Text>
              </TouchableBox>
            </Box>
            <Box mt="l">
              <FlatList
                ItemSeparatorComponent={() => {
                  return (
                    <Box
                      backgroundColor="tertiary2"
                      marginHorizontal="l"
                      height={2}
                      marginVertical="m"
                    />
                  );
                }}
                data={recentLocation.filter(
                  (v, i, a) => a.findIndex(v2 => v2.id === v.id) === i,
                )}
                renderItem={({item}) => {
                  const {name, info} = item;
                  return (
                    <TouchableBox
                      key={`place-${item.place_id || item.id}`}
                      // style={[styles.place, this.props.stylesItem]}
                      onPress={() => onPlaceSelect(item)}>
                      <Box marginHorizontal="l">
                        <Text variant="blackshade14400">
                          {name ? name : ''}
                        </Text>
                        <Text variant="tertiary412400">
                          {info?.address !== ',' ? info?.address : '-'}
                        </Text>
                      </Box>
                    </TouchableBox>
                  );
                }}
              />
            </Box>
          </Box>
        ) : getList?.isFetching ? (
          <LoadingOverlay />
        ) : (
          <Box mt={'l'}>
            <FlatList
              style={{
                flexGrow: 1,

                paddingBottom: 50,
              }}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              ItemSeparatorComponent={() => {
                if (state?.result) return null;
                else
                  return (
                    <Box
                      backgroundColor="tertiary2"
                      marginHorizontal="l"
                      height={2}
                      marginVertical="m"
                    />
                  );
              }}
              ListEmptyComponent={() => {
                return (
                  !getList?.isFetching &&
                  state?.activity?.length < 1 && (
                    <Box
                      mt="xxl"
                      pt="xxl"
                      justifyContent="center"
                      marginHorizontal={'l'}>
                      <Text textAlign={'center'} variant="blackshade16500">
                        No Result Found
                      </Text>
                      <Text
                        textAlign={'center'}
                        variant="blackshade112400"
                        mt="l">
                        Sorry, the keyword you entered cannot be found. Please
                        check again or search with another keyword
                      </Text>
                    </Box>
                  )
                );
              }}
              data={state?.activity}
              renderItem={({item}) => {
                const {name, info} = item;
                if (state.activity?.length > 0)
                  return (
                    <Box
                      flexDirection={'row'}
                      justifyContent="space-between"
                      width={wp(100) - 40}>
                      <TouchableBox
                        width={wp(80)}
                        key={`place-${item.place_id || item.id}`}
                        // style={[styles.place, this.props.stylesItem]}
                        onPress={() => onPlaceSelect(item)}>
                        <Box marginHorizontal="l">
                          <Text variant="blackshade14400">
                            {name ? name : ''}
                          </Text>
                          <Text variant="tertiary412400">
                            {info?.address !== ',' ? info?.address : '-'}
                          </Text>
                        </Box>
                      </TouchableBox>
                      <TouchableBox
                        onPress={() =>
                          handleNavigation(
                            item?.location_lat,
                            item?.location_long,
                          )
                        }>
                        {Call('', 'near-me', 20, palette?.black)}
                      </TouchableBox>
                    </Box>
                  );
                else
                  return (
                    <TouchableBox
                      key={`place-${item.place_id || item.id}`}
                      // style={[styles.place, this.props.stylesItem]}
                      onPress={() => onPlaceSelect(item)}>
                      <Box marginHorizontal="l">
                        <Box flexDirection={'row'}>
                          <FastImage
                            source={Images?.cal}
                            style={{
                              height: wp(5),
                              width: wp(5),
                              marginRight: 10,
                            }}
                            resizeMode="contain"
                          />
                          <Box>
                            <Text variant="blackshade16500">{name}</Text>

                            <Text variant="blackshade114400">{name}</Text>
                            <Text variant="blackshade114400">{name}</Text>
                          </Box>
                        </Box>
                      </Box>
                    </TouchableBox>
                  );
              }}
            />
          </Box>
        )}
        {/* </Box> */}
        {/* </SafeAreaView> */}
      </MenuProvider>
    </Box>
  );
};

export default DashboardSearch;

DashboardSearch.propTypes = {
  clearQueryOnSelect: PropTypes.bool,
  contentScrollViewBottom: PropTypes.node,
  contentScrollViewTop: PropTypes.node,
  stylesInput: PropTypes.object,
  stylesContainer: PropTypes.object,
  stylesList: PropTypes.object,
  stylesItem: PropTypes.object,
  stylesItemText: PropTypes.object,
  stylesLoading: PropTypes.object,
  resultRender: PropTypes.func,
  query: PropTypes.string,
  queryFields: PropTypes.string,
  queryCountries: PropTypes.array,
  queryTypes: PropTypes.string,
  querySession: PropTypes.string,
  searchRadius: PropTypes.number,
  searchLatitude: PropTypes.number,
  searchLongitude: PropTypes.number,
  googleApiKey: PropTypes.string.isRequired,
  placeHolder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  iconResult: PropTypes.any,
  iconInput: PropTypes.any,
  language: PropTypes.string,
  onSelect: PropTypes.func,
  onChangeText: PropTypes.func,
  requiredCharactersBeforeSearch: PropTypes.number,
  requiredTimeBeforeSearch: PropTypes.number,
};

DashboardSearch.defaultProps = {
  stylesInput: {},
  stylesContainer: {},
  stylesList: {},
  stylesItem: {},
  stylesLoading: {},
  stylesItemText: {},
  queryFields: 'formatted_address,geometry,name',
  placeHolder: 'Search places...',
  placeholderTextColor: '#000000',
  textInputProps: {},
  language: 'en',
  resultRender: place => place.description,
  requiredCharactersBeforeSearch: 2,
  requiredTimeBeforeSearch: 1000,
};
