import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../Constant/Image';
import {wp} from '../../../Helpers/responsive-ratio';
import SearchBar from '../../../ReusableComponents/SearchBar';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';
import {styles} from './styles';
import {useMutation} from 'react-query';
import {
  NotGoingActivity,
  removeFromActivity,
  ReserveSlot,
} from '../../../Services/Booking';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import authStore from '../../../../Zustand/store';
import RemoveConfirmationModal from '../../../ReusableComponents/Modals/RemoveConfirmationModal';
import {useNavigation} from '@react-navigation/native';
import {goingUser} from '../../../Helpers/HelperFunctions';

const UserList = props => {
  const navigation = useNavigation();
  const initialState = {
    invite_id: 1,
  };

  const {vanue} = authStore(state => state?.vanue);
  const [visible, setVisible] = useState(false);
  const [Idremover, setIdremover] = useState();

  const [reserved, setReserved] = useState([]);
  const [reservedname, setReservedName] = useState('');

  useEffect(() => {
    const res = vanue?.users?.filter(item => {
      if (item?.user == null) return item;
    });
    setReserved(res?.map(i => i?.user_name));
  }, [vanue]);

  const [state, setState] = useState(initialState);
  const DATA = [
    {
      id: 1,
      fullname: 'Ben Frank',
      username: 'Ben4838',
      image: Images.Profile,
    },
    {
      id: 1,
      fullname: 'Bessie',
      username: 'Besco',
      image: Images.Profile,
    },
    {
      id: 1,
      fullname: 'Ben Frank',
      username: 'Ben4838',
      image: Images.Profile,
    },
    {
      id: 1,
      fullname: 'Ben Frank',
      username: 'Ben4838',
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

  /**
   * @function mutate
   * @description this function will call the createActivity api
   */

  const {mutate: reserveSl} = useMutation('ReserveSlot', ReserveSlot, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(reservedname + ' Removed');
        props?.onSubmit();
      }
    },
  });

  onSub = () => {
    setVisible(false);

    if (reservedname) {
      const body = {
        user_names: reserved?.filter(item => item != reservedname),
      };

      const payload = {
        body: body,
        id: vanue?.id,
      };

      reserveSl(payload);
    } else {
      mutate({id: vanue?.id, userId: Idremover});
    }
  };

  const renderItem = items => {
    const {user, num_going, num_going_data} = items.item;

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
      phone = user?.phone_prefix + ' ' + user?.phone;
    } else {
      first_name = items.item?.user_name;
      last_name = '';
      user_name = items.item?.user_name;
      image = '';
      id = items.item?.id;
      phone = '';
    }

    const goin = num_going || num_going_data?.reduce((i, j) => i + j.count, 0);

    const handleRemove = id => {
      if (id == user_name) {
        setReservedName(id);
        setVisible(true);
      } else {
        setState({...state, invite_id: id});
        setIdremover(id);
        setVisible(true);
      }
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
            <Box
              position={'absolute'}
              backgroundColor="white"
              height={wp(5)}
              width={wp(5)}
              bottom={0}
              // right={0}
              borderRadius={wp(3)}
              // width={wp(28)}
              style={{
                marginLeft: wp(10),
              }}>
              <FastImage
                resizeMode={FastImage?.resizeMode?.contain}
                source={Images?.RightGreen}
                style={{height: wp(5), width: wp(5)}}
              />
            </Box>
            <Box ml={'l'}>
              <Text variant="blackshade14400">
                {first_name} {last_name}
              </Text>
              {props?.Joiner !== 'Joiner' && (
                <Text variant="placeholder12400">{phone}</Text>
              )}
              <Text variant="placeholder12400">@{user_name}</Text>
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
                  backgroundColor: 'white',
                }}
                onPress={() => handleRemove(user ? id : user_name)}>
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
                    {'Remove'}
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
      <RemoveConfirmationModal
        visible={visible}
        title="Confirm removal"
        left={true}
        people={0}
        buttonLabel={'Confirm'}
        onClose={() => setVisible(false)}
        onPress={() => onSub()}
        onRefund={() => {
          setVisible(!visible);
          navigation?.navigate('RefundPolicyActivity');
        }}
      />
    </Box>
  );
};

export default UserList;
