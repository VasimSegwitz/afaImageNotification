import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import SearchBar from '../../../ReusableComponents/SearchBar';
import {Box, Text, TouchableBox} from '../../../Theme/Index';
import {styles} from './styles';
import {
  ReserveSlot,
  addCoHost,
  getSingleActivity,
  getUserList,
  removeCoHost,
} from '../../../Services/Booking';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import authStore from '../../../../Zustand/store';

const UserList = props => {
  const [search, setSearch] = useState('6');
  const [page, setPage] = useState(1);

  const {user} = useSelector(state => state?.auth?.user);
  const setVanue = authStore(state => state?.setVanue);
  const {vanue} = authStore(state => state?.vanue);

  // const {vanue} = props?.route?.params;

  const [list, setList] = useState(
    vanue?.users?.filter(item => item?.request_type == 4 && item?.user_id),
  );

  const initialState = {
    invite_id: 0,
  };
  const [state, setState] = useState(initialState);
  const DATA = [
    {
      id: 1,
      fullname: 'Ben Frank',
      username: 'Ben4838',
      image: Images.Profile,
    },
    {
      id: 2,
      fullname: 'Bessie',
      username: 'Besco',
      image: Images.Profile,
    },
  ];

  const getActivity = useQuery(
    ['getSingleActivity', vanue?.id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        props?.navigation?.setParams({vanue: data?.data});
        setVanue({
          vanue: data?.data,
        });

        const d = list?.map(item => {
          return {
            ...item,
            flag: data?.data?.co_hosts?.some(i => i?.user_id == item?.user_id),
          };
        });
        setList(d);
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );
  useEffect(() => {
    const d = list?.map(item => {
      return {
        ...item,
        flag: vanue?.co_hosts?.some(i => i?.user_id == item?.user_id),
      };
    });
    setList(d);
  }, []);

  const {mutate} = useMutation('addCoHost', addCoHost, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const {mutate: removeHost} = useMutation('removeCoHost', removeCoHost, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  // const getUsers = useQuery(['getUserList', search], getUserList, {
  //   onSuccess: data => {
  //     setList(data?.data);
  //     displaySuccessToast(data?.message);
  //   },
  //   onError: error => {
  //     displayErrorToast(error?.data?.message);
  //   },
  // });

  const renderItem = items => {
    const {user, flag} = items.item;

    // const {first_name, last_name, user_name, image, id, phone} = user;

    var first_name,
      last_name,
      user_name,
      image,
      phone,
      id = '';

    if (user) {
      first_name = user?.first_name;
      last_name = user?.last_name;
      user_name = user?.user_name;
      image = user?.image;
      id = user?.id;
      phone = '';
    } else {
      first_name = items.item?.user_name;
      last_name = '';
      user_name = items.item?.user_name;
      image = '';
      id = items.item?.id;
      phone = '';
    }
    // const {first_name, last_name, user_name, image, id, phone} = items.item;

    const handleInvite = id => {
      setState({...state, invite_id: id});
      const body = {ids: [id]};
      flag
        ? removeHost({id: vanue?.id, userId: id})
        : mutate({id: vanue?.id, userId: id});
    };
    if (user?.data?.id != id || user !== null)
      return (
        <Box marginHorizontal={'l'}>
          <Box
            mb={'l'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Box flexDirection={'row'} alignItems={'center'}>
              <FastImage
                resizeMode={FastImage?.resizeMode?.contain}
                source={image ? {uri: image} : Images.Profile}
                style={{height: wp(14), width: wp(14), borderRadius: wp(7)}}
              />
              <Box ml={'l'}>
                <Text variant="blackshade14400">
                  {first_name} {last_name}
                </Text>
                <Text variant="placeholder12400">
                  @{user_name} - {phone || ''}
                </Text>
              </Box>
            </Box>
            <Box mr={'s'}>
              <TouchableBox
                style={{
                  width: wp(25),
                  height: wp(8),
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: flag ? 'black' : 'white',
                }}
                onPress={() => handleInvite(id)}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center">
                  {flag && (
                    <FastImage
                      source={Images?.CircleRight}
                      style={{height: 20, width: 20, marginTop: wp(2)}}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    variant="blackshade12500"
                    color={flag ? 'white' : 'black'}>
                    {flag ? 'Remove' : 'Add'}
                  </Text>
                </Box>
              </TouchableBox>
            </Box>
          </Box>
          <Box style={styles.divider} />
        </Box>
      );
  };

  const handleOnSearch = data => setSearch(data);
  return (
    <Box flex={1} backgroundColor={'white'}>
      {/* <Box alignItems={'center'} justifyContent="center" marginVertical={'l'}>
        <SearchBar
          placeholder={'Search members'}
          onChange={handleOnSearch}
          inputStyle={styles.inputStyle}
        />
      </Box> */}
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

export default UserList;
