import React from 'react'
import { Button } from '../../../ReusableComponents'
import { Box, Text } from '../../../Theme/Index'

const LoveIt = () => {

    const handleAbsolutely = () => console.log('Absolutely')

    return (
        <Box>
            <Text variant={'blackshade16400'}>Yay! How about rating us on the App Store?</Text>
            <Box height={45} marginVertical="m">
                <Button label="Absolutely" onPress={handleAbsolutely} />
            </Box>
        </Box>
    )
}

export default LoveIt