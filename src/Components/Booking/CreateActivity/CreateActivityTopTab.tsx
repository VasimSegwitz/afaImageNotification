import {Animated, View, TouchableOpacity} from 'react-native';
import {wp} from '../../Helpers/responsive-ratio';
import {Box, Text} from '../../Theme/Index';

function CreateActivityTopTab({state, descriptors, navigation, position}) {
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{paddingRight: 15, paddingLeft: 15, marginTop: 10}}>
            <Text variant={isFocused ? 'blackshade14500' : 'blackshade114500'}>
              {label}
            </Text>
            {isFocused ? (
              <Box
                marginVertical="s"
                alignSelf="center"
                height={5}
                width={index == 0 ? wp(13) : wp(25)}
                backgroundColor="primary"
                borderRadius={10}
              />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CreateActivityTopTab;
