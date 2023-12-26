import React from 'react'
import { wp } from '../../../Helpers/responsive-ratio'
import { Box, palette, Text, TouchableBox } from '../../../Theme/Index'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const Pin = () => {

    const navigation = useNavigation();
    const menu = [
        {
            id: 1,
            text: 'Update AFA PIN',
            goto: 'SetUpPin'
        },
        {
            id: 2,
            text: 'Forgot AFA PIN',
            goto: 'ForgotPin'
        }
    ]

    const handleNavigation = (data) => navigation.navigate(data)

    return (
        <Box>
            {menu.map((data) => {
                return (
                    <>
                        <TouchableBox
                            key={data?.id}
                            onPress={() => handleNavigation(data?.goto)}
                            flexDirection={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Text variant={'blackshade16400'}>{data?.text}</Text>
                            <AntDesign
                                name={'right'}
                                size={wp(7)}
                                color={palette?.tertiary4}
                            />
                        </TouchableBox>
                        <Box marginVertical={"m"} borderWidth={0.5} style={{ borderColor: palette?.tertiary3 }} />
                    </>
                )
            })}
        </Box>
    )
}

export default Pin