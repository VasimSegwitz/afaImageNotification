import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import theme, {
    Box,
    palette,
    Text,
    TouchableBox,
    TypographyStyles,
    os
} from '../../Theme/Index';
import { Input, Button, Header } from '../../ReusableComponents/index';
import { size } from '../../Theme/Index';
import FastImage from 'react-native-fast-image';
import { wp } from '../../Helpers/responsive-ratio';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../../Constant/Image';
import {
    Tabs,
    CollapsibleRef,
    MaterialTabBar,
    CollapsibleProps,
    TabItemProps,
} from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import WebView from 'react-native-webview';

const VoucherDetails = ({ navigation, route }) => {
    const { params } = route
    const { item } = params
    const [imageIndex, setImageindex] = useState(0);
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    return (
        <Box
            flex={1}
            backgroundColor="white"
        >
            <Header
                backSpace={true}
                left={true}
                title=""

            />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                style={{
                    flex: 1,
                }}
            >
                <Carousel
                    panGestureHandlerProps={{
                        activeOffsetX: [-20, 20],
                    }}
                    loop
                    style={{ marginHorizontal: 20 }}
                    pagingEnabled={true}
                    width={wp(90)}
                    height={wp(55)}
                    autoPlay={true}
                    data={item?.images !== null ? item?.images : []}
                    scrollAnimationDuration={1000}
                    onSnapToItem={index => {
                        setImageindex(index);
                    }}
                    renderItem={({ item, index }) => {

                        return (
                            <FastImage
                                source={{ uri: item }}
                                style={{
                                    height: wp(55),
                                    width: wp(90),
                                }}
                                resizeMode={FastImage?.resizeMode?.stretch}
                            />
                        );
                    }}
                />
                <Box
                    flex={1}
                    mt="m"
                    ml="l"
                >
                    <Text variant="blackshade18800Medium">Eagle Club Volleyball Training Pass</Text>

                </Box>
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.ProductDetails}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">Product Details</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />
                <Box mt="m" marginHorizontal="l">
                    <Text variant="blackshade16800Regular">
                        • Valid for: One-time use only
                    </Text>
                    <Text variant="blackshade16800Regular">
                        • Validity period: 6 months from date of issue
                    </Text>
                    <Text variant="blackshade16800Regular">
                        • Use for: Fitness-related goods and services only (e.g. gym memberships, personal training sessions, fitness classes, merchandise)
                    </Text>
                </Box>
                {item?.details !== null ?
                    <Box
                        ml={os.ios ? "l" : "m"}
                        mt="m"
                        height={os.ios ? 50 : 150}
                        width={size?.width / 1.1}
                    >
                        <WebView
                            source={{
                                html: `${item?.details}`
                            }}
                            style={{ flex: 1 }}
                            scalesPageToFit={os.ios}
                            useWebKit={os.ios}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </Box> : null}
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.Terms}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">Terms & Conditions</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />

                {item?.terms !== null ?
                    <Box
                        ml={os.ios ? "l" : "m"}
                        mt="m"
                        height={os.ios ? 50 : 150}
                        width={size?.width / 1.1}
                    >
                        <WebView
                            source={{
                                html: `${item?.terms}`
                            }}
                            style={{ flex: 1 }}
                            scalesPageToFit={os.ios}
                            useWebKit={os.ios}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </Box> : null}
                <Box mt="l"
                    marginHorizontal="l"
                    flexDirection="row" alignItems='center'>
                    <FastImage
                        source={Images?.FAQ}
                        style={{

                            height: wp(5),
                            width: wp(5),
                        }}
                        resizeMode={FastImage?.resizeMode?.stretch}
                    />
                    <Text ml="s" variant="blackshade16800">FAQ</Text>
                </Box>
                <Box height={1}
                    mt="m"
                    backgroundColor="tertiary2"
                    marginHorizontal="l"
                />

                {item?.faq !== null ?
                    <Box
                        ml={os.ios ? "l" : "m"}
                        mt="m"
                        height={os.ios ? 50 : 150}
                        width={size?.width / 1.1}
                    >
                        <WebView
                            source={{
                                html: `${item?.faq}`
                            }}
                            style={{ flex: 1 }}
                            scalesPageToFit={os.ios}
                            useWebKit={os.ios}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        />
                    </Box> : null}
                <Box height={100} />

            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    heart: {
        height: wp(10),
        width: wp(10)
    },
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
        height: wp(24),
        width: wp(24)
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

export default VoucherDetails;

