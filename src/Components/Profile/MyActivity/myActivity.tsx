import React from 'react';
import {Header} from '../../ReusableComponents';
import {Box} from '../../Theme/Index';
import ActivityTab from './activityTab';

const MyActivity = () => {
  return (
    <Box flex={1} backgroundColor={'white'}>
      <Header title={'My Activities'} left />
      <ActivityTab />
    </Box>
  );
};

export default MyActivity;
