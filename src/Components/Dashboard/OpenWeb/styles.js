import {StyleSheet, Dimensions} from 'react-native';
import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: palette.black,
    marginBottom: 20,
    marginTop: 20,
  },
  txt: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#848484',
    lineHeight: 23,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
