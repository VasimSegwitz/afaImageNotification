import { StyleSheet } from 'react-native';
import { wp } from '../../Helpers/responsive-ratio';
import { palette } from '../../Theme/Index';

const styles = StyleSheet.create({
    activateWalletBottomContainer: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: wp(-15)
    },
    bottomHeader: {
        width: wp(30),
        borderRadius: 10
    },
    inputStyle: {
        borderColor: palette.inputBorder,
        borderWidth: 1,
        borderRadius: 5,
        height: wp(10)
    },
    underline: {
        textDecorationLine: 'underline',
    },
    mybalance: {
        height: wp(33),
        width: wp(92),
        top: wp(-15),
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    divider: {
        borderWidth: 0.8,
        borderColor: palette?.tertiary2,
        height: wp(18),
        marginHorizontal: 5
    },
    createPin: {
        top: wp(-10),
        marginRight: wp(15),
        flexDirection: 'row',
        alignItems: 'center'
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
