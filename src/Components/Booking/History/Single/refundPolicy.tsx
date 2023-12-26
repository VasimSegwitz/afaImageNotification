import React from 'react';
import {wp} from '../../../Helpers/responsive-ratio';
import {Header} from '../../../ReusableComponents';
import {Box, Text} from '../../../Theme/Index';
import styles from './styles';

const RefundPolicy = () => {
  return (
    <Box flex={1} backgroundColor="white" pt="s">
      <Header title="Refund Policy" left />
      <Box style={styles.refundPolicy}>
        <Text variant={'blackshade16400'}>
          The transactions made in AFA App are refundable and not refundable
          based on the below terms:
        </Text>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          mt="l"
          alignItems="center">
          <Box flexDirection="row" alignItems="center">
            <Text variant={'blackshade16500'}>Cancellation Time</Text>
          </Box>
          <Box style={{alignItems: 'center'}}>
            {/* <Text variant={"blackshade24500"}>%</Text> */}
            <Text variant={'blackshade16400'}>refund</Text>
          </Box>
        </Box>
        <Box height={0.5} mt="s" backgroundColor="tertiary2" />
        <Box justifyContent="space-between" flexDirection="row" mt="m">
          <Text variant="blackshade14400" style={{width: wp(70)}}>
            less than 24 hours before a game starts
          </Text>
          <Text variant="blackshade24500">0%</Text>
        </Box>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          marginVertical={'m'}>
          <Text variant="blackshade14400" style={{width: wp(70)}}>
            between 24 hours - 48 hours before a game starts
          </Text>
          <Text variant="blackshade24500">50%</Text>
        </Box>
        <Box justifyContent="space-between" flexDirection="row" mt="s">
          <Text variant="blackshade14400" style={{width: wp(70)}}>
            at least 48 hours before a game starts
          </Text>
          <Text variant="blackshade24500">100%</Text>
        </Box>
        <Text variant={'blackshade16400'} mt={'xl'}>
          All bookings that has being cancelled will be refunded to your AFA
          Wallet
        </Text>
      </Box>
    </Box>
  );
};

export default RefundPolicy;
