import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useReducer, useState} from 'react';
import {FlatList, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
// import Search from './Search/Search';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Images} from '../../../../Constant/Image';
import AuthConstants from '../../../../Redux/AuthConstants';
import {displayErrorToast} from '../../../../utils';
import ActivitiesUpcoming from '../../../Dashboard/ActivitiesUpcoming/ActivitiesUpcoming';
import {wp} from '../../../Helpers/responsive-ratio';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {Header} from '../../../ReusableComponents/index';
import {getSearchActivity, getSingleActivity} from '../../../Services/Booking';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';
import styles from './styles';
import authStore from '../../../../Zustand/store';

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

const SelectActivity = ({navigation, route, TypeOfSportsData, ...props}) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const setVanue = authStore(state => state?.setVanue);
  const [selWishlist, setSelWishlist] = useState([]);

  const [ids, setId] = useState(null);

  const {first_name, image, address, id} = useSelector(
    state => state?.auth?.user?.user?.data,
  );

  const {date} = route?.params;
  const {sport, location} = useSelector(state => state.auth.user);

  const recentLocation =
    useSelector(state => state.auth.user.recentLocation) || [];

  const {recentSearch} = useSelector(state => state?.book?.booking);

  const [body, setBody] = useState({
    date: moment(date).format('DD-MM-YYYY'),
    order_by: 4,
    search: null,
    per_page: 10,
    page: 1,
    location_lat: location && location?.location_lat,
    location_long: location && location?.location_long,
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

  const onPlaceSelect = () => {
    setState({
      result: true,
    });
  };

  /**
   * @function onChange
   * @description this function will set the search word to variable
   */

  const onChange = e => {
    setSearch(e);

    let filteredData = recentSearch.filter(item =>
      item.toUpperCase().includes(e.toUpperCase()),
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

  const getList = useQuery(['getSearchActivity', body], getSearchActivity, {
    onSuccess: result => {
      if (result?.data?.data)
        setState({
          activity: result?.data?.data,
        });
      else {
        const key = Object.keys(result?.data?.data)[0];
        displayErrorToast(result?.data?.data[key]);
      }
    },
    onError: error => {
      // const key = error?.data?.data && Object.keys(error?.data?.data)[0];
      displayErrorToast('No activity found ! search with another field');
    },
  });

  const getActivity = useQuery(
    ['getSingleActivity', ids],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setId(null);
        setVanue({
          vanue: data?.data,
        });
        const ishost =
          data?.data?.user?.first_name === first_name ||
          data?.data?.co_hosts?.some(i => i?.user_id == id);
        const p = ishost ? 'ActivityHost' : 'ActivityPage';

        navigation?.navigate(p, {
          vanue: data?.data,
          coHost: data?.data?.user?.first_name === first_name,
        });
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  useEffect(() => {
    if (ids) getActivity?.refetch();
  }, [ids]);

  const onSubmit = id => {
    setId(id);
  };

  return (
    // <Box backgroundColor="white">
    <Box
      style={{flexGrow: 1, flex: 1, paddingBottom: wp(35)}}
      backgroundColor={'white'}>
      {/* <Box> */}
      <Header
        searchbar
        navigation={navigation}
        onChange={onChange}
        searchValue={search}
        filter
        primary
        onFilter={() => navigation.navigate('ActivityFilter')}
        renderRightComponent={() => (
          <TouchableBox
            onPress={() => {
              search?.length < 1
                ? navigation.navigate('ActivityFilter', {
                    onSelectData: setBodyNow,
                  })
                : setSearch('');
            }}
            style={styles.filter}>
            <Box>
              {search?.length < 1 ? (
                <FastImage
                  source={Images.OptionsGray}
                  style={{height: wp(5), width: wp(5)}}
                  resizeMode={'contain'}
                />
              ) : (
                Ionicon('close', wp(5), palette?.border)
              )}
            </Box>
          </TouchableBox>
        )}
      />
      {state?.activity && (
        <Box
          mt="l"
          flexDirection="row"
          marginHorizontal="l"
          justifyContent="space-between">
          <Text variant="blackshade116500">
            {state?.activity?.length} Activities found
          </Text>
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
      )}

      {search?.length <= 0 && state?.activity?.length < 1 ? (
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
              data={recentSearch}
              ListEmptyComponent={
                <Box paddingHorizontal="l">
                  <Text variant={'destructive16400'}>No Recent Search</Text>
                </Box>
              }
              renderItem={({item}) => {
                // const {name} = item;
                return (
                  <TouchableBox onPress={() => setSearch(item)}>
                    <Box marginHorizontal="l">
                      <Text variant="blackshade14400">{item}</Text>
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
            style={{
              flexGrow: 1,

              paddingBottom: 50,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 50,
            }}
            // ItemSeparatorComponent={() => {
            //   if (state?.result) return null;
            //   else
            //     return (
            //       <Box
            //         backgroundColor="tertiary2"
            //         marginHorizontal="l"
            //         height={2}
            //         marginVertical="m"
            //       />
            //     );
            // }}
            ListEmptyComponent={() => {
              return (
                <Box
                  mt="xxl"
                  pt="xxl"
                  justifyContent="center"
                  marginHorizontal={'l'}>
                  <Text textAlign={'center'} variant="blackshade16500">
                    No Activity Found
                  </Text>
                  <Text textAlign={'center'} variant="blackshade112400" mt="l">
                    Sorry, the keyword you entered cannot be found. Please check
                    again or search with another keyword
                  </Text>
                </Box>
              );
            }}
            data={state?.activity}
            renderItem={({item}) => {
              const {name} = item;
              if (state.activity?.length > 0)
                return (
                  <Box paddingHorizontal="l" paddingVertical={'m'}>
                    <ActivitiesUpcoming
                      showGoing={true}
                      from="searchActivity"
                      search={search}
                      data={item}
                      setSelWishlist={setSelWishlist}
                      selWishlist={selWishlist}
                    />
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
    </Box>
  );
};

export default SelectActivity;

SelectActivity.propTypes = {
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

SelectActivity.defaultProps = {
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
