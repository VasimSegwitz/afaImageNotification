import React from 'react';
import {Header} from '../../../ReusableComponents';
import {Box, Text} from '../../../Theme/Index';
import UserList from './UserList';

export default props => {
  return (
    <Box flex={1} backgroundColor="white">
      <Header left title="Add Co-host" />
      <Box p="l">
        <Text variant="blackshade16400">
          When your friends join Activities, you can make them co-hosts.
          Co-hosts have similar privileges to you, like editing the player list
          and adjusting activity details. However, they cannot cancel or delete
          the activity.
        </Text>
      </Box>
      <UserList {...props} />
    </Box>
  );
};
