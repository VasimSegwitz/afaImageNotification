import {StyleSheet} from 'react-native';
import {palette} from '../../../Theme/Index';

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 20,
    width: 20,
  },
  autolighting: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 5,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: palette?.tertiary2,
    height: 14,
    marginHorizontal: 5,
  },
  bookingDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
  horizontalDivider: {
    borderBottomWidth: 0.5,
    marginHorizontal: 10,
    top: -10,
    borderColor: palette?.tertiary2,
  },
  refundPolicy: {
    marginHorizontal: 16,
  },
  overLay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay,
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
});

export default styles;
