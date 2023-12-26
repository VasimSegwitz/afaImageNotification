import React, {useState} from 'react';
import {Box, palette, size, Text, TouchableBox} from '../../Theme/Index';
import {ScrollView, StyleSheet, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {wp} from '../../Helpers/responsive-ratio';
import {Header} from '../../ReusableComponents';
import VenueTab from './venueTab';
import {useNavigation} from '@react-navigation/native';
import {Back, EvilIcon} from '../../ReusableComponents/Icons';
import {useSelector} from 'react-redux';
import SearchBar from '../../ReusableComponents/SearchBar';

const Venues = props => {
  const {route} = props;
  const navigation = useNavigation();
  const location = useSelector(state => state?.auth?.user?.userlocation);
  var g = location?.name.split(',');
  const loc = g.splice(g.length - 3).join(',');
  const loc_lat = location?.location_lat;
  const loc_long = location?.location_long;

  const [body, setBody] = useState({
    loc_lat: loc_lat,
    loc_long: loc_long,
    start: 0,
    length: 20,
    order: [
      {
        column: 0,
        dir: 'asc',
      },
    ],
  });

  const setBodyNow = data => {
    const parse = JSON.parse(JSON.stringify(data));
    setBody({
      ...body,
      ...parse,
    });
  };

  return (
    <Box flex={1} backgroundColor={'white'}>
      <Box flex={0.3}>
        <ImageBackground
          source={Images?.Venue}
          style={styles.headerImage}
          resizeMode={FastImage?.resizeMode?.stretch}>
          <Box
            style={{
              marginTop: route?.params?.space?.top,
            }}
            ml={'m'}
            flexDirection={'row'}
            alignItems={'center'}>
            <TouchableBox onPress={() => navigation.goBack()}>
              {Back('angle-left', wp(6), palette?.primary)}
            </TouchableBox>
            <TouchableBox
              onPress={() => navigation.navigate('DashboardSearch')}>
              <SearchBar
                placeholder={'Search Venue'}
                placeholderTextColor={palette?.placeholder}
                filter={true}
                onFilter={() => {
                  navigation.navigate('VenueFilter', {
                    onSelectData: setBodyNow,
                  });
                }}
                onFocus={() => navigation.navigate('DashboardSearch')}
                inputStyle={{
                  paddingRight: 60,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
                primary={true}
                // editable={true}
              />
            </TouchableBox>
          </Box>
          <Box
            flex={1}
            style={{
              marginTop: wp(16),
              marginLeft: wp(3),
              flexDirection: 'row',
            }}>
            <Box>{EvilIcon('location', wp(6), 'white')}</Box>
            <Text fontSize={12} variant={'white14400'} style={{width: wp(80)}}>
              {loc}
            </Text>
          </Box>
        </ImageBackground>
      </Box>
      <Box flex={1}>
        <VenueTab body={body} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    height: wp(50),
    width: '100%',
  },
});

export default Venues;
