/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useReducer, useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {Images} from '../../../Constant/Image';
import {
  generateArrayOfDays,
  generateArrayOfMonths,
  generateArrayOfYears,
} from '../../../utils';
import authStore from '../../../Zustand/store';
import {Header} from '../../ReusableComponents';
import StepIndicator from '../../ReusableComponents/CheckoutProgress';
import {Box, palette} from '../../Theme/Index';
import SetupGender from '../SetupGender';
import SetupLocation from '../SetupLocation';
import SetupSports from '../SetupSports';
import SuccessStep from '../SuccessStep';

const labels = ['About you', 'Your sports', 'Your location', 'End'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: palette?.primary,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: palette?.primary,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: palette?.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: palette?.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: palette?.primary,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#fff',
  labelSize: 13,
  currentStepLabelColor: palette?.primary,
};

export default props => {
  const {navigation, route} = props;

  /**
   * @function onSubmit
   * @description this function will on the sports step and close another one
   */

  const onSubmit = arg => {
    setState({
      firstStepdata: arg,
      options: {
        gender: false,
        sports: true,
        location: false,
        success: false,
      },
    });
  };

  /**
   * @function onSelectSport
   * @description this function will on the Location step and close another one
   */

  const onSelectSport = () => {
    setState({
      options: {
        gender: false,
        sports: false,
        location: true,
        success: false,
      },
    });
  };

  /**
   * @function onSuccess
   * @description this function will set the final screen on and other close
   */

  const onSuccess = () => {
    setState({
      options: {
        gender: false,
        sports: false,
        location: false,
        success: true,
      },
    });
  };

  /**
   * @function onFinal
   * @description this function will set as greeting is done and now needs to jump on Dashboard
   */

  const onFinal = () => {
    setGreeting({greeting: true});
    navigation?.navigate('Tabs');
  };

  const setGreeting = authStore(state => state?.setGreeting);

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      title: '',
      showPayment: false,
      paymentStatus: false,
      selectedAddressShipping: null,
      sameAsShipping: false,
      paymentResponse: null,
      checkoutOrder: {},
      firstStepdata: {},
      options: {
        gender: true,
        sports: false,
        location: false,
        success: false,
      },
    },
  );

  const date = generateArrayOfDays();
  const yearList = generateArrayOfYears();
  const Monthlist = generateArrayOfMonths();

  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(true);
  const [other, setOther] = useState(false);

  const TabArray = [
    {name: 'Male', Method: setMale, value: male, image: Images?.Male},

    {name: 'Female', Method: setFemale, value: female, image: Images.Female},
    {name: 'Other', Method: setOther, value: other, image: Images?.OtherGender},
  ];

  useEffect(() => {
    let title = 'Checkout';
    if (state.options.address) {
      title = 'Checkout';
    } else if (state.options.payment) {
      title = 'Address';
    }
    setState({title: title});
  }, []);

  const [position, setPosition] = useState();

  useEffect(() => {
    setPosition(
      state?.options?.gender
        ? 0
        : state?.options?.sports
        ? 1
        : state?.options?.location
        ? 2
        : state?.options?.success
        ? 4
        : 3,
    );
  }, [state.options]);

  const onAbout = () => {
    setState({
      options: {
        gender: true,
        sports: false,
        location: false,
        success: false,
      },
    });
  };

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      style={{
        backgroundColor: palette.white,

        paddingBottom: route?.params?.space?.bottom,
      }}>
      <Header navigation={navigation} />
      <StepIndicator
        customStyles={customStyles}
        currentPosition={position}
        labels={labels}
        stepCount={labels.length}
        onPress={e => {
          setPosition(e == 3 ? 4 : e);
          if (e == 0) return onAbout();
          if (e == 1) return onSubmit();
          if (e == 2) return onSelectSport();
          if (e == 3) return onSuccess();
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{flex: 1}}>
        {state?.options?.gender && (
          <SetupGender onPress={arg => onSubmit(arg)} />
        )}
        {state?.options?.sports && (
          <SetupSports
            onPress={() =>
              navigation?.navigate('SelectSports', {from: 'greeting'})
            }
            onSubmit={() => onSelectSport()}
          />
        )}
        {state?.options?.location && (
          <SetupLocation
            onPress={() =>
              navigation?.navigate('ChangeLocation', {setup: true})
            }
            onSubmit={() => onSuccess()}
          />
        )}
        {state?.options?.success && (
          <SuccessStep onPress={() => onFinal()} data={state?.firstStepdata} />
        )}
      </KeyboardAvoidingView>
    </Box>
  );
};
