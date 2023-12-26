import { useNavigation } from "@react-navigation/native"
import React from "react"
import FastImage from "react-native-fast-image"
import { useSelector } from "react-redux"
import { Images } from "../../../Constant/Image"
import { wp } from "../../Helpers/responsive-ratio"
import { Button } from "../../ReusableComponents"
import { EntypoIcon, feather, Ionicon } from "../../ReusableComponents/Icons"
import { Box, palette, Text, TouchableBox, TypographyStyles } from "../../Theme/Index"
import styles from "./style"

const NotEnoughSkill = (props) => {
    const { state, setState } = props
    const navigation = useNavigation()
    const handleFindActivity = () => navigation.goBack()
    const handleClose = () => setState({ ...state, is_not_enough_skill: false })

    return (
        <Box backgroundColor={"white"} style={[styles.confirmationModal, TypographyStyles.cardShadow, {top: wp(30)}]} p={"l"}>
            <TouchableBox onPress={handleClose} style={{ alignItems: "flex-end", marginTop: -10 }}>
                {Ionicon('close', wp(7), palette?.blackshade)}
            </TouchableBox>
            <FastImage
                source={Images?.NotEnoughSkill}
                resizeMode={FastImage?.resizeMode?.contain}
                style={{ height: wp(50), width: wp(80)}}
            />
            <Text variant={"blackshade20500"} marginVertical={"l"}>Oops!</Text>
            <Text variant={"blackshade16400"}>We're sorry, your skills are not high enough to join this game. Fret not, keep playing and you will be able to join soon!</Text>
            <Box height={45} mt={"l"}>
                <Button label="Find another Activity" onPress={handleFindActivity} />
            </Box>
        </Box>
    )
}

export default NotEnoughSkill