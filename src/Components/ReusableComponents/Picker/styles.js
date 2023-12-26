import {StyleSheet} from 'react-native';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  picker: {
    position: 'relative',
    borderWidth: 1,
    borderColor: palette.inputBorder,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    color: palette.black,
    fontFamily: fonts.medium,
    height: 65,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },

  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  optionName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    lineHeight: 17,
    textTransform: 'capitalize',
  },
  rightArrow: {
    position: 'absolute',
    right: 20,
  },
  inputLabel: {
    position: 'absolute',
    left: 0,
    top: -15,
  },
});
