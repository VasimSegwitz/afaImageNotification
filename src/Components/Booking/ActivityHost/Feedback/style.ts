import {Platform, StyleSheet} from 'react-native';
import {wp} from '../../../Helpers/responsive-ratio';

import {fonts, palette} from '../../../Theme/Index';

export const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#171717',
    fontFamily: fonts.regular,
    height: wp(12),
    width: '90%',
  },
  divider: {
    marginTop: wp(-3),
    marginBottom: wp(2),
    height: wp(0.3),
    backgroundColor: palette.tertiary2,
  },
  emailInputStyle: {
    borderColor: palette.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    height: wp(10),
    marginRight: wp(4),
    marginTop: wp(2)
  },
  image: {height: 24, width: 24},
});
