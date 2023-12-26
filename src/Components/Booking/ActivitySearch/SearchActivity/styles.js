import {StyleSheet} from 'react-native';
import {wp} from '../../../Helpers/responsive-ratio';
import {palette} from '../../../Theme/Index';

const styles = StyleSheet.create({
  filter: {
    position: 'absolute',
    right: wp(3),
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // top: wp(1.5),
    zIndex: 9999,
  },
  content: {flexGrow: 1},
  orangeDot: {
    backgroundColor: palette.primary,
    height: 8,
    borderRadius: 5,
    width: 20,
  },
  border: {
    width: 50,
    alignSelf: 'center',
    marginTop: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: palette.inputBorder,
  },
});

export default styles;
