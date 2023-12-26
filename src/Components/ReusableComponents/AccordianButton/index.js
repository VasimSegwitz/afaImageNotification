import {memo, useReducer} from 'react';
import {LayoutAnimation} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../Constant/Image';
import {Box, TouchableBox} from '../../Theme/Index';

const AccordianButton = ({title, data, defaultExpand}) => {
  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      Expanded: defaultExpand ? defaultExpand : false,
    },
  );

  const togglepricingExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setState({Expanded: !state.Expanded});
  };

  return (
    <Box>
      <TouchableBox onPress={() => togglepricingExpanded()}>
        <Box justifyContent="space-between" flexDirection="row" mt="l">
          {title()}
          <Box>
            <FastImage
              source={Images?.BelowArrow}
              style={{
                //   ...styles.image,
                height: 24,
                width: 24,
                transform: [{rotate: state?.Expanded ? '180deg' : '0deg'}],
              }}
              resizeMode={FastImage?.resizeMode?.contain}
            />
          </Box>
        </Box>
        <Box height={2} mt="m" backgroundColor="tertiary2" />
      </TouchableBox>
      {state?.Expanded && data()}
    </Box>
  );
};

export default memo(AccordianButton);
