import React from 'react'
import { View, Text } from 'react-native'
import { wp } from '../../Helpers/responsive-ratio';
import { EntypoIcon } from '../Icons';


const DashedLine = (props) => {

    const { length, color, circleSize, circleLength, justifyContent } = props

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: justifyContent, width: '100%', bottom: -19 }}>
                {[...Array(circleLength)].map((_, ind) => {
                    return (
                        EntypoIcon('circle', wp(circleSize), color)
                    )
                })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
                {[...Array(length)].map((_, ind) => {
                    return (
                        <Text key={ind} style={{ color: color, letterSpacing: -1.87, fontSize: 18 }}>
                            {' '}--{' '}
                        </Text>
                    )
                })}
            </View>
        </>
    )
}

export default DashedLine

