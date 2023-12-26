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
    const { complex, coupon_code, title, images, coupon_discount } = item

    return (
        <TouchableBox
            onPress={() => {
                navigation.navigate("VenueDetails", { item })
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
                    source={images === null ? Images?.VenueOne : { uri: images[0] }}
                    style={{
                        height: wp(39),
                        width: wp(25),
                        borderRadius: 5
                    }}
                //resizeMode={FastImage?.resizeMode?.contain}
                />
                <Box ml="m"
                    mt="m"
                    width={size?.width / 1.5}
                >
                    {complex !== undefined ? <Text variant="blackshade112500">{complex?.info?.city}, {complex?.info?.state}</Text> : null}
                    {complex !== undefined ? <Text variant="blackshade16800">{complex?.name}</Text> : null}
                    <Text mb="l" variant="blackshade114500">{title}</Text>
                    <Box width={100}
                        mt="l"
                        borderRadius={40}
                        height={30}
                        backgroundColor="primary"
                        justifyContent='center'
                        alignItems='center'
                    ><Text variant="white14Medium">{coupon_discount}</Text></Box>
                </Box>
            </Box>


        </TouchableBox>
    );
};

const styles = StyleSheet.create({
    points: {
        height: wp(5),
        width: wp(5)
    },
    dashed: {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: palette?.primary,
    },
    boxx: {
        height: wp(22),
        width: wp(22)
    },
    content: { flexGrow: 1 },
    headerImage: {
        height: wp(51),
        width: wp(100),
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 1,
    }
});

export default DealsItem;

