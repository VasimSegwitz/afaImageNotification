import { StyleSheet } from 'react-native';
import { wp } from '../../Helpers/responsive-ratio';
import { palette, TypographyStyles } from '../../Theme/Index';

const styles = StyleSheet.create({
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
        height: 100,
    },
    addressSection: {
        padding: 10,
        marginLeft: 5,
        flex: 1
    },
    image: {
        height: 15,
        width: 15,
    },
    cancelBooking: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...TypographyStyles.cardShadow
    },
    cancelBookingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginHorizontal: 15,
        marginTop: wp(4)
    },
    cancelBookingBody: {
        marginHorizontal: 15,
        marginVertical: 10
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
    }
});

export default styles;
