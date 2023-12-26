import {Text, View} from 'react-native';
import {Box, palette} from '../../Theme/Index';
import {Down, EntypoIcon} from '../Icons';
import SelectDropdown from '../selectBox/src/SelectDropdown';
import {styles} from './styles';

/**
 * @function Dropdown
 * @params props
 * @decription a componant for the dropdown as per the ui
 */

const Dropdown = props => {
  return (
    <SelectDropdown
      data={props.data}
      onSelect={props.onSelect}
      buttonStyle={props?.sear ? props?.sear : styles.dropdown3BtnStyle}
      renderCustomizedButtonChild={(selectedItem, index) => {
        return (
          <View style={styles.dropdown3BtnChildStyle}>
            <Text style={props?.texn ? props?.texn : styles.dropdown3BtnTxt}>
              {selectedItem ? selectedItem.label : props.title}
            </Text>
          </View>
        );
      }}
      renderDropdownIcon={() => {
        return (
          <Box>
            {EntypoIcon(
              (name = 'chevron-down'),
              (size = 17),
              (color = palette.border),
            )}
          </Box>
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={styles.dropdown3DropdownStyle}
      rowStyle={styles.dropdown3RowStyle}
      renderCustomizedRowChild={(item, index) => {
        return (
          <View style={styles.dropdown3RowChildStyle}>
            <Text style={styles.dropdown3RowTxt}>{item.label}</Text>
          </View>
        );
      }}
    />
  );
};

export default Dropdown;
