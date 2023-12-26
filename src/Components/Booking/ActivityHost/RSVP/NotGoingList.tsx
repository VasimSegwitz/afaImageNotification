import React, {useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import SearchBar from '../../../ReusableComponents/SearchBar';
import {Box, Text, TouchableBox} from '../../../Theme/Index';
import {styles} from './styles';
import {removeFromActivity} from '../../../Services/Booking';
import {useMutation} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';

const NotGoingList = props => {
  const initialState = {
    invite_id: 0,
  };

  const {vanue} = authStore(state => state?.vanue);

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

  const {mutate} = useMutation('removeFromActivity', removeFromActivity, {
    onSuccess: data => {
      displaySuccessToast(data?.message);
      props?.onSubmit();
    },
    onError: error => {
      displayErrorToast(error?.data?.message);
    },
  });

  const renderItem = items => {
    const {user} = items.item;

    const {first_name, last_name, user_name, image, id} = user;

    // const {fullname, username, image, id} = items.item;
    const handleRemove = id => {
      setState({...state, invite_id: id});
      mutate({id: vanue?.id, userId: id});
    };

    return (
      <Box>
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
            <Box
              position={'absolute'}
              backgroundColor="white"
              height={wp(5)}
              width={wp(5)}
              bottom={0}
              // right={0}
              borderRadius={wp(3)}
              style={{
                marginLeft: wp(10),
              }}>
              <FastImage
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.RedCross}
                style={{height: wp(5), width: wp(5)}}
              />
            </Box>
            <Box ml={'l'}>
              <Text variant="blackshade14400">
                {first_name} {last_name}
              </Text>
              <Text variant="placeholder12400">{user_name}</Text>
            </Box>
          </Box>

          {props?.Joiner !== 'Joiner' && (
            <Box mr={'s'}>
              <TouchableBox
                style={{
                  width: wp(20),
                  height: wp(8),
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}
                onPress={() => handleRemove(id)}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center">
                  {/* {id == state.invite_id && (
                  <FastImage
                    source={Images?.CircleRight}
                    style={{height: 20, width: 20, marginTop: wp(2)}}
                    resizeMode="cover"
                  />
                )} */}
                  <Text variant="blackshade12500" color={'black'}>
                    {'remove'}
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

  const handleOnSearch = data => console.log(data);
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

export default NotGoingList;
