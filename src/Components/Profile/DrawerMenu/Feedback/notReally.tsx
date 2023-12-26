import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { wp } from '../../../Helpers/responsive-ratio'
import { Button } from '../../../ReusableComponents'
import { Box, palette, Text, TouchableBox } from '../../../Theme/Index'
import { styles } from '../styles'

const NotReally = () => {

    const [point, setPoint] = useState(0)
    const not_really_points = [
        {
            id: 1,
            point: 'Payment experience'
        },
        {
            id: 2,
            point: 'Prices'
        },
        {
            id: 3,
            point: 'Other'
        },
        {
            id: 4,
            point: 'App experience'
        },
        {
            id: 5,
            point: 'Customer Service'
        }
    ]

    const handleSubmit = () => console.log('Submit')
    const handlePoints = (id) => setPoint(id)

    return (
        <Box>
            <Text variant={'blackshade16400'}>We’re sorry to hear that. What can we improve on?</Text>
            <Box flexDirection={'row'} flexWrap={'wrap'} mt={'m'}>
                {not_really_points.map((data) => {
                    return (
                        <TouchableBox
                            key={data.id}
                            p='s'
                            mr='s'
                            mb='m'
                            paddingHorizontal={'m'}
                            borderRadius={20}
                            borderWidth={1}
                            style={{ borderColor: (point == data.id) ? palette?.primary : palette?.tertiary1 }}
                            onPress={() => handlePoints(data.id)}
                        >
                            <Text variant={(point == data.id) ? 'primary14500' : 'blackshade14500'}>{data.point}</Text>
                        </TouchableBox>
                    )
                })}
            </Box>
            <TextInput
                placeholder={'Please be as detailed as possible.'}
                style={[styles.emailInputStyle, { height: wp(25) }]}
                placeholderTextColor={palette?.placeholder}
                placeholderStyle={{ marginTop: 5 }}
                // onChangeText={handleIssue}
                textAlignVertical='top'
            />
            <Box height={45} marginVertical="l">
                <Button label='Submit' onPress={handleSubmit} />
            </Box>
        </Box>
    )
}

export default NotReally