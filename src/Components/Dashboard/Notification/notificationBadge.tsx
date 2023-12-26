import React from 'react';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, palette, Text} from '../../Theme/Index';

const NotificationBadge = badge => {
  return (
    <Box
      style={{backgroundColor: palette?.primary3, height: wp(7), width: wp(10)}}
      p={'s'}
      alignItems={'center'}
      borderRadius={wp(10) / 2}>
      <Text variant={'primary12500'}>{badge || ''}</Text>
    </Box>
  );
};

export default NotificationBadge;
