import React, {memo, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  SectionList,
  FlatList,
  Linking,
  Keyboard,
} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../../Theme/Index';
import {Button} from '../../../../ReusableComponents/index';
const Star = require('../../../../assets/Home/Star/Star.png');
import InfoList from './InfoList/InfoList';
import Banner from './Banner/Banner';
import {useSelector} from 'react-redux';
import {wp} from '../../../../Helpers/responsive-ratio';
import Animated from 'react-native-reanimated';

const Info = ({navigation, route, TypeOfSportsData}) => {
  const {vanue, setPopup} = route?.params;

  const loc = useSelector(state => state?.auth?.user?.userlocation);
  const startLat = loc?.location_lat;
  const startLong = loc?.location_long;
  const endLat = vanue?.location_lat;
  const endLong = vanue?.location_long;
  const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLong}&destination=${endLat},${endLong}`;

  const handleNavigation = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
    } catch (error) {}
  };

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView
        style={{flexGrow: 1}}
        automaticallyAdjustKeyboardInsets={true}>
        <Box mt="m" marginHorizontal="l">
          {vanue?.images.length > 0 && <Banner data={vanue} />}
        </Box>
        <Box justifyContent="space-between" flexDirection="row" mr={'m'}>
          <Box width={size.width / 1.5}>
            <Text numberOfLines={3} variant="tertiary312500" ml={'l'}>
              {vanue?.info?.address}
            </Text>
          </Box>
          <Box mr={'m'}>
            <TouchableBox
              onPress={handleNavigation}
              borderWidth={1}
              borderRadius={10}
              alignItems="center"
              height={28}
              justifyContent="center">
              <Text marginHorizontal="m" variant="blackshade12500">
                Open Maps
              </Text>
            </TouchableBox>
          </Box>
        </Box>
        <Box marginHorizontal="l">
          <Text numberOfLines={3} variant="tertiary312500">
            Tel: {vanue?.vendor?.phone_prefix}
            {vanue?.vendor?.phone}
          </Text>
        </Box>
        <Box flex={1}>
          <InfoList info={vanue} />
        </Box>
      </ScrollView>
      <Box>
        <Box marginVertical="m">
          <Box marginHorizontal="m" height={46}>
            <Button
              label="Book Now"
              onPress={() => {
                setPopup(true);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
});

export default Info;
