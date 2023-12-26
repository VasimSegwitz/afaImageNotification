import { StyleSheet } from 'react-native'
import { wp } from '../../Helpers/responsive-ratio'
import { palette } from '../../Theme/Index'

const styles = StyleSheet.create({
    timelineHeader: {
        width: wp(27),
        marginLeft: wp(50),
        marginTop: wp(4),
        backgroundColor: palette.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: wp(-7)
    },
    activityMeter: {
        height: wp(7),
        width: wp(7),
        borderRadius: wp(7/2),
        backgroundColor: palette.primary,
        bottom: -wp(10),
        marginLeft: wp(62),
        justifyContent: 'center',
        zIndex: 5
    },
    BottomContainer: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: -15
    }
})

export default styles
