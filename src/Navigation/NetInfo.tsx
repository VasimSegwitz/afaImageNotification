import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {hp, wp} from '../Components/Helpers/responsive-ratio';
import {Box, Text, TypographyStyles} from '../Components/Theme/Index';
import FastImage from 'react-native-fast-image';
import {Images} from '../Constant/Image';
import {Button} from '../Components/ReusableComponents';

export default props => {
  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  const [connectionStatus, setConnectionStatus] = React.useState(true);
  const [height, setHeight] = React.useState(hp(40));

  const [connectionType, setConnectionType] = React.useState(null);

  const handleNetworkChange = state => {
    setConnectionStatus(state.isConnected);
    setConnectionType(state.type);
  };

  const onRefres = () => {
    NetInfo.refresh().then(state => {
      setConnectionStatus(state.isConnected);
      setConnectionType(state.type);
    });
  };

  if (connectionStatus == false)
    return (
      <Box
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          setHeight(height);
        }}
        // flex={1}
        p={'l'}
        backgroundColor={'white'}
        style={[
          styles.confirmationModal,
          TypographyStyles.cardShadow,
          {
            marginTop: (hp(100) - height) / 2,
          },
        ]}>
        <Box justifyContent={'center'} alignItems={'center'}>
          <Text variant={'blackshade20500'} textAlign={'center'} mt={'l'}>
            No internet connection
          </Text>
          <FastImage
            source={Images.NetworkProblem}
            style={{
              height: wp(15),
              width: wp(15),
              marginVertical: wp(5),
            }}
            resizeMode={FastImage?.resizeMode?.contain}
          />
          <Text variant={'blackshade16400'} textAlign={'center'}>
            Please check your network connection and try again.
          </Text>
        </Box>
        <Box mt={'l'} mb={'m'}>
          <Button label="Refresh" onPress={() => onRefres()} />
        </Box>
      </Box>
    );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    // top: wp(50),
    marginHorizontal: wp(8),
    borderRadius: 15,
    zIndex: 9999,
  },
});
