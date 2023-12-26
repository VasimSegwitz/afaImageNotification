import React, {memo, useState, useMemo} from 'react';
import {ScrollView, StyleSheet, Switch, FlatList, Image} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
  fonts,
} from '../../../Theme/Index';
import {Button} from '../../../ReusableComponents/index';
import {Input} from '../../../ReusableComponents/Input/index';
import FastImage from 'react-native-fast-image';
import SelectSport from './SelectSport/SelectSport';
import Party from '../../../../assets/Booking/CreateActivity/Party/Party.png';
const AnotherSport = require('../../../../assets/Booking/SearchVenues/AnotherSport/AnotherSport.png');

import Running from '../../../../assets/Booking/CreateActivity/Running/Running.png';
import GameFormat from './GameFormat/GameFormat';
import Multiline from './MultiLine/MultiLine';
import {useDispatch, useSelector} from 'react-redux';
import TypesOfSports from '../../SearchVenues/BookingSearch/TypesOfSports/TypesOfSports';
import {Ionicon} from '../../../ReusableComponents/Icons';
import {wp} from '../../../Helpers/responsive-ratio';
import RadioButton from '../../../ReusableComponents/RadioButton';
import {ActivityConstants} from '../../../../Redux';
import {displayErrorToast} from '../../../../utils';
const statusData = [
  {
    id: 1,
    selected: false,
    name: 'Public',
    subName: 'This Activity can be discovered by all Players on the App',
  },
  {
    id: 2,
    selected: false,
    name: 'Invite only',
    subName:
      'This Activity cannot be searched and can be accessed only via shared link',
  },
];

