import React, {memo, useState} from 'react';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Images} from '../../../../Constant/Image';
import {displayErrorToast} from '../../../../utils';
import {wp} from '../../../Helpers/responsive-ratio';
import {Button, Header} from '../../../ReusableComponents';
import {AntDesignIcon, Ionicon} from '../../../ReusableComponents/Icons';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {
  Box,
  fonts,
  palette,
  Text,
  TouchableBox,
  TypographyStyles,
} from '../../../Theme/Index';

const rawData = {
  radius: [
    {
      label: '1 km',
      flag: false,
      value: 1,
    },
    {
      label: '3 km',
      flag: false,
      value: 3,
    },
    {
      label: '5 km',
      flag: false,
      value: 5,
    },
  ],
  gender: [
    {
      label: 'Men',
      flag: false,
      value: 1,
    },
    {
      label: 'Women',
      flag: false,
      value: 2,
    },
    {
      label: 'Mixed',
      flag: false,
      value: 3,
    },
  ],
  age: [
    {
      label: 'below 18',
      flag: false,
      min: 1,
      max: 18,
    },
    {
      label: '18 & above',
      flag: false,
      min: 18,
      max: 99,
    },
  ],
  playerskill: [
    {
      label: 'Beginner',
      flag: false,
      value: 1,
    },
    {
      label: 'intermediate',
      flag: false,
      value: 2,
    },
    {
      label: 'Advanced',
      flag: false,
      value: 3,
    },
  ],
  time: [
    {
      id: 1,
      name: 'Morning',

      flag: false,
      startTime: '12 am',
      startValue: '00:00',
      endValue: '09:00',

      endTime: '9 am',
      label: 'Morning (12am - 9am)',
    },
    {
      id: 2,
      name: 'Day',

      flag: false,
      startTime: '9 am',
      startValue: '09:00',
      endValue: '16:00',

      endTime: '4 pm',
      label: 'Day (9am - 4pm)',
    },
    {
      id: 3,
      name: 'Evening',

      flag: false,
      startTime: '4 pm',
      startValue: '16:00',
      endValue: '21:00',

      label: 'Evening (4pm - 9pm)',

      endTime: '9 pm',
    },
    {
      id: 4,
      name: 'Night',

      flag: false,
      startTime: '9 pm',
      startValue: '21:00',
      endValue: '00:00',

      endTime: '12 am',
      label: 'Night (9pm - 12am)',
    },
  ],
};

