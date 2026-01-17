import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface LoadingStateProps {
  count?: number;
}

function SkeletonCard() {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        { backgroundColor: theme.backgroundSecondary },
        animatedStyle,
      ]}
    >
      <View style={styles.skeletonContent}>
        <View
          style={[
            styles.skeletonTitle,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        />
        <View
          style={[
            styles.skeletonRate,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        />
        <View
          style={[
            styles.skeletonTimestamp,
            { backgroundColor: theme.backgroundTertiary },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function LoadingState({ count = 4 }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
  },
  skeletonCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  skeletonContent: {
    gap: Spacing.sm,
  },
  skeletonTitle: {
    width: "50%",
    height: 20,
    borderRadius: BorderRadius.xs,
  },
  skeletonRate: {
    width: "40%",
    height: 32,
    borderRadius: BorderRadius.xs,
  },
  skeletonTimestamp: {
    width: "30%",
    height: 14,
    borderRadius: BorderRadius.xs,
  },
});
