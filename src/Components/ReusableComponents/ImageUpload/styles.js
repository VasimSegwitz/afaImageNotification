import {StyleSheet} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  userImage: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(25 / 2),
    marginLeft: wp(4),
    borderWidth: 0.5,
    borderColor: palette?.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    backgroundColor: palette.primary1,
    borderRadius: 38 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 35,
    right: 5,
  },
  uploadWrap: {
    width: 100,
  },
});
