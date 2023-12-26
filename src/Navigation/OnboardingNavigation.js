import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ForgotPassword from '../Components/Authentication/ForgotPassword';
import Login from '../Components/Authentication/Login';
import PasswordChanged from '../Components/Authentication/PasswordChanged';
import ResetPassword from '../Components/Authentication/ResetPassword';
import Signup from '../Components/Authentication/Signup';
import Verification from '../Components/Authentication/Verification';
import SetupGreeting from '../Components/SetupGreeting';
import WalkThrough from '../Components/WalkThrough';
import authStore from '../Zustand/store';
import Options from '../Components/SetupGreeting/Options';
import SelectSports from '../Components/SetupGreeting/SelectSports';
import SelectLocation from '../Components/SetupGreeting/SelectLocation';
import MobileConfirmation from '../Components/ReusableComponents/Modals/MobileConfirmation';
import AskLocation from '../Components/Dashboard/ChangeLocation/AskLocationModal/AskLocation';

const Stack = createStackNavigator();

export default () => {
  const insets = useSafeAreaInsets();
  const welcome = authStore(state => state.welcome.data);

  return (
    <>
      <Stack.Navigator
        screenOptions={
          Platform.OS === 'ios'
            ? {headerShown: false, gestureEnabled: false}
            : {headerShown: false}
        }
        initialRouteName={
          welcome == 'login' ? 'Login' : welcome ? 'Signup' : 'WalkThrough'
        }>
        <>
          <Stack.Screen
            name="Signup"
            component={Signup}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="Forgot"
            component={ForgotPassword}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="Reset"
            component={ResetPassword}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="PasswordChanged"
            component={PasswordChanged}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="WalkThrough"
            component={WalkThrough}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="SetupGreeting"
            component={SetupGreeting}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="Options"
            component={Options}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="SelectSports"
            component={SelectSports}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="SelectLocation"
            component={SelectLocation}
            initialParams={{space: insets}}
          />
          <Stack.Screen
            name="Verification"
            component={Verification}
            initialParams={{space: insets}}
          />
          <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
            <Stack.Screen
              name="MobileConfirmation"
              component={MobileConfirmation}
              initialParams={{space: insets}}
            />
            <Stack.Screen
              name="AskLocation"
              component={AskLocation}
              initialParams={{space: insets}}
            />
          </Stack.Group>
        </>
      </Stack.Navigator>
    </>
  );
};