const VenueFilter = props => {
  const {navigation, route} = props;
  const {onSelectData} = route?.params;
  const {location, sport} = useSelector(state => state.auth.user);

  const [radius, setRadius] = useState(rawData?.radius);
  const [age, setAge] = useState(rawData?.age);
  const [gender, setGender] = useState(rawData?.gender);
  const [time, setTime] = useState(rawData?.time);
  const [playerSkill, setplayerSkill] = useState(rawData?.playerskill);
  const [anothersport, setAnotherSport] = useState('');
  const [prefState, setPrefState] = useState('-');
  const [prefCity, setPrefCity] = useState('-');

  const [loc, setLocation] = useState();
  const userLoc = useSelector(state => state?.auth?.user?.userlocation);
  const startLat = userLoc?.location_lat;
  const startLong = userLoc?.location_long;

  /**
   * @function changeLocation
   * @param item
   * @description this function set the location
   */

  const changeLocation = item => {
    setLocation(item);
  };

  /**
   * @function onSelectAnotherSport
   * @param item
   * @description this function will set the sport if select deifferent
   */

  const onSelectAnotherSport = item => {
    setAnotherSport(item);
  };

  const onSubmit = () => {
    const t = time?.map(item => {
      if (item?.flag)
        return {
          start: item?.startValue,
          end: item?.endValue,
        };
    });

    const p = playerSkill?.map(item => {
      if (item?.flag) return item?.value;
    });

    const g = gender?.map(item => {
      if (item?.flag) return item?.value;
    });

    const body = {
      category_id: anothersport[0]?.id,
      // location_lat: startLat,
      // location_long: startLong,
      // radius: radius?.find(item => item?.flag)?.value,
      // timings: t.filter(i => i),

      // player_skills: p.filter(i => i),
      // min_age: age?.find(item => item?.flag)?.min,
      // max_age: age?.find(item => item?.flag)?.max,
      // gender_options: g.filter(i => i),
      state: prefState,
      city: prefCity,
    };

    navigation?.navigate('DashboardSearch', {
      filterBody: body,
    });
  };

  return (
    <Box flex={1} mb="m" backgroundColor={'white'}>
      <Header close title={'Venue Filter options'} />
      <ScrollView
        style={{flex: 1, padding: 15, marginBottom: 50}}
        contentContainerStyle={{
          paddingBottom: wp(10),
        }}>
        <Text variant={'blackshade16600'} mb="l">
          Sport
        </Text>
        <Button
          RenderComponent={() => (
            <Box
              p="s"
              flexDirection={'row'}
              style={
                ([TypographyStyles.cardShadow],
                {
                  width: '100%',
                  height: wp(10),

                  alignItems: 'center',
                  justifyContent:
                    anothersport != '' ? 'space-between' : 'center',

                  //   borderWidth: 1,
                  // borderColor: '#C1C1C1'
                  paddingLeft: 10,
                  borderRadius: 5,
                })
              }>
              {anothersport == '' && (
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={Images.SetupsportLeft}
                  style={{
                    height: wp(5),
                    width: wp(5),
                    marginRight: wp(2),
                  }}
                />
              )}
              <Text textTransform="uppercase" variant={'blackshade14500'}>
                {anothersport != '' ? anothersport[0]?.name : 'Select a Sport'}
              </Text>
              {anothersport != '' && (
                <Box marginRight={'mt'}>
                  {Ionicon('close', 20, palette?.blackshade)}
                </Box>
              )}
            </Box>
          )}
          // onPress={}
          onPress={() =>
            navigation?.navigate('SelectSports', {
              selectSport: onSelectAnotherSport,
              from: 'greeting',
            })
          }
          buttonColor={anothersport != '' ? 'white' : '#FFEEE6'}
        />

        <Text variant={'blackshade16600'} mt="l">
          Location
        </Text>

        <TouchableBox
          mt={'l'}
          borderWidth={0.5}
          borderRadius={5}
          p={'s'}
          backgroundColor={'white'}
          style={{borderColor: palette?.tertiary2}}
          onPress={() => {
            navigation.navigate('SelectState', {
              setPrefState: setPrefState,
              setPrefCity: setPrefCity,
            });
          }}>
          <Box
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text ml={'s'} variant={'tertiary14500'}>
              State
            </Text>
            {AntDesignIcon('down', wp(6), palette?.tertiary1)}
          </Box>
          <Text ml={'s'} mt={'s'} variant={'primary16500'}>
            {prefState}
          </Text>
        </TouchableBox>

        <TouchableBox
          mt={'l'}
          borderWidth={0.5}
          borderRadius={5}
          p={'s'}
          backgroundColor={'white'}
          style={{borderColor: palette?.tertiary2}}
          onPress={() => {
            if (prefState == '-')
              return displayErrorToast('Select State For Choosing City');
            navigation.navigate('SelectCity', {
              setPrefCity: setPrefCity,
              prefState: prefState,
            });
          }}>
          <Box
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Text ml={'s'} variant={'tertiary14500'}>
              City
            </Text>
            {AntDesignIcon('down', wp(6), palette?.tertiary1)}
          </Box>
          <Text ml={'s'} mt={'s'} variant={'primary16500'}>
            {prefCity}
          </Text>
        </TouchableBox>

        {/* <Button
          RenderComponent={() => (
            <Box
              p="s"
              flexDirection={'row'}
              style={
                (
                {
                  width: '89%',
                  height: wp(15),
                  marginLeft: 10,

                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 5,
                })
              }>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={Images.markerLocation}
                style={{
                  height: wp(7),
                  width: wp(7),
                  marginRight: wp(2),
                  marginTop: wp(1),
                }}
              />
              <Text
                textTransform="uppercase"
                numberOfLines={2}
                variant={'blackshade14500'}
                style={{ width: wp(70) }}
                textAlign={"center"}>
                {loc ? loc : 'Select Location'}
              </Text>
              {loc && (
                <Box marginRight={'mt'}>
                  {Ionicon('close', 20, palette?.blackshade)}
                </Box>
              )}
            </Box>
          )}
          // onPress={}
          onPress={() =>
            navigation?.navigate('ChangeLocation', {
              setLocation: changeLocation,
              from: 'venueFilter'
            })
          }
          buttonColor={location?.length > 0 ? '#fff' : '#FFEEE6'}
          buttonStyle={{height: wp(15)}}
        />
        <Text variant={'blackshade16600'} marginVertical="l">
          Radius
        </Text>
        <Box flexDirection={'row'} flexWrap="wrap">
          {radius?.map(item => {
            return (
              <Box mr="l">
                <RadioButton
                  text={item?.label}
                  selected={item?.flag}
                  onPress={() => {
                    const d = radius?.map(it => {
                      if (item?.label == it?.label)
                        return {...it, flag: !it?.flag};
                      else return {...it, flag: false};
                    });
                    setRadius(d);
                  }}
                  radio
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                  }}
                />
              </Box>
            );
          })}
        </Box> */}
        {/* <Text variant={'blackshade16600'} marginVertical="l">
          Time
        </Text>
        <Box>
          {time?.map(item => {
   
            return (
              <Box mb="m">
                <RadioButton
                  text={item?.label}
                  selected={item?.flag}
                  onPress={() => {
                    const d = time?.map(it => {
                      if (item?.label == it?.label)
                        return {...it, flag: !it?.flag};
                      else return {...it};
                    });
                  
                    setTime(d);
                  }}
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Text variant={'blackshade16600'} marginVertical="l">
          Player skill level
        </Text>
        <Box mb="l">
          {playerSkill?.map(item => {

            return (
              <Box mb="m">
                <RadioButton
                  text={item?.label}
                  selected={item?.flag}
                  onPress={() => {
                    const d = playerSkill?.map(it => {
                      if (item?.label == it?.label)
                        return {...it, flag: !it?.flag};
                      else return {...it, flag: false};
                    });
                    setplayerSkill(d);
                  }}
                  radio
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Text variant={'blackshade16600'} marginVertical="l">
          Age
        </Text>
        <Box flexDirection={'row'} flexWrap="wrap">
          {age?.map(item => {
      
            return (
              <Box mr="l">
                <RadioButton
                  text={item?.label}
                  selected={item?.flag}
                  onPress={() => {
                    const d = age?.map(it => {
                      if (item?.label == it?.label)
                        return {...it, flag: !it?.flag};
                      else return {...it, flag: false};
                    });
                    setAge(d);
                  }}
                  radio
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Text variant={'blackshade16600'} marginVertical="l">
          Gender
        </Text>
        <Box flexDirection={'row'} flexWrap="wrap">
          {gender?.map(item => {
   
            return (
              <Box mr="l">
                <RadioButton
                  text={item?.label}
                  selected={item?.flag}
                  onPress={() => {
                    const d = gender?.map(it => {
                      if (item?.label == it?.label)
                        return {...it, flag: !it?.flag};
                      else return {...it, flag: false};
                    });
                    setGender(d);
                  }}
                  radio
                  textStyle={{
                    fontFamily: fonts?.regular,
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 22,
                    color: palette?.blackshade,
                  }}
                />
              </Box>
            );
          })}
        </Box> */}
      </ScrollView>
      <Box
        width={wp(100) - 30}
        position={'absolute'}
        bottom={wp(1)}
        flexDirection="row"
        justifyContent={'space-between'}
        alignItems="center"
        alignSelf="center">
        <Button
          onPress={() => onSubmit()}
          label={'Apply Filters'}
          buttonStyle={{
            height: wp(11),
            width: (wp(100) - 40) / 2,
            marginBottom: 10,
          }}
        />
        <Button
          onPress={() => navigation?.goBack()}
          label={'Reset'}
          buttonColor="white"
          textStyle={{
            color: 'black',
            fontSize: 16,
            fontFamily: fonts.medium,
            fontWeight: '500',
          }}
          buttonStyle={{
            height: wp(11),
            width: (wp(100) - 40) / 2,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: palette?.primary,
          }}
        />
      </Box>
    </Box>
  );
};

export default memo(VenueFilter);
