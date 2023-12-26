import {StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 45,
    backgroundColor: palette.primary1,
    borderRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: wp(4),
    fontFamily: fonts.medium,
    fontWeight: '500',
    lineHeight: 22,
    color: palette.white,
  },
  image: {
    height: wp(8),
    width: wp(8),
  },
});
