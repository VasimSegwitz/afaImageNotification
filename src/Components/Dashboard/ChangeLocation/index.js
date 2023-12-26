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

const ChangeLocation = ({navigation, route, TypeOfSportsData, ...props}) => {
  Geocoder.init(googleApiKey, {language: 'en'});

  const [search, setSearch] = useState('');
  const [pemission, setPermis] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const is_venue_filter = route?.params?.from == 'venueFilter';

  const askLoc = authStore(state => state.askLoc.askLoc);

  const searchedLocation =
    useSelector(state => state.auth.user.searchedLocation) || [];

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

  // /**
  //  * @function onChange
  //  * @param e
  //  * @description this will set the whatever character press to save in value
  //  */

  // const onChange = e => {
  //   setSearch(e);
  //   setBody({
  //     start: 0,
  //     length: 10,
  //     search: e,
  //     order: [
  //       {
  //         column: 0,
  //         dir: 'asc',
  //       },
  //     ],
  //   });
  //   getList?.refetch();
  // };

  /**
   * @function requestLocationPermission
   * @description this request the location permission and will call another function to get the current location
   */

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

  /**
   * @function useEffect
   * @description this request the location permission and will call another function to get the current location
   */

  useEffect(() => {
    askLoc == undefined &&
      navigation?.navigate('AskLocation', {setPermis: setPermis});
    if (askLoc) requestLocationPermission();
  }, [askLoc]);

  const {
    first_name,
    last_name,
    email,
    phone,
    phone_prefix,
    user_name,
    gender,
    label,
  } = useSelector(state => state?.auth?.user?.user?.data);

  const sport = useSelector(state => state?.auth?.user?.sport);

  const updateProfileMutation = useMutation('editProfile', editProfile, {
    onSuccess: data => {
      if (data?.success == 1) {
        dispatch({
          type: AuthConstants.USER_INFO_RECEIVED,
          user: data,
        });
        !is_venue_filter && navigation?.goBack();

        displaySuccessToast('Location Updated Successfully');
      }
    },
    onError: error => {
      if (error?.data?.success == 0) displayErrorToast(error?.data?.message);
    },
  });

  const submit = location => {
    const favorite_sports_ids = sport.map(data => data.id);

    const body = {
      first_name: first_name,
      last_name: last_name,
      username: user_name,
      gender: parseInt(gender),
      email: email,
      phone_prefix: phone_prefix,
      phone: phone,
      favorite_sports: favorite_sports_ids,
      location_lat: location.location_lat,
      location_long: location.location_long,
    };
    updateProfileMutation.mutate(body);
  };

  /**
   * @function getOneTimeLocation
   * @description this function will call at one time when taking current location
   */

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(info => console.log('infos', info));

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

  const onChange = e => {
    setSearch(e);
    onPlaceSearch();
  };

  /**
   * @function onPlaceSearch
   * @description this function will call the fetch places
   */

  const onPlaceSearch = () => {
    const {requiredTimeBeforeSearch} = props;

    fetchPlaces();
  };

  /**
   * @function onPlaceSelect
   * @description this function will use to select the place from list
   */

  const onPlaceSelect = async (id, passedPlace) => {
    const {clearQueryOnSelect} = props;
    setState({
      isLoading: true,
    });

    try {
      const place = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${googleApiKey}&fields=${
          props.queryFields
        }&language=${props.language}${buildSessionQuery()}`,
      ).then(response => response.json());

      setSearch(
        (place && place.result && place.result.formatted_address) ||
          place.result.name,
      );

      // return;

      setState({
        showList: false,
        isLoading: false,
        query: clearQueryOnSelect
          ? ''
          : place &&
            place.result &&
            (place.result.formatted_address || place.result.name),
      });

      const name =
        (place &&
          place.result &&
          place.result.name + ', ' + place.result.formatted_address) ||
        place.result.name;

      Geocoder.from(name)
        .then(json => {
          var location = json.results[0].geometry.location;
          const passedPlace = {
            location_lat: location?.lat,
            location_long: location?.lng,
            name: name,
          };

          dispatch({
            type: AuthConstants?.USERLOCATION,
            location: passedPlace,
          });

          route?.params?.bebs
            ? route?.params?.setToLocation(passedPlace)
            : route?.params?.setup == false && submit(passedPlace);
        })
        .catch(error => console.warn(error));

      dispatch({
        type: AuthConstants?.USERSEARCHEDLOCATION,
        searchedLocation: [name, ...searchedLocation],
      });

      // } else {
      route?.params?.setLocation && route?.params?.setLocation(name);
      // }

      navigation?.goBack();

      return props.onSelect && props.onSelect(place);
    } catch (e) {
      setSearch(passedPlace.description);
      setState({
        isLoading: false,
        showList: false,
        query: passedPlace.description,
      });
      navigation?.goBack();

      return props.onSelect && props.onSelect(passedPlace.description);
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
      ${googleApiKey}&inputtype=textquery&language=en}&fields=
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
      // requestLocationPermission();
      navigation?.navigate('AskLocation', {setPermis: setPermis});
      // displayErrorToast('Kindly give the permission to get your location');
    }

    Geocoder.from(currentLatitude, currentLongitude)
      .then(json => {
        var location = json.results[0]?.formatted_address;
        const l = location?.split(',');

        const passedPlace = {
          location_lat: currentLatitude,
          location_long: currentLongitude,
          name: location,
        };

        dispatch({
          type: AuthConstants?.USERLOCATION,
          location: passedPlace,
        });

        if (route?.params?.bebs) {
          route?.params?.setToLocation(passedPlace);
          navigation?.goBack();
        }

        route?.params?.setup
          ? navigation.goBack()
          : route?.params?.bebs
          ? route?.params?.setToLocation(passedPlace)
          : submit(passedPlace);

        // route?.params?.bebs
        //   ? route?.params?.setToLocation(passedPlace)
        //   : submit(passedPlace);
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
                      type: AuthConstants?.USERSEARCHEDLOCATION,
                      searchedLocation: [],
                    });
                  }}>
                  <Text variant="primary14500">Clear</Text>
                </TouchableBox>
              </Box>
              <Box mt="l">
                <FlatList
                  keyExtractor={e => e}
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
                  data={searchedLocation.filter(
                    (v, i, a) => a.findIndex(v2 => v2 === v) === i,
                  )}
                  renderItem={({item}) => {
                    const {name, info} = item;
                    return (
                      <TouchableBox
                        onPress={() => {
                          if (!route?.params?.setup)
                            Geocoder.from(item)
                              .then(json => {
                                var location =
                                  json.results[0].geometry.location;

                                const passedPlace = {
                                  location_lat: location?.lat,
                                  location_long: location?.lng,
                                  name: item,
                                };

                                route?.params?.bebs
                                  ? route?.params?.setToLocation(passedPlace)
                                  : submit(passedPlace);

                                dispatch({
                                  type: AuthConstants?.USERLOCATION,
                                  location: passedPlace,
                                });
                              })
                              .catch(error => console.warn(error));

                          if (route?.params?.setup)
                            Geocoder.from(item)
                              .then(json => {
                                var location =
                                  json.results[0].geometry.location;
                                const passedPlace = {
                                  location_lat: location?.lat,
                                  location_long: location?.lng,
                                  name: item,
                                };

                                dispatch({
                                  type: AuthConstants?.USERLOCATION,
                                  location: passedPlace,
                                });
                              })
                              .catch(error => console.warn(error));

                          // route?.params?.setup &&
                          route?.params?.setLocation &&
                            route?.params?.setLocation(item);

                          navigation?.goBack();
                        }}>
                        <Box marginHorizontal="l">
                          <Text variant="blackshade14400">
                            {info?.address || item}
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
                  const {description} = item;
                  return (
                    <TouchableBox
                      key={`place-${item.place_id || item.id}`}
                      // style={[styles.place, this.props.stylesItem]}
                      onPress={() => onPlaceSelect(item.place_id, item)}>
                      <Box marginHorizontal="l">
                        <Text variant="blackshade14400">{description}</Text>
                      </Box>
                    </TouchableBox>
                  );
                }}
              />
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

export default ChangeLocation;

ChangeLocation.propTypes = {
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

ChangeLocation.defaultProps = {
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
