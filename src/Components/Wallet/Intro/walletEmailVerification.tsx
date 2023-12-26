import React from "react"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"
import { wp } from "../../Helpers/responsive-ratio"
import { Button, Header } from "../../ReusableComponents"
import { Box, Text } from "../../Theme/Index"
import styles from "./styles"

const WalletEmailVerification = (props) => {
    const { email } = props?.route?.params
    
    const navigation = useNavigation()
    const handleOpenMail = () => navigation.navigate("WalletActivatedGreeting")
    
    return (
        <Box flex={1} backgroundColor="white">
            <Header left />
            <Box flex={1} p={"l"}>
                <Text variant={"blackshade20500"} mt={"l"}>We need to verify your email</Text>
                <Text variant="blackshade16400" style={{marginVertical: wp(10)}}>To verify your email address, tap the button in the email we've just sent to {email}</Text>
                <Text variant="tertiary16400" fontWeight={"bold"}>Didn't receive the email?</Text>
                <Box flexDirection="row" flexWrap="wrap" mt={"s"}>
                    <Text variant="tertiary16400">Check your spam or</Text>
                    <TouchableOpacity>
                        <Text variant="tertiary16400" style={styles.underline} marginHorizontal="s">resend email.</Text>
                    </TouchableOpacity>
                    <Text variant="tertiary16400">You can also sign out and start over.</Text>
                </Box>
            </Box>
            <Box height={wp(14)} marginHorizontal={"m"} mb="m">
                <Button label="Open Mail App" onPress={handleOpenMail} />
            </Box>
        </Box>
    )
}

export default WalletEmailVerification