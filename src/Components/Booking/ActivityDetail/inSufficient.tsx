import React from 'react'
import FastImage from 'react-native-fast-image'
import { Images } from '../../../Constant/Image'
import { wp } from '../../Helpers/responsive-ratio'
import { Box, palette, Text, TouchableBox, TypographyStyles } from '../../Theme/Index'
import { Button } from "../../ReusableComponents"
import { useNavigation } from '@react-navigation/native'
import styles from './style'
import { Ionicon } from '../../ReusableComponents/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { ActivityConstants } from '../../../Redux'

const InSufficient = (props) => {
    const {state, setState} = props
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const in_sufficient = useSelector(state => state?.activity?.activity?.insufficient);

    const handleTopUpWallet = () => navigation.navigate('TopUp')
    const handleClose = () => {
        setState({...state, inSufficient: false})
        dispatch({
            type: ActivityConstants.INSUFFICIENT,
            insufficient: !in_sufficient,
        });
    } 
    return (
        <Box
            backgroundColor={"white"}
            style={[
                styles.confirmationModal,
                TypographyStyles.cardShadow,
                { top: wp(25) }
            ]}
            p={"l"}
        >
            <TouchableBox onPress={handleClose} style={{ alignItems: "flex-end", marginTop: -10 }}>
                {Ionicon('close', wp(7), palette?.blackshade)}
            </TouchableBox>
            <FastImage
                source={Images?.InSufficient}
                resizeMode={FastImage?.resizeMode?.contain}
                style={{ height: wp(70), width: wp(80) }}
            />
            <Text variant={"blackshade20500"} marginVertical={"l"}>Insufficient Wallet Funds</Text>
            <Text variant={"blackshade16400"}>Sorry, your Wallet balance is currently not enough to pay for this Activity. Please top-up.</Text>
            <Box height={45} mt={"l"}>
                <Button label="Top-up my Wallet" onPress={handleTopUpWallet} />
            </Box>
        </Box>
    )
}

export default InSufficient