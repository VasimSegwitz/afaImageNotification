import React, {useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import SearchBar from '../../ReusableComponents/SearchBar';
import {Box, Text, TouchableBox} from '../../Theme/Index';
import {styles} from './styles';

const Friends = () => {
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

  const renderItem = items => {
    const {fullname, username, image, id} = items.item;
    const handleInvite = id => {
      setState({...state, invite_id: id});
    };

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
              source={image}
              style={{height: wp(14), width: wp(14)}}
            />
            <Box ml={'l'}>
              <Text variant="blackshade14400">{fullname}</Text>
              <Text variant="placeholder12400">{username}</Text>
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
                backgroundColor: id == state.invite_id ? 'black' : 'white',
              }}
              onPress={() => handleInvite(id)}>
              <Text
                variant="blackshade12500"
                color={id == state.invite_id ? 'white' : 'black'}>
                Invite
              </Text>
            </TouchableBox>
          </Box>
        </Box>
        <Box style={styles.divider} />
      </Box>
    );
  };

  const handleOnSearch = data => {};
  return (
    <Box flex={1} backgroundColor={'white'}>
      <Box alignItems={'center'} justifyContent="center" marginVertical={'l'}>
        <SearchBar
          placeholder={'Search friends'}
          onChange={handleOnSearch}
          inputStyle={styles.inputStyle}
        />
      </Box>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

export default Friends;
