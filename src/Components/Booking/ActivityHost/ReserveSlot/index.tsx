import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {useMutation, useQuery} from 'react-query';
import {Images} from '../../../../Constant/Image';
import {displayErrorToast, displaySuccessToast} from '../../../../utils';
import {wp} from '../../../Helpers/responsive-ratio';
import {Button, Header} from '../../../ReusableComponents';
import {Input} from '../../../ReusableComponents/Input';
import {ReserveSlot, getSingleActivity} from '../../../Services/Booking';
import {Box, Text, TouchableBox} from '../../../Theme/Index';
import authStore from '../../../../Zustand/store';
import {Ionicon} from '../../../ReusableComponents/Icons';

export default props => {
  const {navigation, route} = props;
  // const {vanue} = route?.params;
  const {vanue} = authStore(state => state?.vanue);
  const [DiffPricing, setDiffPricing] = useState([{reserve: ''}]);
  const setVanue = authStore(state => state?.setVanue);

  useEffect(() => {
    const d = vanue?.users?.filter(i => i?.is_host_reserved);
    setDiffPricing(
      d?.map(i => {
        return {reserve: i?.user_name};
      }),
    );
  }, []);

  /**
   * @function onChangeText
   * @param e
   * @param index
   * @description this function set the gender
   */

  const onChangeText = (e, index) => {
    const arr = [...DiffPricing];
    arr[index].reserve = e;
    setDiffPricing(arr);
  };

  /**
   * @function onAddList
   * @description this function check previous added value is set or not and then add new list
   */

  const onAddList = () => {
    const arr = [...DiffPricing];
    if (arr[arr?.length - 1]?.reserve == '') {
      displayErrorToast('add the proper details then you can add new');
      return;
    }
    setDiffPricing([
      ...arr,
      {
        reserve: '',
      },
    ]);
  };

  /**
   * @function onRemove
   * @description this function check previous added value is set or not and then add new list
   */

  const onRemove = ind => {
    const arr = [...DiffPricing];
    arr?.splice(ind, 1);
    const a = arr;
    setDiffPricing(arr);
  };

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
        navigation?.goBack();
      },
      onError: error => {
        displayErrorToast(error?.data?.message);
      },
    },
  );

  /**
   * @function mutate
   * @description this function will call the createActivity api
   */

  const {mutate} = useMutation('ReserveSlot', ReserveSlot, {
    onSuccess: data => {
      if (data?.data?.success == 0) {
        displayErrorToast(data?.data?.message || `can't reserve slot now`);
      } else {
        displaySuccessToast(data?.message);
        getActivity?.refetch();
      }
    },
  });

  /**
   * @function onSubmit
   * @description will validate the data and call the api
   */

  const onSubmit = () => {
    if (DiffPricing?.some(item => item?.reserve == '')) {
      displayErrorToast('please remove input which is not empty...');
      return;
    }

    const body = {
      user_names: DiffPricing?.map(item => item?.reserve),
    };

    const payload = {
      body: body,
      id: vanue?.id,
    };
    mutate(payload);
  };

  return (
    <Box flex={1} backgroundColor="white">
      <Header left title="Reserve Slot" />
      <Box p="l" flex={1}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            marginBottom: 55,
            paddingBottom: 55,
          }}>
          <Text variant="blackshade16400">
            Reserve spot allows you to keep the spot to Players that not using
            this app yet. In case of game required payment by Wallet, Host will
            pay on their behalf.
          </Text>
          {DiffPricing?.map((item, index) => {
            return (
              <Box mt="l">
                <Box flexDirection={'row'} justifyContent={'space-between'}>
                  <Text variant="blackshade16400" mb="s">
                    Slot {index + 1}
                  </Text>
                  <TouchableBox onPress={() => onRemove(index)}>
                    <FastImage
                      source={Images?.Minus}
                      style={{height: 35, width: 35}}
                      resizeMode="stretch"
                    />
                  </TouchableBox>
                </Box>
                <Input
                  placeholder="Players name"
                  onChange={e => onChangeText(e, index)}
                  value={item?.reserve}
                />
              </Box>
            );
          })}
          {/* <Box mt="l">
            <Text variant="blackshade16400" mb="s">
              Slot 1
            </Text>
            <Input title="slot 1" placeholder="Players name" />
          </Box>
          <Box mt="m">
            <Text variant="blackshade16400" mb="s">
              Slot 2
            </Text>
            <Input title="slot 1" placeholder="Players name" />
          </Box> */}

          <Box mt="m">
            <TouchableBox onPress={() => onAddList()}>
              <Box flexDirection="row" alignItems="center">
                <FastImage
                  source={Images?.BlackAddPlus}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
                <Text
                  variant="blackshade16400"
                  ml="m"
                  textDecorationLine="underline">
                  Reserve more slots
                </Text>
              </Box>
            </TouchableBox>
          </Box>
        </ScrollView>
      </Box>
      {!vanue?.cancelled_at && (
        <Box
          width={wp(100) - 30}
          position={'absolute'}
          bottom={wp(4)}
          flexDirection="row"
          justifyContent={'space-between'}
          alignItems="center"
          alignSelf="center">
          <Button
            onPress={onSubmit}
            label={'Reserve Slot'}
            buttonStyle={{
              height: wp(11),
              width: wp(100) - 30,
              marginBottom: 10,
            }}
          />
        </Box>
      )}
    </Box>
  );
};
