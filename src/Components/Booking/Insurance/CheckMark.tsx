import React, { useEffect, useState, useRef } from "react"
import { StyleSheet } from "react-native"
import { palette } from "../../Theme/Index"
import Animated, { Easing, createAnimatedPropAdapter, processColor, interpolate, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"

const CheckPath = Animated.createAnimatedComponent(Path)
const d = "M1 5.5L4.5 8.5L10 1"

const CheckMark = ({ selected }) => {
    const [length, setLength] = useState(0)
    const ref = useRef(null)
    const progress = useSharedValue(0)

    useEffect(() => {
        progress.value = selected ? withTiming(1, { easing: Easing.linear }) : withTiming(0, { easing: Easing.linear })

    }, [selected])

    const boxStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: interpolateColor(progress.value, [0, 1], ["white", palette.primary]),
            borderColor: interpolateColor(progress.value, [0, 1], [palette.secondary, palette.primary])
        }
    })

    const strokeAnimation = useAnimatedProps(() => {
        return {
            fill: interpolateColor(progress.value, [1, 0], [palette.primary, "white"]),
            strokeWidth: 2,
            strokeDashoffset: length - length * progress.value
        };
    }
        , [], createAnimatedPropAdapter(
            (props) => {
                if (Object.keys(props).includes('fill')) {
                    props.fill = { type: 0, payload: processColor(props.fill) }
                }
                if (Object.keys(props).includes('stroke')) {
                    props.strokeDashoffset = { type: 0, payload: processColor(props.strokeDashoffset) }
                }
            },
            ['fill', 'strokeDashoffset']));

    return (
        <Animated.View style={[styles.box, boxStyle]}>
            <Svg
                height={10}
                width={11}
                viewBox="0 0 11 10"
            >
                <CheckPath
                    ref={ref}
                    onLayout={() => {
                        setLength(ref.current?.getTotalLength())
                    }}
                    strokeDasharray={length}
                    stroke="white"
                    strokeWidth={2}
                    d={d}
                    animatedProps={strokeAnimation}
                />
            </Svg>
        </Animated.View>
    )
}

const styles = StyleSheet.create({

    box: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default CheckMark
