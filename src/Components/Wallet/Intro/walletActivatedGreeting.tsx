import React from "react"
import FastImage from "react-native-fast-image"
import { Images } from "../../../Constant/Image"
import { wp } from "../../Helpers/responsive-ratio"
import { Button } from "../../ReusableComponents"
import { Box, Text } from "../../Theme/Index"
import { useNavigation } from '@react-navigation/native'

const WalletActivatedGreeting = () => {

    const navigation = useNavigation()
    const handleTopUp = () => navigation.navigate("TopUp")

    return (
        <Box flex={1} backgroundColor="white">
            <Box flex={1}>
                <Box alignItems={"center"}>
                    <FastImage
                        source={Images.WalletActivated}
                        style={{
                            height: wp(65),
                            width: wp(80),
                            marginTop: wp(26)
                        }}
                        resizeMode={FastImage?.resizeMode?.contain}
                    />
                </Box>
                <Box p={"l"} style={{ marginTop: wp(5) }}>
                    <Text variant={"primary36700"}>Your Wallet has been activated!</Text>
                    <Text variant={"blackshade16400"} style={{ marginTop: wp(10) }}>Start using AFA Pay for booking venues, pay for games, and earn rewards.</Text>
                </Box>
            </Box>
            <Box height={wp(14)} marginHorizontal={"m"} mb="m">
                <Button label="Top-up Now" onPress={handleTopUp}/>
            </Box>
        </Box>
    )
}

export default WalletActivatedGreeting