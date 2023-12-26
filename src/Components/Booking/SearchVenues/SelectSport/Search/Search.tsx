import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import theme, { Box, fonts, palette, Text, TouchableBox } from '../../../../Theme/Index';
const SearchI = require("../../../../../assets/Home/Search/Search.png")

import Carousel from 'react-native-reanimated-carousel';

import FastImage from 'react-native-fast-image';
import { wp } from '../../../../Helpers/responsive-ratio';
import Animated, { useAnimatedStyle, interpolateColor, Extrapolation, interpolate, useSharedValue, withTiming } from 'react-native-reanimated';
import { Header } from '../../../../ReusableComponents';


const Search = ({ navigation, route, value, onChangeText }) => {
    const progress = useSharedValue(0);

    const onFocus = () => {
        progress.value = withTiming(1)
    }

    const onSubmitEditing = () => {
        progress.value = withTiming(0)
    }

    const changeSelectionColor = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            [palette.placeholder, palette.secondary]
        );

        const borderWidth = interpolate(progress.value,
            [0, 1], [1, 4], { extrapolateRight: Extrapolation.CLAMP });

        return {
            borderColor,
            borderWidth
        };
    });




    return (
        <Box>
            <Header title={'Select Your Sport'} left/>
            <Animated.View
                height={40}
                borderRadius={10}
                flexDirection="row"
                alignItems='center'
                style={changeSelectionColor}
            >
                <FastImage
                    source={SearchI}
                    style={styles.image}
                    resizeMode={FastImage?.resizeMode?.stretch}
                />
                <TextInput
                    onSubmitEditing={onSubmitEditing}
                    onFocus={onFocus}
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.text}
                    placeholderTextColor={palette.blackshade1}
                    placeholder="Search a sport name"
                />
            </Animated.View>
        </Box>
    );
};

const styles = StyleSheet.create({
    content: { flexGrow: 1 },
    image: {
        marginLeft: 10,
        height: 22,
        width: 22,
    },
    text: {
        flex: 1,
        marginTop: 5,
        paddingRight: 40,
        height: 40,
        alignSelf: 'center',
        fontFamily: fonts.regular,
        fontSize: 14,

    }
});

export default memo(Search)