import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useMutation } from 'react-query'
import { forgotWalletPin } from '../../../Services/ProfileApi'
import { displayErrorToast } from '../../../../utils'
import { Box, Text } from '../../../Theme/Index'
import { Button, Header, LoadingOverlay } from '../../../ReusableComponents'
import { useSelector } from 'react-redux'

const ForgotPin = () => {
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const { phone, phone_prefix } = useSelector(state => state?.auth?.user?.user?.data)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [isFocused])

    const forgotWalletPinMutation = useMutation('forgotWalletPin', forgotWalletPin, {
        onSuccess: data => {
            setIsLoading(false)
            if (data?.success == 0) {
                return displayErrorToast(data?.message)
            } else if (data?.success == 1) {
                navigation.navigate(
                    'Verification' as never,
                    {
                        phone: phone,
                        phone_prefix: phone_prefix,
                        type: 'forgotWalletPin'
                    } as never,
                )
            } else {
                return displayErrorToast("Something Went Wrong")
            }
        },
        onError: error => {
            setIsLoading(false)
            displayErrorToast(error?.data?.message)
        }
    })

    const handleContinue = () => {
        setIsLoading(true)
        forgotWalletPinMutation.mutate()
    } 

    return (
        <Box flex={1} backgroundColor="white">
            {isLoading && <LoadingOverlay />}
            <Header left />
            <Box flex={0.9}>
                <Text variant={"blackshade20500"} ml={"l"} mb={"l"} mt={"xl"}>Forgot PIN?</Text>
                <Text variant={"blackshade16400"} marginHorizontal={"l"}>No worries, it happens to the best of us. </Text>
                <Text variant={"blackshade16400"} marginHorizontal={"l"} mt={"m"}>To verify your identity, An OTP code will be send to this phone number</Text>
                <Text variant={"blackshade24500"} textAlign={"center"} mt={"xxl"}>{phone_prefix}{phone}</Text>
            </Box>
            <Box flex={0.1} height={45} marginHorizontal={'m'} mb="m">
                <Button label="Continue" onPress={handleContinue} />
            </Box>
        </Box>
    )
}

export default ForgotPin