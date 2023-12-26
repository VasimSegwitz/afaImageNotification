import {Platform, StyleSheet} from 'react-native';

import {fonts, palette} from '../../Theme/Index';

export const styles = StyleSheet.create({
  inputHomeRowInfo: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    zIndex: 9999,
  },
  titleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  border: {
    backgroundColor: palette.black,
    height: 2,
    width: '20%',
    alignSelf: 'center',
    opacity: 0.8,
    marginTop: 5,
  },
  divider: {
    backgroundColor: palette.greyishBrown,
    height: 1,
    width: '100%',
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 5,
    marginBottom: 5,
  },
  exit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  touchHomeRowInfo: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  homeInput: {
    fontSize: 15,
    color: palette.black,
    paddingBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 16,
    color: palette.black,
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  titleText: {
    color: palette.black,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  subTitleText: {
    color: palette.black,
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 12,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
    flex: 1,
    zIndex: 99999,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  buttonStyle: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
});
