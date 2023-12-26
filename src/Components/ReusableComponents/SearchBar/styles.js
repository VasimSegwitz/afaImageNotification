import {StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  input: {
    // borderWidth: 1,
    // borderColor: '#DEDEDE',
    paddingRight: 15,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '400',
    color: palette?.blackshade,
    fontFamily: fonts.regular,
    height: 45,
    width: wp(79),
    alignItems: 'center',
    marginLeft: 0,
    paddingLeft: 50,
    // backgroundColor: '#FAFDFF',
  },

  inputLabel: {
    position: 'absolute',
    // left: 15,
    top: 5,
  },
  phoneCode: {
    fontSize: 16,
    color: palette.black,
    fontFamily: fonts.medium,
    position: 'absolute',
    top: 27,
    left: 15,
  },
  phoneEye: {
    // position: 'absolute',
    height: wp(12),
    left: wp(12),
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneCodes: {
    fontSize: 14,
    color: palette.black,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  eye: {
    position: 'absolute',
    left: wp(3),
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // top: wp(1.5),
    zIndex: 9999,
  },
  filter: {
    position: 'absolute',
    right: wp(3),
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // top: wp(1.5),
    zIndex: 9999,
  },
  errorText: {
    fontSize: 13,
    color: palette.red,
    marginBottom: 20,
    marginTop: -18,
  },
});
