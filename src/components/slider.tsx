import React, { useState, useRef } from 'react';
import { View, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import * as AC from '@bacons/apple-colors';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  step = 0.1,
  onValueChange,
}: SliderProps) {
  const SLIDER_WIDTH = 280;
  const THUMB_SIZE = 24;

  const translateX = useSharedValue(
    interpolate(value, [minimumValue, maximumValue], [0, SLIDER_WIDTH - THUMB_SIZE])
  );

  const updateValue = (position: number) => {
    'worklet';
    const normalizedValue = interpolate(
      position,
      [0, SLIDER_WIDTH - THUMB_SIZE],
      [minimumValue, maximumValue]
    );

    // Round to step
    const steppedValue = Math.round(normalizedValue / step) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));

    runOnJS(onValueChange)(clampedValue);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, context.startX + event.translationX));
      translateX.value = newX;
      updateValue(newX);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Update thumb position when value prop changes
  React.useEffect(() => {
    translateX.value = interpolate(value, [minimumValue, maximumValue], [0, SLIDER_WIDTH - THUMB_SIZE]);
  }, [value, minimumValue, maximumValue]);

  return (
    <View style={{
      height: THUMB_SIZE + 20,
      width: SLIDER_WIDTH,
      justifyContent: 'center',
      alignSelf: 'center',
    }}>
      {/* Track */}
      <View style={{
        height: 4,
        backgroundColor: AC.systemGray4 as any,
        borderRadius: 2,
        width: SLIDER_WIDTH,
      }} />

      {/* Active Track */}
      <View style={{
        position: 'absolute',
        height: 4,
        backgroundColor: AC.systemBlue as any,
        borderRadius: 2,
        width: translateX.value,
      }} />

      {/* Thumb */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[
          {
            position: 'absolute',
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            backgroundColor: 'white',
            borderRadius: THUMB_SIZE / 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          },
          thumbStyle,
        ]} />
      </PanGestureHandler>
    </View>
  );
}