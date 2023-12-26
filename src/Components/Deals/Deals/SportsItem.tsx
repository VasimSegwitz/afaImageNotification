import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import theme, {
    Box,
    palette,
    size,
    Text,
    TouchableBox,
    TypographyStyles,
} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';
import { Images } from '../../../Constant/Image';

const DealsItem = ({ navigation, item, route }) => {
    const { complex, expiry, images, coupon_discount } = item

    return (
        <TouchableBox
            onPress={() => {
                navigation.navigate("SportsDetails", { item })
            }}
            mt="m"
            flexDirection="row"
            marginHorizontal="m"
            backgroundColor="white"
            borderRadius={5}
            style={{
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowOffset: {
                    width: 1,
                    height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 1
            }}
        >
            <Box flexDirection="row">
                <Image
                    source={images !== null ? { uri: images[0] } : Images?.SportsOne}
                    style={{
                        height: wp(39),
                        width: wp(25),
                        borderRadius: 5
                    }}
                />
                <Box ml="m"
                    mt="m"
                    width={size?.width / 1.5}
                >
                    <Text variant="blackshade112500">M-Fitness</Text>
                    <Text variant="blackshade16800">Fitness Pass</Text>
                    <Text variant="blackshade114500">With one personal trainer
                        Exp: 31 Dec 2023</Text>
                    <Box width={100}
                        mt="m"
                        borderRadius={40}
                        height={30}
                        backgroundColor="primary"
                        justifyContent='center'
                        alignItems='center'
                    ><Text variant="white14Medium">RM100 OFF</Text></Box>
                </Box>
            </Box>


        </TouchableBox>
    );
};



export default DealsItem;

