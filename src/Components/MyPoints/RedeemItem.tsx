import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import theme, {
    Box,
    palette,
    Text,
    TouchableBox,
} from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';
import { Images } from '../../../Constant/Image';

const RedeemItem = ({ navigation, route }) => {


    return (
        <TouchableBox
            onPress={() => {
                navigation.navigate("RedeemDetails")
            }}
            mt="m"
            flexDirection="row"
            marginHorizontal="m"
        >
            <Box
                borderRadius={18}
                justifyContent='center'
                alignItems='center'
                style={[styles.dashed, styles.cardShadow]}
                height={wp(27)}
                width={wp(27)}
                backgroundColor="white"
            >
                <FastImage
                    style={styles.boxx}
                    resizeMode={FastImage?.resizeMode?.contain}
                    source={Images?.RedeemBox}
                />
            </Box>
            <Box flex={1}
                borderRadius={18}
                backgroundColor="white"
                style={styles.cardShadow}
                paddingLeft="m"
            >
                <Text pt="m" variant="blackshade16800">
                    AFA Cash Voucher
                </Text>
                <Box flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.Points}
                        style={styles.points}
                    />
                    <Text variant="primary16500Medium">1000 points</Text>
                </Box>
                <Text mt="m" variant="blackshade114800Regular">To book venue or join activity </Text>
                <Text variant="blackshade114800Regular">Validity: 6 Months</Text>
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

export default RedeemItem;

