import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, Text, TouchableBox} from '../../Theme/Index';
import {useQuery} from 'react-query';
import {getNotificationList} from '../../Services/NotificationApi';
import {displayErrorToast} from '../../../utils';
import moment from 'moment';
import {getSingleActivity} from '../../Services/Booking';
import {useSelector} from 'react-redux';
import authStore from '../../../Zustand/store';
import {useNavigation} from '@react-navigation/native';
import {LoadingOverlay} from '../../ReusableComponents';

const ActivityNotifiction = props => {
  const setVanue = authStore(state => state?.setVanue);
  const navigation = useNavigation();

  const DATA = [
    {
      id: 1,
      icon: Images?.AFAC,

      text: 'Nicolas joined Badminton doubles - 22 aug, 2pm activity',
      time: '14 hours ago',
    },
    {
      id: 2,
      icon: Images?.AFAC,
      //   heading: 'New Refund Policy for Venue Booking cancellation',
      text: '‘Badminton doubles - 22 Aug 23, 2pm’  Activity’s slot is OPEN. 2 more players are needed. ',
      time: '14 hours ago',
    },
  ];

  const {first_name, image, address, id} = useSelector(
    state => state?.auth?.user?.user?.data,
  );

  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [vanueId, setVanueID] = useState(null);

  const [body, setBody] = useState({
    type: 2,
    per_page: 6,
    page: page,
  });

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', vanueId],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });
        setVanueID(null);

        const ishost =
          data?.data?.user?.first_name === first_name ||
          data?.data?.co_hosts?.some(i => i?.user_id == id);
        const p = ishost ? 'ActivityHost' : 'ActivityPage';

        navigation?.navigate(p, {
          vanue: data?.data,
          coHost: ishost,
        });
        // navigation?.setParams({vanue: data?.data});
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const onclickId = id => {
    setVanueID(id);
  };

  useEffect(() => {
    if (vanueId) getActivity?.refetch();
  }, [vanueId]);

  /**
   * @function getList
   * @param body
   * @description this will call the getSportComplex api with search keyword
   */

  const getList = useQuery(['getSearchActivity', body], getNotificationList, {
    // enabled: false,
    onSuccess: result => {
      setPage(result?.current_page);

      if (result?.success == 1) {
        setAllLoaded(result?.data?.length > 0 ? false : true);
        setLoadingMore(false);
        setList([...list, ...result?.data]);
      } else {
        setLoadingMore(false);
        setAllLoaded(true);

        // const key = Object.keys(result?.data)[0];
        // displayErrorToast(result?.data[key]);
      }
    },
    onError: error => {
      setLoadingMore(false);
      setAllLoaded(true);
      // const key = error?.data?.data && Object.keys(error?.data?.data)[0];
      displayErrorToast('No notification found');
    },
  });

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <Box
        style={{
          padding: 10,
          // marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!allLoaded ? (
          loadingMore ? (
            <Text>Loading...</Text>
          ) : // <ActivityIndicator color="#D71513" />
          null
        ) : (
          <Box justifyContent="center" alignItems="center" flex={1}>
            <Text textAlign={'center'}>no more notification</Text>
          </Box>
        )}
      </Box>
    );
  };

  const loadMore = () => {
    // if already loading more, or all loaded, return
    if (allLoaded || loadingMore) return;
    // set loading more (also updates footer text)
    setLoadingMore(true);
    let p = page + 1;

    setBody({
      ...body,
      page: page + 1,
    });
    // getList?.refetch();
    // get next results
    // getProductListing?.refetch();
  };

  const renderItem = items => {
    const {icon, message, time, title, created_at, user_activity_id} =
      items?.item;
    return (
      <TouchableBox
        style={{marginLeft: wp(4), marginTop: wp(6)}}
        onPress={() => onclickId(user_activity_id)}>
        <Box flexDirection={'row'} flex={1}>
          <Box flex={0.1}>
            <FastImage
              source={Images?.cal}
              style={{height: wp(5), width: wp(5)}}
              resizeMode={FastImage?.resizeMode?.contain}
            />
          </Box>
          <Box flex={0.9} ml={'l'} mr={'m'}>
            {title && <Text variant="blackshade16500">{title}</Text>}
            {message && <Text variant={'blackshade16400'}>{message}</Text>}
            <Text variant="placeholder12400" marginVertical={'s'}>
              {moment(created_at)?.fromNow()}
            </Text>
          </Box>
        </Box>
        <Box borderWidth={0.5} borderColor={'tertiary2'} mr={'l'} />
      </TouchableBox>
    );
  };

  return (
    <Box flex={1} backgroundColor={'white'}>
      {getList?.isFetching ? <LoadingOverlay /> : null}
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        // onEndReachedThreshold={0}
      />
    </Box>
  );
};

export default ActivityNotifiction;
