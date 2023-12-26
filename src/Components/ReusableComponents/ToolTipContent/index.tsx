import React, {memo} from 'react';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, Text, palette, fonts} from '../../Theme/Index';
import Button from '../Button';
import {Ionicon} from '../Icons';

const ToolTipContent = props => {
  const {title, detail, circleArray, onPress, noclose = false} = props;
  return (
    <Box paddingHorizontal="l" paddingVertical="t">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text variant="blackshade12500">{title}</Text>
        {noclose && Ionicon('close', 20, 'black')}
      </Box>
      <Text mt="s" variant="blackshade12400">
        {detail}
      </Text>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        mt="t"
        alignItems="center">
        <Box flexDirection="row">
          {circleArray?.map(item => {
            return (
              <Box
                height={10}
                mr="s"
                width={10}
                borderRadius={5}
                style={{
                  backgroundColor: item ? palette?.primary : '#FFEEE6',
                }}
              />
            );
          })}
        </Box>
        <Button
          onPress={onPress}
          label="Got it"
          buttonStyle={{
            width: wp(20),
            height: 30,
          }}
          textStyle={{
            fontSize: 12,
            fontFamily: fonts?.medium,
            color: 'white',
            fontWeight: '500',
          }}
        />
      </Box>
    </Box>
  );
};

export default memo(ToolTipContent);
