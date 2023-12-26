import {StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  input: {
    borderWidth: 0.5,
    borderColor: palette.inputBorder,
    paddingHorizontal: 15,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '400',
    color: palette.black,
    fontFamily: fonts.regular,
    // height: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    position: 'absolute',
    left: 15,
    top: 5,
    fontSize: 14,
    color: palette.black,
    fontFamily: fonts.regular,
  },
  phoneEye: {
    position: 'absolute',
    height: wp(12),
    left: 15,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneCode: {
    fontSize: 14,
    color: palette.black,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  eye: {
    position: 'absolute',
    right: 15,
    // top: 5,
    zIndex: 9999,
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: palette.red,

    marginBottom: 20,
    marginTop: -8,
  },
});
