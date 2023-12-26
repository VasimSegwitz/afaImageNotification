import React, {useState} from 'react';
import {Text, View, Pressable} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {palette} from '../../Theme/Index';
import ActionSheet from '../ActionSheet';
import {styles} from './styles';

const CustomPicker = ({
  style = {},
  name,
  options,
  onSelect,
  value,
  selectedValue,
  discribe,
  description,
}) => {
  const [openPicker, setOpenPicker] = useState(false);
  const togglePicker = () => setOpenPicker(prev => !prev);
  return (
    <>
      <Pressable style={[styles.picker, style]} onPress={togglePicker}>
        <View style={styles.infoView}>
          {selectedValue ? (
            <Text style={[styles.inputLabel, {color: palette.placeholder}]}>
              {name}
            </Text>
          ) : null}
          <Text
            style={[
              styles.optionName,
              {color: selectedValue ? palette.black : palette.placeholder},
              {paddingTop: selectedValue ? 10 : 0},
            ]}
            numberOfLines={1}>
            {selectedValue || name}
          </Text>
          {discribe ? <Text>{description}</Text> : null}
        </View>
        <Fontisto
          name={openPicker ? 'angle-up' : 'angle-down'}
          size={18}
          style={styles.rightArrow}
          color={palette.placeholder}
        />
      </Pressable>
      {openPicker ? (
        <ActionSheet
          visible={openPicker}
          onClose={togglePicker}
          onItemPress={onSelect}
          items={options}
          title={name}
          selectedItem={value}
        />
      ) : null}
    </>
  );
};

export default CustomPicker;
