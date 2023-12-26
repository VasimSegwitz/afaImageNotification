import React, {memo, useState, useMemo, useEffect} from 'react';
import {ScrollView, StyleSheet, Switch, FlatList} from 'react-native';
import theme, {
  Box,
  palette,
  Text,
  TouchableBox,
  size,
  TypographyStyles,
} from '../../../../Theme/Index';

import FastImage from 'react-native-fast-image';
import {Slider} from '../../../../ReusableComponents/Slider';
import {EntypoIcon} from '../../../../ReusableComponents/Icons';
import {wp} from '../../../../Helpers/responsive-ratio';
import {Images} from '../../../../../Constant/Image';

const GameSkillRequired = ({navigation, route, onSelectSkill, skillId}) => {
  const selectSkill = useMemo(
    () => [
      {
        id: 1,
        selected: false,
        name: 'Beginner',
      },
      {
        id: 2,
        selected: false,
        name: 'Intermediate',
      },
      {
        id: 3,
        selected: false,
        name: 'Advanced',
      },
    ],
    [],
  );

  const [skill, setSkill] = useState(skillId);

  useEffect(() => {
    setSkill(skillId);
  }, [skillId]);

  // const onSelect = item => {
  //   const temp = skill.map(skill => {
  //     return {
  //       ...skill,
  //       selected: skill?.id == item?.id ? true : false,
  //     };
  //   });
  //   onSelectSkill(item);
  //   Setskill(temp);
  // };

  return (
    <Box>
      <Slider
        containerStyle={{flex: 1, width: wp(85), marginLeft: 7}}
        maximumTrackTintColor={palette?.white}
        minimumTrackTintColor={palette?.primary}
        thumbTintColor={palette?.primary}
        label={['Beginner', 'Intermediate', 'Advanced']}
        // trackRightPadding={-10}a
        trackStyle={{
          height: 20,
          // marginHorizontal: 50,
          borderRadius: 10,
        }}
        onValueChange={item => {
          setSkill(item[0]);
          onSelectSkill(item[0]);
        }}
        // renderAboveThumbComponent={(e, v) => <Text>{e}</Text>}
        // renderTrackMarkComponent={e => <Text>{e}</Text>}

        thumbStyle={{
          height: 40,
          width: 40,
          borderRadius: 40 / 2,
        }}
        thumbTouchSize={{width: 50, height: 50}}
        minimumValue={1}
        maximumValue={3}
        value={skill}
        thumbImage={Images?.SliderGameThumb}
        step={1}
        trackMarks={[1, 2, 3]}
        renderTrackMarkComponent={e => {
          return EntypoIcon(
            'controller-record',
            wp(6),
            e == 4 ? palette?.primary : palette?.tertiary2,
          );
        }}
        maximumTrackStyle={{
          borderWidth: 1,
          borderColor: palette?.primary,
        }}
      />
      {/* <Box flexDirection="row" alignItems="center" mt="l">
        <Box
          style={{
            height: 1,
            width: size.width / 20,
            borderRadius: 1,
            borderStyle: 'dashed',
          }}
        />
        <Text
          variant={skill[0]?.selected ? 'primary14500' : 'placeholder14400'}>
          {skill[0]?.name}
        </Text>
        <Box
          style={{
            height: 1,
            width: size.width / 8,
          }}
        />
        <Text
          variant={skill[1]?.selected ? 'primary14500' : 'placeholder14400'}>
          {skill[1]?.name}
        </Text>
        <Box
          style={{
            height: 1,
            width: size.width / 8,
          }}
        />

        <Text
          variant={skill[2]?.selected ? 'primary14500' : 'placeholder14400'}>
          {skill[2]?.name}
        </Text>
        <Box
          style={{
            height: 1,
            width: size.width / 11,
          }}
        />
      </Box>

      <Box flexDirection="row" alignItems="center" mt="s">
        <Box
          style={{
            height: 1,
            width: size.width / 11,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: 'red',
            borderStyle: 'dashed',
          }}
        />
        <TouchableBox
          borderColor="primary"
          backgroundColor={skill[0]?.selected ? 'primary' : 'white'}
          height={16}
          width={16}
          borderWidth={1}
          borderRadius={16 / 2}
          onPress={() => onSelect(skill[0])}
        />
        <Box
          style={{
            height: 1,
            width: size.width / 3.5,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: 'red',
            borderStyle: 'dashed',
          }}
        />
        <TouchableBox
          borderColor="primary"
          borderWidth={1}
          backgroundColor={skill[1]?.selected ? 'primary' : 'white'}
          height={16}
          width={16}
          borderRadius={16 / 2}
          onPress={() => onSelect(skill[1])}
        />
        <Box
          style={{
            height: 1,
            width: size.width / 3.5,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: 'red',
            borderStyle: 'dashed',
          }}
        />

        <TouchableBox
          borderColor="primary"
          backgroundColor={skill[2]?.selected ? 'primary' : 'white'}
          borderWidth={1}
          height={16}
          width={16}
          borderRadius={16 / 2}
          onPress={() => onSelect(skill[2])}
        />
        <Box
          style={{
            height: 1,
            width: size.width / 11,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: 'red',
            borderStyle: 'dashed',
          }}
        />
      </Box> */}
    </Box>
  );
};
const styles = StyleSheet.create({
  content: {flexGrow: 1},
});

export default memo(GameSkillRequired);
