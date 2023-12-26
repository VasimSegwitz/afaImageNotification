import {StyleSheet} from 'react-native';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  radioWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 10,
  },
  optionText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    textTransform: 'capitalize',
    color: palette.black,
    marginLeft: 5,
    marginTop: -2,
  },
  radioIos: {
    width: 20,
    height: 20,
    borderColor: palette.border,
    borderRadius: 20 / 2,
    borderWidth: 1,
    marginRight: 5,
  },
});
