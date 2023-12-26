import React, { useEffect, useState } from "react"
import { TouchableBox, Box, Text, palette, size, fonts } from "../../Theme/Index"
import { Image, StyleSheet } from "react-native"
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';
import { Images } from "../../../Constant/Image";
import { Button } from "../../ReusableComponents";
import { Down, Ionicon } from '../../ReusableComponents/Icons';

const NoPointsModal = ({ route, navigation }) => {

    return (
        <Box flex={1} style={styles.content}>
            <TouchableBox
                flex={1.8}
                justifyContent='center'
                alignItems='center'
                onPress={() => {
                    navigation.goBack(null)
                }} />
            <Box
                flex={1}
                backgroundColor="white"
                borderTopRightRadius={30}
                borderTopLeftRadius={30}
            >
                <TouchableBox
                    m="l"
                    style={styles.closeIcon}
                    onPress={() => {
                        navigation.goBack(null)
                    }}
                    alignSelf="flex-end">
                    {Ionicon('close', 20, palette?.black)}

                </TouchableBox>
                <Box marginHorizontal="l" mb="s">
                    <Text
                        textAlign="center"
                        variant="blackshade20800Regular">Oops! Not Enough Points!</Text>
                    <Text

                        textAlign="center"
                        variant="blackshade16800Regular"
                        mt="l">Earn more points by using the app and completing tasks to redeem this reward!</Text>
                </Box>

                <Box
                    marginVertical="l"
                    height={1}
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />
                <Box mb="l">
                    <Box
                        ml="l"
                        width={wp(100) - 40}
                    >
                        <Button
                            onPress={() => {
                                navigation.navigate("Wallet")

                            }}
                            label={'OK'}
                            buttonStyle={{
                                height: wp(10),
                            }}
                        />
                    </Box>
                    <Box alignItems='center' marginVertical="m">
                        <Text variant="blackshade114500">Earn more points!</Text>
                    </Box>
                </Box>
            </Box>
        </Box >
    )

}

const styles = StyleSheet.create({
    content: { backgroundColor: "#00000070" },
    closeIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: palette.blackshade,
    }
})

export default NoPointsModal