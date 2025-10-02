import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const DURATION = 280;

export default function AnimatedThemeView({ style, ...props }: ViewProps) {
  const colors = useSelector((s: RootState) => s.theme.colors);
  // keep previous color values to interpolate from
  const prevBg = useSharedValue(colors.background);
  const prevText = useSharedValue(colors.text);
  const progress = useSharedValue(0);

  useEffect(() => {
    // restart animation when palette changes
    progress.value = 0;
    prevBg.value = colors.background;
    prevText.value = colors.text;
    progress.value = withTiming(1, { duration: DURATION });
  }, [colors.background, colors.text]);

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      [prevBg.value, colors.background]
    );
    return { backgroundColor: bg };
  });

  return <Animated.View style={[{ flex: 1 }, animatedStyle, style]} {...props} />;
}
