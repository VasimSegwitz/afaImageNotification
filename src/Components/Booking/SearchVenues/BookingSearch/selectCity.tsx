import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';
import {Header} from '../../../ReusableComponents';
import {getCity} from '../../../Services/Booking';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';

const SelectCity = props => {
  const {prefState, setPrefCity} = props?.route?.params;

  const [state, setState] = useState([]);
  const navigation = useNavigation();

  const getCityQuery = useQuery(['getCity', prefState], getCity, {
    onSuccess(data) {
      setState(data.data.sort());
    },
    onError(err) {},
  });

  useEffect(() => {
    getCityQuery.refetch();
  }, []);

  const renderItem = items => {
    return (
      <TouchableBox
        p={'m'}
        ml={'m'}
        onPress={() => {
          setPrefCity(items.item);
          navigation.goBack();
        }}>
        <Text variant={'blackshade16500'}>{items.item}</Text>
        <Box
          borderWidth={0.5}
          mt={'s'}
          mr={'m'}
          style={{borderColor: palette?.tertiary2}}
        />
      </TouchableBox>
    );
  };

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header left title={'Select City'} />
      <FlatList data={state} renderItem={renderItem} />
    </Box>
  );
};

export default SelectCity;
