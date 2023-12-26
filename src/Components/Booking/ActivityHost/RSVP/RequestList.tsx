import React, {useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import SearchBar from '../../../ReusableComponents/SearchBar';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';
import {styles} from './styles';
import {useMutation, useQuery} from 'react-query';
import {
  acceptActivityRequest,
  getSingleActivity,
} from '../../../Services/Booking';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';
import {goingUser} from '../../../Helpers/HelperFunctions';

const RequestList = props => {
  const initialState = {
    invite_id: 0,
  };
  const [state, setState] = useState(initialState);
  // const [uid, setUid] = useState(uid);

  const {vanue} = authStore(state => state?.vanue);

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

  const {mutate} = useMutation('acceptActivityRequest', acceptActivityRequest, {
    onSuccess: data => {
      displaySuccessToast(data?.message);

      props?.onSubmit();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const renderItem = items => {
    // const {fullname, username, image, id} = items.item;
    const {user, num_going, num_going_data} = items.item;

    const {first_name, last_name, user_name, image, id} = user;

    const goin = num_going || num_going_data?.reduce((i, j) => i + j.count, 0);

    const handleInvite = id => {
      mutate({id: vanue?.id, userId: id});
      setState({...state, invite_id: id});
    };

    return (
      <Box>
        <Box
          mb={'l'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Box
            flexDirection={'row'}
            alignItems={'center'}
            width={
              props?.Joiner !== 'Joiner' && goingUser(props?.data) > 1
                ? wp(28)
                : 'auto'
            }>
            <FastImage
              resizeMode={FastImage?.resizeMode?.contain}
              source={image ? {uri: image} : Images.Profile}
              style={{height: wp(14), width: wp(14), borderRadius: wp(7)}}
            />
            <Box ml={'m'}>
              <Text variant="blackshade14400">
                {first_name} {last_name}
              </Text>
              <Text variant="placeholder12400">{user_name}</Text>
            </Box>
            {goin > 1 && (
              <Box
                p="vs"
                ml="s"
                borderLeftWidth={1}
                borderLeftColor={'tertiary2'}
                flexDirection="row">
                <Text variant={'blackshade16400'}>+{goin - 1}</Text>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Images?.RSVPSlot}
                  style={{height: 18, width: 18, marginHorizontal: 5}}
                />
                <Text variant={'blackshade110400'}>{`reserved\nslot`}</Text>
              </Box>
            )}
          </Box>

          {props?.Joiner !== 'Joiner' && (
            <Box mr={'s'}>
              <TouchableBox
                style={{
                  width: wp(19),
                  height: wp(8),
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: id == state.invite_id ? 'black' : 'white',
                }}
                onPress={() => handleInvite(id)}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center">
                  {id == state.invite_id && (
                    <FastImage
                      source={Images?.CircleRight}
                      style={{height: 20, width: 20, marginTop: wp(2)}}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    variant="blackshade12500"
                    color={id == state.invite_id ? 'white' : 'black'}>
                    {id == state.invite_id ? 'Reject' : 'Accept'}
                  </Text>
                </Box>
              </TouchableBox>
            </Box>
          )}
        </Box>
        <Box style={styles.divider} />
      </Box>
    );
  };

  const handleOnSearch = data => {};
  return (
    <Box flex={1}>
      <FlatList
        data={props?.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

export default RequestList;
