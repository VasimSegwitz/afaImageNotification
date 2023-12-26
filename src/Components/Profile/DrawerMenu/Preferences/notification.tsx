import React, { useState } from 'react'
import RadioButton from '../../../ReusableComponents/RadioButton'
import { Box } from '../../../Theme/Index'

const Notificaion = () => {

    const [activity, setActivity] = useState(0)
    const [offers, setOffers] = useState(0)
    const handleActivityUpdate = () => (activity == 0) ? setActivity(1) : setActivity(0)
    const handleOffers = () => (offers == 0) ? setOffers(2) : setOffers(0)

    return (
        <Box>
            <Box marginRight={'l'} mb={"m"}>
                <RadioButton
                    text={'Activity updates'}
                    selected={activity != 0}
                    onPress={handleActivityUpdate}
                />
                <Box mt={"m"}>
                    <RadioButton
                        text={'Offers'}
                        selected={offers != 0}
                        onPress={handleOffers}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default Notificaion