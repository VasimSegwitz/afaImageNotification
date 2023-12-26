import React, {memo, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, SectionList, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../Theme/Index';
import {Button, Header} from '../../../ReusableComponents/index';
import FastImage from 'react-native-fast-image';
import {wp} from '../../../Helpers/responsive-ratio';
import Info from './Info/Info';
import Reviews from './Reviews/Reviews';
import Upcoming from './Upcoming/Upcoming';
import VenuInfoToptab from './VenuInfoToptab';
const Heart = require('../../../../assets/Booking/SearchResults/Heart/Heart.png');
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';
import moment from 'moment';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {Ionicon} from '../../../ReusableComponents/Icons';

const Tab = createMaterialTopTabNavigator();

const VenueInfo = ({navigation, route, TypeOfSportsData}) => {
  const {vanue} = route?.params;
  const [tabIndex, setTabIndex] = useState(0);
  const {location} = useSelector(state => state.auth.user);
  const [popup, setPopup] = useState(false);
  const [facilityId, setFacilityId] = useState(0);

  return (
    <Box flex={1} backgroundColor="white">
      {popup && (
        <TouchableBox
          onPress={() => {
            setPopup(false);
            setFacilityId(0);
          }}
          style={[styles.overLay]}
        />
      )}
      <Header
        navigation={navigation}
        title={vanue?.name}
        left
        // RenderRightComponent={() => {
        //   return (
        //     <TouchableBox>
        //       <FastImage
        //         source={Heart}
        //         style={{
        //           height: 24,
        //           width: 24,
        //         }}
        //         resizeMode={FastImage?.resizeMode?.contain}
        //       />
        //     </TouchableBox>
        //   );
        // }}
      />
      <Tab.Navigator
        tabBar={props => (
          <VenuInfoToptab
            {...props}
            setTab={val => {
              setTabIndex(val);
            }}
          />
        )}>
        <Tab.Screen
          name="Info"
          component={Info}
          initialParams={{vanue, setPopup}}
        />
        {/* <Tab.Screen
          name="Upcoming"
          component={Upcoming}
          initialParams={{vanue}}
        />
        <Tab.Screen
          name="Reviews"
          component={Reviews}
          initialParams={{vanue}}
        /> */}
      </Tab.Navigator>
      {popup && (
        <Box backgroundColor={'white'} style={styles.confirmationModal}>
          <Box
            backgrounColor={'white'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginHorizontal={'l'}
            marginVertical={'l'}>
            <Text variant={'blackshade20500'}>Facility type</Text>
            <TouchableBox
              onPress={() => {
                setPopup(false);
                setFacilityId(0);
              }}>
              {Ionicon('close', 20, palette?.blackshade)}
            </TouchableBox>
          </Box>
          {vanue?.facilities?.some(it => it?.status == 1) && (
            <Text variant={'blackshade16400'} ml={'l'} mb={'l'}>
              Choose one option
            </Text>
          )}
          <Box>
            {vanue?.facilities.length > 0 &&
            vanue?.facilities?.some(it => it?.status == 1) ? (
              vanue?.facilities.map(data => {
                return (
                  data?.name &&
                  data?.status == 1 && (
                    <TouchableBox key={data?.id} ml={'l'} mb={'m'}>
                      <RadioButton
                        text={data?.name}
                        selected={facilityId === data.id}
                        onPress={() => setFacilityId(data.id)}
                        radio={true}
                      />
                    </TouchableBox>
                  )
                );
              })
            ) : (
              <Box alignItems={'center'}>
                <Text variant={'blackshade12400'}>
                  No facilities available for booking at the moment
                </Text>
              </Box>
            )}
          </Box>
          <Box height={45} marginHorizontal={'l'} mt={'l'} mb={'l'}>
            <Button
              label="Book"
              onPress={() => {
                navigation.navigate('CheckAvailability', {
                  vanue: vanue,
                  facility_id: facilityId,
                });
              }}
              disabled={facilityId == 0}
            />
          </Box>
        </Box>
      )}
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
  overLay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay,
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  confirmationModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    zIndex: 5,
  },
});

export default VenueInfo;
