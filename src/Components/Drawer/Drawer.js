import {createBox, createText} from '@shopify/restyle';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import authStore from '../../Zustand/store';
const Box = createBox();

const Text = createText();
export default ({navigation}) => {
  const dispatch = useDispatch();
  const setToken = authStore(state => state.setToken);

  const onLogout = () => {
    // mutate();
    setToken({
      token: '',
    });
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <TouchableOpacity onPress={() => onLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </Box>
  );
};
