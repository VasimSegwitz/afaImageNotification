import React, {useMemo} from 'react';
import {Box, Text} from '../../../Theme/Index';
import {Header} from '../../../ReusableComponents';
import {FlatList} from 'react-native-gesture-handler';

const RefundPolicyActivity = props => {
  const DATA = useMemo(
    () => [
      {
        name: 'Player taps on Leave Activity before it starts; or',
      },
      {
        name: 'Host removes / deletes the individual player who is entitled to the refund; or',
      },
      {
        name: 'Host cancels or deletes the Activity; or',
      },
      {
        name: 'Minimum number of players do not show up for the relevant Activity. Players who do show up can request a refund by raising a ticket; or',
      },

      {
        name: 'Host fails to book the Venue for the Activity.',
      },
    ],
    [],
  );

  return (
    <Box flex={1}>
      <Header left title="Refund Policy" />
      <Box flexGrow={1} p="l">
        <Box mb="l">
          <Text variant="blackshade16400">Player can get full refund if:</Text>
        </Box>

        {DATA?.map((item, index) => {
          return (
            <Box flexDirection="row" mt="m" ml="s" width={'95%'}>
              <Text variant="blackshade16400" mr="m">
                {index + 1}.
              </Text>
              <Text variant="blackshade16400">{item?.name}</Text>
            </Box>
          );
        })}

        <Box mt="l">
          <Text variant="blackshade16400">
            After leaving Activity, the money will be refunded to Player through
            AFA Pay.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default RefundPolicyActivity;
