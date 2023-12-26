import React, {useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useMutation, useQuery} from 'react-query';
import {Images} from '../../../Constant/Image';
import {displayErrorToast, displaySuccessToast} from '../../../utils';
import {wp} from '../../Helpers/responsive-ratio';
import SearchBar from '../../ReusableComponents/SearchBar';
import {invite} from '../../Services/ProfileApi';
import {Box, Text, TouchableBox} from '../../Theme/Index';
import {styles} from './styles';
import {getSingleActivity, getUserList} from '../../Services/Booking';
import {useSelector} from 'react-redux';
import authStore from '../../../Zustand/store';

const Members = props => {
  const {navigation, route} = props;
  // const {vanue} = props?.vanue;
  const [search, setSearch] = useState('6');
  const [page, setPage] = useState(1);

  const {vanue} = authStore(state => state?.vanue);

  const setVanue = authStore(state => state?.setVanue);

  const {user} = useSelector(state => state?.auth?.user);
  const [signupCountryCode, SetSignupCountryCode] = useState('+60');
  const [list, setList] = useState([]);

  let invited: Array<number> = [];
  const [usedId, setUserId] = useState(0);
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
    {
      id: 3,
      fullname: 'Soi Benny',
      username: 'soiben24',
      image: Images.Profile,
    },
    {
      id: 4,
      fullname: 'Benedict Wati',
      username: 'Benwati84',
      image: Images.Profile,
    },
  ];

  /**
   * @function getActivity
   * @description this function will call the getActivity api
   */

  const getActivity = useQuery(
    ['getSingleActivity', vanue?.id],
    getSingleActivity,

    {
      enabled: false,
      onSuccess: data => {
        setVanue({
          vanue: data?.data,
        });

        // navigation?.setParams({vanue: data?.data});
        // navigation?.goBack();
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  const inviteMutation = useMutation('invite', invite, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      getActivity?.refetch();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const getUsers = useQuery(['getUserList', search], getUserList, {
    onSuccess: data => {
      setList(data?.data);
      // displaySuccessToast(data?.message);
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const renderItem = items => {
    const {first_name, last_name, user_name, image, id, phone} = items.item;
    const handleInvite = user_id => {
      setUserId(user_id);
      const index = invited.indexOf(user_id);
      if (index > -1) {
        invited.splice(index, 1);
      } else {
        invited.push(user_id);
      }
      inviteMutation.mutate({user_id: user_id, id: vanue?.id});
    };

    if (user?.data?.id != id && vanue?.user?.id != id)
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
                <Text variant="placeholder12400">{user_name}</Text>
                <Text variant="placeholder12400">{phone}</Text>
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
                  alignItems: 'center',
                  backgroundColor: vanue?.users?.some(i => i?.user_id == id)
                    ? 'black'
                    : 'white',
                }}
                onPress={() => handleInvite(id)}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center">
                  {vanue?.users?.some(i => i?.user_id == id) && (
                    <FastImage
                      source={Images?.CircleRight}
                      style={{height: 20, width: 20, marginTop: wp(2)}}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    variant="blackshade12500"
                    color={
                      vanue?.users?.some(i => i?.user_id == id)
                        ? 'white'
                        : 'black'
                    }>
                    {vanue?.users?.some(i => i?.user_id == id)
                      ? 'Invited'
                      : 'Invite'}
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
      <Box
        alignItems={'center'}
        justifyContent="center"
        marginVertical={'l'}
        marginHorizontal="xl">
        <SearchBar
          placeholder={'Search members'}
          onChange={handleOnSearch}
          inputStyle={styles.inputStyle}
          keyboardType="numeric"
          contact
          SetSignupCountryCode={SetSignupCountryCode}
          signupCountryCode={signupCountryCode}
        />
      </Box>
      {list?.filter(item => item?.phone_prefix == signupCountryCode)?.length >
      0 ? (
        <FlatList
          data={list?.filter(item => item?.phone_prefix == signupCountryCode)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Box flex={1} alignItems="center" justifyContent="center">
          {getUsers?.isFetching ? (
            <Text variant="blackshade112400" textAlign="center">
              Loading
            </Text>
          ) : (
            <>
              <Text textAlign={'center'} variant="blackshade16500">
                No Result Found
              </Text>
              <Text
                textAlign={'center'}
                variant="blackshade112400"
                mt="l"
                marginHorizontal="l">
                Sorry, the keyword you entered cannot be found. Please check
                again or search with another keyword
              </Text>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Members;
