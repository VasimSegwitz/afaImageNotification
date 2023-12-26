import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';
import {Header} from '../../../ReusableComponents';
import {getState} from '../../../Services/Booking';
import {Box, palette, Text, TouchableBox} from '../../../Theme/Index';

const SelectState = props => {
  const {setPrefState, setPrefCity} = props?.route?.params;

  const [state, setState] = useState([]);
  const navigation = useNavigation();

  const getStateQuery = useQuery('getState', getState, {
    onSuccess(data) {
      setState(data.data.sort());
    },
    onError(err) {},
  });

  useEffect(() => {
    getStateQuery.refetch();
  }, []);

  const renderItem = items => {
    return (
      <TouchableBox
        p={'m'}
        ml={'m'}
        onPress={() => {
          setPrefState(items.item);
          setPrefCity('-');
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
      <Header left title={'Select State'} />
      <FlatList data={state} renderItem={renderItem} />
    </Box>
  );
};

export default SelectState;
