import {Platform, StyleSheet} from 'react-native';
import {wp} from '../../../Helpers/responsive-ratio';

import {TypographyStyles, fonts, palette} from '../../../Theme/Index';

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: '100%',
    // position: 'absolute',
    // left: 0,
    // top: 0,
    width: '100%',
    // zIndex: 1,
    flex: 0.5,
  },
  modalStyle: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    zIndex: 9999,
    overflow: 'hidden',
    padding: 15,
    flex: 0.7,
  },
  whiteCard: {
    backgroundColor: palette.white,
    zIndex: 9999,
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    flex: 1,
  },
  closeIcon: {
    // position: 'absolute',
    zIndex: 9999999,
    // right: 20,
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: palette.blackshade,
    left: 5,
  },
  modalHeader: {},
  dateText: {
    fontSize: 18,
    textAlign: 'center',
    color: palette.black,
    fontFamily: fonts.semibold,
    marginBottom: 5,
    marginTop: 10,
  },
  ButtonText: {
    fontSize: 20,
    color: palette.black,
    fontFamily: fonts.bold,
  },
  buttonsWrap: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  textEditWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  Editnumber: {
    fontSize: 14,
    color: '#737373',
    // paddingTop: 20,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  number: {
    fontSize: 24,
    color: palette.blackshade,
    // paddingTop: 40,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  buttonsWrapBtn: {
    paddingVertical: 50,
    width: '100%',
  },
  noButtonText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    textAlign: 'left',
    marginLeft: 20,
  },

  YesButton: {
    height: 60,
    width: '90%',
    backgroundColor: palette.primary1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    paddingVertical: 20,
  },

  visitText: {
    color: palette.white,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  btnText: {
    color: palette.black,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  blessingImg: {
    fontSize: 20,
    color: palette.blackshade,
    // paddingTop: 40,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  internalText: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midText: {
    fontSize: 16,
    color: palette.blackshade,
    fontWeight: '400',

    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  //
  parent: {
    paddingLeft: 10,
  },
  bookingLable: {
    marginLeft: 6,
    marginBottom: 10,
  },
  parentBookedUpcoming: {
    borderColor: palette?.tertiary2,
    marginHorizontal: wp(4),
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  childBookedUpcoming: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSection: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: palette?.tertiary2,
    height: 1,
    margin: 10,
    // marginLeft: 50,
  },
  addressSection: {
    padding: 10,
    marginLeft: 5,
    flex: 1,
  },
  image: {
    height: 15,
    width: 15,
  },
  cancelBooking: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...TypographyStyles.cardShadow,
  },
  cancelBookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: wp(4),
  },
  cancelBookingBody: {
    marginHorizontal: 15,
    marginVertical: 10,
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
