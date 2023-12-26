import React, { useRef, useEffect } from 'react';
import { Animated, View, TouchableOpacity, ScrollView } from 'react-native';
import { Box, Text } from '../../../Theme/Index';

const VenuInfoToptab = (props) => {

  const { state, descriptors, navigation, position, setTab } = props;

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current.scrollTo({ x: state.index * 50, y: 0, animated: true });
    setTab(state.index)
  }, [state.index]);

  return (
    <View style={{ flexDirection: 'row' }}>
      <ScrollView
        ref={list => (scrollViewRef.current = list)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
        horizontal>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
              navigation.navigate({ name: route.name, merge: true });
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
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ marginHorizontal: 15 }}>
              <Text
                variant={isFocused ? 'blackshade14500' : 'blackshade114500'}>
                {label}
              </Text>
              {isFocused ? (
                <Box
                  alignSelf="center"
                  mt="s"
                  height={3}
                  width={state?.index == 1 ? 15 : state?.index == 2 ? 30 : 20}
                  backgroundColor="primary"
                  borderRadius={10}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VenuInfoToptab;
