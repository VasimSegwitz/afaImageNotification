import {createBox, createText} from '@shopify/restyle';
import React, {useEffect, useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {size} from '../../Theme/Index';
import CheckMark from './CheckMark';
import Circle from './Circle';
import Line from './Line';
const Box = createBox();
const Text = createText();

export default props => {
  const {item, onPress, options} = props;
  const checkProgress = useSharedValue(0);
  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      first: true,
      line1: false,
      second: false,
      line2: false,
      showSecond: false,
      showThird: false,
      third: false,
      circleReverse1: false,
    },
  );

  useEffect(() => {
    setTimeout(() => {
      setState({line1: true});
    }, 500);
    setTimeout(() => {
      setState({second: true});
    }, 2500);
  }, []);

  useEffect(() => {
    if (options.address) {
      setState({showSecond: true});
      setTimeout(() => {
        setState({line2: true});
      }, 500);
      setTimeout(() => {
        setState({third: true});
      }, 2500);
    } else if (options.reverse) {
      setState({showThird: false, third: false});
      setTimeout(() => {
        setState({line2: false});
      }, 500);
      setTimeout(() => {
        setState({showSecond: false, second: true});
      }, 2500);
    }
    if (options.payment) {
      setState({showThird: true, third: true});
    }
  }, [options]);

  return (
    <View style={{}}>
      <View style={styles.main}>
        <View style={{}}>
          <CheckMark progress={state.first} />
        </View>
        <Line progress={state.line1} />
        {state.showSecond ? (
          <View>
            <CheckMark progress={state.second} />
          </View>
        ) : (
          <View>
            <Circle progress={state.second} reverse={state.circleReverse1} />
          </View>
        )}
        <Line progress={state.line2} />
        {state.showThird ? (
          <View>
            <CheckMark progress={state.third} />
          </View>
        ) : (
          <View>
            <Circle progress={state.third} />
          </View>
        )}
      </View>
      <View
        style={{
          marginBottom: 5,
          marginHorizontal: 25,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box>
          <Text> Cart</Text>
        </Box>
        <Box>
          {state.showSecond ? (
            <Text>{'       '}Address</Text>
          ) : (
            <Text>{'         '}Address</Text>
          )}
        </Box>
        <Box>
          {state.showThird ? (
            <Text>{'    '}Payment</Text>
          ) : (
            <Text>{'    '}Payment</Text>
          )}
        </Box>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 50,
    marginHorizontal: 25,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignSelf: 'center',
    height: 137,
    width: size.width - 40,
  },
});
