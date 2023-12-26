import {useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, Text} from '../../Theme/Index';
import ScrollPicker from '../ScrollableList';

const FetchTime = props => {
  const isFocused = useIsFocused();
  const [hour, sethour] = useState(props?.hour);
  const [min, setmin] = useState(props?.min);

  const refHour = useRef();
  const refMin = useRef();

  useEffect(() => {
    sethour(props?.hour);
    setmin(props?.min);
  }, [isFocused]);

  useEffect(() => {
    refHour?.current?.scrollToTargetIndex(props?.hour);
    refMin?.current?.scrollToTargetIndex(props?.min);
  }, [hour, min]);

  return (
    <Box alignItems="center" marginHorizontal="l">
      <Box alignItems="center" flexDirection="row">
        <Box height={wp(27)}>
          <ScrollPicker
            dataSource={Array.from(Array(props.val).keys(), i =>
              i < 10 ? '0' + i : i,
            )}
            ref={refHour}
            // selectedIndex={0}
            // selectedIndex={props?.hour ? props?.hour : 0}
            renderItem={(data, index) => {
              //
              return (
                <Box
                  backgroundColor={props?.hour == data ? 'primary3' : 'white'}
                  borderRadius={5}
                  width={wp(11)}
                  alignItems="center"
                  justifyContent="center"
                  height={wp(11)}>
                  <Text
                    variant={
                      props?.hour == data
                        ? 'blackshade18800Regular'
                        : 'blackshade116500Regular'
                    }
                    m="s">
                    {data}
                  </Text>
                </Box>
              );
            }}
            onValueChange={(data, selectedIndex) => {
              props.SelectHours(data);
              //
            }}
            wrapperHeight={wp(27)}
            wrapperWidth={150}
            wrapperColor="#FFFFFF"
            itemHeight={50}
            highlightColor="#fff"
            highlightBorderWidth={2}
          />
          {/* <Text variant="blackshade18800Regular" m="s">
                          {vanue?.opening.split(':')[0]}
                        </Text> */}
        </Box>
        <Text marginHorizontal="s" variant="blackshade18800Regular">
          :
        </Text>
        <Box height={wp(27)}>
          <ScrollPicker
            ref={refMin}
            dataSource={[0, 30].map(i => (i < 10 ? '0' + i : i))}
            // selectedIndex={0}
            // selectedIndex={props?.min ? props?.min : 0}
            wrapperBackground="green"
            renderItem={(data, index) => {
              //
              return (
                <Box
                  backgroundColor={props?.min == data ? 'primary3' : 'white'}
                  borderRadius={5}
                  width={wp(11)}
                  alignItems="center"
                  justifyContent="center"
                  height={wp(10)}>
                  <Text
                    variant={
                      props?.min == data
                        ? 'blackshade18800Regular'
                        : 'blackshade116500Regular'
                    }
                    m="s">
                    {data}
                  </Text>
                </Box>
              );
            }}
            onValueChange={(data, selectedIndex) => {
              props.SelectMinute(data);

              //
            }}
            wrapperHeight={wp(27)}
            wrapperWidth={150}
            wrapperColor="#FFFFFF"
            itemHeight={50}
            highlightColor="#fff"
            highlightBorderWidth={2}
          />
          {/* <Text variant="blackshade18800Regular" m="s">
                          {vanue?.opening.split(':')[0]}
                        </Text> */}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(FetchTime);
