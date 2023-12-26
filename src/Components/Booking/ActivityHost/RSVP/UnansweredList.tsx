import React, {useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import RadioButton from '../../../ReusableComponents/RadioButton';
import SearchBar from '../../../ReusableComponents/SearchBar';
import {Box, fonts, palette, Text, TouchableBox} from '../../../Theme/Index';
import {styles} from './styles';
import {remindActivity} from '../../../Services/Booking';
import {useMutation} from 'react-query';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';

const UnansweredList = props => {
  const initialState = {
    invite_id: 0,
    all: false,
  };
  const [state, setState] = useState(initialState);
  const {vanue} = authStore(state => state?.vanue);
  const {mutate} = useMutation('remindActivity', remindActivity, {
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
    const {first_name, user_name, last_name, image, id} = user;
    const handleInvite = id => {
      mutate({
        id: vanue?.id,
        form: {user_ids: [id]},
      });
      setState({...state, invite_id: id});
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
            <Box ml={'l'}>
              <Text variant="blackshade14400">
                {first_name} {last_name}
              </Text>
              <Text variant="placeholder12400">@{user_name}</Text>
            </Box>
          </Box>
          {props?.Joiner !== 'Joiner' && (
            <Box mr={'s'}>
              <TouchableBox
                style={{
                  width: wp(21),
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
                    {id == state.invite_id ? 'Remind' : 'Remind'}
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

  const ListHeader = () => {
    //View to set in Header
    return (
      <Box
        mb={'l'}
        mt="l"
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        {props?.Joiner !== 'Joiner' && (
          <RadioButton
            text="Remind all"
            unanswered={true}
            onPress={() => {
              mutate({
                id: vanue?.id,
                form: {user_ids: props?.data?.map(item => item?.user?.id)},
              });
              setState({
                ...state,
                all: true,
              });
            }}
            selected={state?.all}
            textStyle={{
              fontSize: 16,
              color: palette?.blackshade,
              fontWeight: '600',
              fontFamily: fonts?.bold,
            }}
          />
        )}
        {props?.Joiner !== 'Joiner' && (
          <Box mr={'s'}>
            <TouchableBox
              style={{
                width: wp(21),
                height: wp(8),
                borderWidth: 1,
                borderRadius: 8,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: state.all ? 'black' : 'white',
              }}
              onPress={() => {
                mutate({
                  id: vanue?.id,
                  form: {user_ids: props?.data?.map(item => item?.user?.id)},
                });
                setState({
                  ...state,
                  all: true,
                });
              }}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center">
                {state.all && (
                  <FastImage
                    source={Images?.CircleRight}
                    style={{height: 20, width: 20, marginTop: wp(2)}}
                    resizeMode="cover"
                  />
                )}
                <Text
                  variant="blackshade12500"
                  color={state?.all ? 'white' : 'black'}>
                  {state?.all ? 'Remind' : 'Remind'}
                </Text>
              </Box>
            </TouchableBox>
          </Box>
        )}
      </Box>
    );
  };

  const handleOnSearch = data => console.log(data);
  return (
    <Box flex={1}>
      <FlatList
        data={props?.data}
        ListHeaderComponent={ListHeader}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

export default UnansweredList;
