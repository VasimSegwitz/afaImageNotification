import Geolocation from '@react-native-community/geolocation';
import PropTypes from 'prop-types';
import React, {useEffect, useReducer, useState} from 'react';
import {FlatList, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../Constant/Image';
import AuthConstants from '../../../Redux/AuthConstants';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {Header} from '../../ReusableComponents/index';
import {getSportComplex} from '../../Services/SportComplex';
import {Box, palette, Text, TouchableBox} from '../../Theme/Index';
import Geocoder from 'react-native-geocoding';
import {googleApiKey} from '../../Helpers/constants';
import {editProfile} from '../../Services/ProfileApi';
import authStore from '../../../Zustand/store';

const SelectLocation = ({navigation, route, TypeOfSportsData, ...props}) => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const askLoc = authStore(state => state.askLoc.askLoc);

  const [pemission, setPermis] = useState(false);

  const [search, setSearch] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const recentLocation =
    useSelector(state => state.auth.user.recentLocation) || [];

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      places: [],
      showList: false,
      isLoading: false,
    },
  );

  const dispatch = useDispatch();

  const [body, setBody] = useState(
    JSON.stringify({
      start: 0,
      length: 10,
      search: search,
      order: [
        {
          column: 0,
          dir: 'asc',
        },
      ],
    }),
  );

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const getList = useQuery(['getSportComplex', body], getSportComplex, {
    // enabled: false,
    onSuccess: result => {
      search?.length > 0 &&
        setState({
          places: result?.data?.data,
        });
    },
    onError: error => {},
  });

  /**
   * @function onChange
   * @param e
   * @description this will set the whatever character press to save in value
   */

  const onChange = e => {
    setSearch(e);
    setBody({
      start: 0,
      length: 10,
      search: e,
      order: [
        {
          column: 0,
          dir: 'asc',
        },
      ],
    });
    getList?.refetch();
  };

  /**
   * @function useEffect
   * @description this will call first time
   */

  useEffect(() => {
    setBody({
      start: 0,
      length: 10,
      search: search,
      order: [
        {
          column: 0,
          dir: 'asc',
        },
      ],
    });

    getList.refetch();
  }, []);

  /**
   * @function useEffect
   * @description this request the location permission and will call another function to get the current location
   */

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    askLoc == undefined &&
      navigation?.navigate('AskLocation', {setPermis: setPermis});

    if (askLoc) requestLocationPermission();

    return () => {
      //   GeoLocation.clearWatch(watchID);
    };
  }, [askLoc]);

  /**
   * @function getOneTimeLocation
   * @description this function will call at one time when taking current location
   */

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(info => {});

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  // const onChange = e => {
  //   setSearch(e);
  //   onPlaceSearch();
  // };

  /**
   * @function onPlaceSearch
   * @description this function will call the fetch places
   */

  const onPlaceSearch = () => {
    const {requiredTimeBeforeSearch} = props;

    // fetchPlaces();
  };

  /**
   * @function onPlaceSelect
   * @description this function will use to select the place from list
   */

  const onPlaceSelect = async passedPlace => {
    const {clearQueryOnSelect} = props;

    setState({
      isLoading: true,
    });

    try {
      // const place = await fetch(
      //   `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=AIzaSyCGr2f24vkDuNYiDEnu170trNN7WaMFvLg&fields=${
      //     props.queryFields
      //   }&language=${props.language}${buildSessionQuery()}`,
      // ).then(response => response.json());

      // setSearch(
      //   (place && place.result && place.result.formatted_address) ||
      //     place.result.name,
      // );

      // setState({
      //   showList: false,
      //   isLoading: false,
      //   query: clearQueryOnSelect
      //     ? ''
      //     : place &&
      //       place.result &&
      //       (place.result.formatted_address || place.result.name),
      // });

      const name = passedPlace?.name
        ? passedPlace?.name
        : passedPlace?.info?.address !== ',' && passedPlace?.info?.address;

      // if (!route?.params?.setLocation) {

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
        })
        .catch(error => console.error(error));

      dispatch({
        type: AuthConstants?.RECENTLOCATION,
        recentLocation: [passedPlace, ...recentLocation],
      });
      // } else {
      route?.params?.setLocation(passedPlace);
      // }

      navigation?.goBack();

      return props.onSelect && props.onSelect(name);
    } catch (e) {
      setSearch(
        passedPlace?.info?.address !== ','
          ? passedPlace?.info?.address
          : passedPlace?.name,
      );
      setState({
        isLoading: false,
        showList: false,
        query:
          passedPlace?.info?.address !== ','
            ? passedPlace?.info?.address
            : passedPlace?.name,
      });

      navigation?.goBack();

      return props.onSelect && props.onSelect(passedPlace);
    }
  };

  /**
   * @function fetchPlaces
   * @description this function will fetch the places via google api with api key
   */

  const fetchPlaces = async () => {
    const {requiredCharactersBeforeSearch} = props;

    if (!search || search.length < requiredCharactersBeforeSearch) {
      return;
    }
    setState({
      showList: true,
      isLoading: true,
    });

    const places = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key=
      AIzaSyAeeT2PXksnxQ7cXrFYmhR2oPvNkEF_QBw&inputtype=textquery&language=en}&fields=
            formatted_address,geometry,name
          ${buildLocationQuery()}${buildCountryQuery()}${buildTypesQuery()}${buildSessionQuery()}`,
    ).then(response => response.json());

    setState({
      isLoading: false,
      places: places.predictions,
    });
  };

  /**
   * @function buildCountryQuery
   * @returns countryqueries code
   * @description will build the country query and return it
   */

  const buildCountryQuery = () => {
    const {queryCountries} = props;

    if (!queryCountries) {
      return '';
    }

    return `&components=${queryCountries
      .map(countryCode => {
        return `country:${countryCode}`;
      })
      .join('|')}`;
  };

  const selectCurrentLocation = () => {
    if (currentLatitude == '...' && currentLongitude == '...') {
      navigation?.navigate('AskLocation', {setPermis: setPermis});

      // displayErrorToast('Kindly give the permission to get your location');
    }

    Geocoder.from(currentLatitude, currentLongitude)
      .then(json => {
        var location = json.results[0]?.formatted_address;

        const passedPlace = {
          location_lat: currentLatitude,
          location_long: currentLongitude,
          name: location,
          info: {address: location},
        };

        dispatch({
          type: AuthConstants?.LOCATION,
          location: passedPlace,
        });

        route?.params?.setLocation(passedPlace);
        navigation?.goBack();
      })
      .catch(error => console.warn(error));
  };

  /**
   * @function buildLocationQuery
   * @returns searchLatitude, searchLongitude, searchRadius
   * @description will build the Location lat long along with query and return it
   */

  const buildLocationQuery = () => {
    const {searchLatitude, searchLongitude, searchRadius} = props;

    if (!searchLatitude || !searchLongitude || !searchRadius) {
      return '';
    }

    return `&location=${searchLatitude},${searchLongitude}&radius=${searchRadius}`;
  };

  const buildTypesQuery = () => {
    const {queryTypes} = props;

    if (!queryTypes) {
      return '';
    }

    return `&types=${queryTypes}`;
  };

  const buildSessionQuery = () => {
    const {querySession} = props;

    if (querySession) return '&sessiontoken=' + querySession;

    return '';
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Box style={{flexGrow: 1}}>
        <Box flexGrow={1}>
          <Header
            searchbar
            navigation={navigation}
            onChange={onChange}
            searchValue={search}
          />

          <TouchableBox onPress={() => selectCurrentLocation()}>
            <Box flexDirection="row" marginHorizontal="l" mt="l">
              <FastImage
                source={Images?.currentLocation}
                style={{
                  height: 20,
                  width: 20,
                }}
                resizeMode={FastImage?.resizeMode?.contain}
              />
              <Box>
                <Text
                  textDecorationLine="underline"
                  variant="blackshade16400"
                  ml="m">
                  Use current location
                </Text>
              </Box>
            </Box>
          </TouchableBox>
          {state?.places?.length <= 0 ? (
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
                      <TouchableBox onPress={() => onPlaceSelect(item)}>
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
          ) : (
            <Box mt={'l'}>
              {getList?.isFetching ? (
                <Text textAlign={'center'} variant="blackshade14500">
                  Loading...
                </Text>
              ) : (
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
                  data={state?.places}
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
              )}
            </Box>
          )}
        </Box>
      </Box>
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
});

export default SelectLocation;

SelectLocation.propTypes = {
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

SelectLocation.defaultProps = {
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
