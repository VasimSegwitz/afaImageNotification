import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Box, fonts, palette } from '../../Theme/Index';
import { wp } from '../../Helpers/responsive-ratio';
import PointsTopTab from './pointsTopTab';
import ToEarn from './toEarn';
import Earned from './earned';

const PointsTab = (props) => {
    const Tab = createMaterialTopTabNavigator()

    return (
        <Box flex={1} backgroundColor="white" style={{ top: wp(-2), marginLeft: wp(2) }}>
            <Tab.Navigator
                tabBar={props => <PointsTopTab {...props} />}
                screenOptions={{
                    tabBarScrollEnabled: true,
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontFamily: fonts?.medium,
                        fontWeight: '600',
                        color: palette?.blackshade,
                        textTransform: 'capitalize',
                    },
                }}>
                <Tab.Screen name="To Earn" children={() => <ToEarn />} />
                <Tab.Screen name="Earned" children={() => <Earned />} />
            </Tab.Navigator>
        </Box>
    );
};

export default PointsTab;