const DATA = [
  {
    id: 1,
    selected: false,
    name: 'Bring your own equipment',
  },
  {
    id: 2,
    selected: false,
    name: 'Additional information ',
  },
];
const Settings = ({navigation, route}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const activityBody = useSelector(state => state?.activity?.activity?.body);
  const sport = useSelector(
    state => state?.auth?.user?.user?.data?.favorite_sports,
  );

  const [mainCat, setMaincat] = useState(sport);
  const [privacyAccess, setPrivacyAccess] = useState(statusData);
  const [additional, setAdditional] = useState(DATA);
  const [activityName, setActivityName] = useState('');
  const [additionalInfo, setAdditionalinfo] = useState('');
  const [anothersport, setAnotherSport] = useState('');
  const [gameFormat, setgameFormat] = useState();
  const [categoryId, setCategoryId] = useState(null)

  const dispatch = useDispatch();

  /**
   * @function onSelectCategory
   * @param item
   * @description this function will set flag true which is selected
   */

  const onSelectCategory = item => {
    // mainCat
    const temp = mainCat.map(cat => {
      return {
        ...cat,
        flag: cat?.id == item?.id ? true : false,
      };
    });

    setMaincat(temp);
    setCategoryId(item?.category?.id)
  };

  /**
   * @function onSelectAnotherSport
   * @param item
   * @description this function will set the sport if select deifferent
   */

  const onSelectAnotherSport = item => {
    setAnotherSport(item);
  };

  /**
   * @function setGame
   * @param item
   * @description this will set the game format
   */

  const setGame = item => {
    setgameFormat(item);
  };

  /**
   * @function onSubmit
   * @description this function will validate the data and pass the data to next tab
   */

  const onSubmit = () => {
    if (!privacyAccess?.some(item => item?.selected)) {
      displayErrorToast('kindly select privacy access');
      return;
    }
    if (!gameFormat) {
      displayErrorToast('kindly select formation of game');
      return;
    }

    const body = {
      ...activityBody,
      category_id: (categoryId != 0) ? categoryId : null,
      game_format: gameFormat?.id,
      name: activityName || 'Activity',
      privacy_level: privacyAccess?.find(item => item?.selected)?.id,

      is_bring_own_equipment:
        additional?.find(item => item?.selected)?.id == 1 ? true : false,
      additional_information: additionalInfo,
    };

    dispatch({
      type: ActivityConstants?.CREATEACTIVITYBODY,
      body: body,
    });

    navigation.navigate('Players');
  };

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={styles.content}>
        <Box flex={1} mt="l">
          <Box marginHorizontal="l">
            <Box mb="l">
              <Text variant="blackshade16800Semi">Select Sport</Text>
            </Box>
            {/* <SelectSport /> */}
            <TypesOfSports
              TypeOfSportsData={mainCat}
              onSelect={onSelectCategory}
              navigation={navigation}
            />
            <Box>
              <TouchableBox
                onPress={() => {
                  // navigation.navigate('SelectSport');
                  navigation?.navigate('SelectSports', {
                    selectSport: onSelectAnotherSport,
                  });
                }}
                flexDirection="row"
                borderRadius={10}
                height={40}
                backgroundColor={anothersport != '' ? 'white' : 'primary2'}
                // marginHorizontal="m"
                justifyContent="center"
                style={TypographyStyles?.cardShadow}
                alignItems="center">
                <Box
                  flexDirection="row"
                  justifyContent={
                    anothersport == '' ? 'center' : 'space-between'
                  }
                  width={wp(80)}>
                  {anothersport == '' && (
                    <Image
                      source={AnotherSport}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                      resizeMode={FastImage?.resizeMode?.contain}
                    />
                  )}
                  <Text
                    // textTransform="uppercase"
                    numberOfLines={2}
                    variant="blackshade14800">
                    {anothersport != ''
                      ? anothersport[0]?.name
                      : ' Select a Sport'}
                  </Text>
                </Box>
                {anothersport && (
                  <TouchableBox onPress={() => setAnotherSport('')}>
                    {Ionicon('close', 20, palette?.blackshade)}
                  </TouchableBox>
                )}
              </TouchableBox>
            </Box>
            <Box mt="l">
              <TouchableBox
                flexDirection="row"
                backgroundColor="white"
                height={40}
                borderWidth={1}
                borderColor="primary"
                justifyContent="center"
                alignItems="center"
                borderRadius={10}>
                <FastImage
                  resizeMode={FastImage?.resizeMode?.contain}
                  source={Party}
                  style={{height: 18, width: 18}}
                />
                <Text variant="blackshade14800" ml="m">
                  This is not a sport activity
                </Text>
              </TouchableBox>
            </Box>
            <Box>
              <Box mt="l" flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Semi">Game Format</Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (optional)
                </Text>
              </Box>
              <Box mt="l">
                <GameFormat setGame={setGame} />
              </Box>
            </Box>
            <Box>
              <Box mt="l" flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Semi">Activity Name</Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (optional)
                </Text>
              </Box>
              <Text variant="blackshade114800Regular" mt="s">
                If you cannot find your Sport or Activity from the list above,
                please give your Activity a name
              </Text>
              <Box mt="l">
                <Input
                  placeholder="Name of the Activity"
                  onChange={e => setActivityName(e)}
                />
              </Box>
            </Box>
            <Box mb="l">
              <Text variant="blackshade16800Semi">Privacy Access</Text>
            </Box>
            <FlatList
              data={privacyAccess}
              renderItem={({item}) => {
                const {selected, name, subName} = item;
                return (
                  <Box mb="m">
                    <RadioButton
                      text={name}
                      subname={subName}
                      selected={selected}
                      onPress={() => {
                        const d = privacyAccess?.map(it => {
                          if (item?.name == it?.name)
                            return {...it, selected: !it?.selected};
                          else return {...it, selected: false};
                        });
                        setPrivacyAccess(d);
                      }}
                      radio
                      textStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 16,
                        lineHeight: 22,
                        color: palette?.blackshade,
                      }}
                      subnameStyle={{
                        fontFamily: fonts?.regular,
                        fontWeight: '400',
                        fontSize: 12,
                        lineHeight: 22,
                        color: palette?.blackshade1,
                      }}
                    />

                    {/* <Box
                      justifyContent="center"
                      alignItems="center"
                      borderWidth={1}
                      borderColor={selected ? 'primary' : 'tertiary2'}
                      height={25}
                      width={25}
                      borderRadius={25 / 2}>
                      <Box
                        backgroundColor={selected ? 'primary' : 'white'}
                        height={16}
                        width={16}
                        borderRadius={16 / 2}
                      />
                    </Box>
                    <Box ml="m">
                      <Text variant="blackshade16800Regular">{name}</Text>
                      <Text variant="blackshade114800Regular">{subName}</Text>
                    </Box> */}
                  </Box>
                );
              }}
            />
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="blackshade16800Semi">Post to your Group</Text>
              <Switch
                trackColor={{false: palette.inputBorder, true: palette.primary}}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </Box>
            <Text variant="blackshade114800Regular" mt="s">
              Choose Groups that you want to share with other members about this
              Activity
            </Text>
            <Box>
              <Box mt="l" flexDirection="row" alignItems="center">
                <Text variant="blackshade16800Semi">
                  Additional Instruction
                </Text>
                <Text variant="blackshade116500Regular" ml="s">
                  (optional)
                </Text>
              </Box>
              <Box mb="l">
                <FlatList
                  data={additional}
                  renderItem={({item}) => {
                    const {name, selected} = item;
                    return (
                      <Box flexDirection="row" mt="m">
                        <RadioButton
                          text={name}
                          selected={selected}
                          onPress={() => {
                            const d = additional?.map(it => {
                              if (item?.name == it?.name)
                                return {...it, selected: !it?.selected};
                              else return {...it, selected: it?.selected};
                            });
                            setAdditional(d);
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
                  }}
                />
              </Box>
              {additional[1]?.selected == true ? (
                <Box mt="s" mb="l">
                  <Multiline
                    inputStyle={{height: 102}}
                    placeholder="Name of the Activity"
                    onChangeText={e => setAdditionalinfo(e)}
                    value={additionalInfo}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Box flex={1} justifyContent="flex-end" mb="l">
        <Box height={46} marginHorizontal="l" mt="l">
          <Box height={46}>
            <Button
              label="Continue"
              onPress={() => {
                onSubmit();
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  content: {flexGrow: 1, paddingBottom: 50},
});

export default Settings;
