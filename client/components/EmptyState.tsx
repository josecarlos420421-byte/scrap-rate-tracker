import React from "react";
import { StyleSheet, View, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  message: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  showImage?: boolean;
}

export function EmptyState({
  title,
  message,
  buttonLabel,
  onButtonPress,
  showImage = true,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {showImage ? (
        <Image
          source={require("../../assets/images/empty-rates.png")}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}
      <ThemedText type="h4" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText
        style={[styles.message, { color: theme.textSecondary }]}
      >
        {message}
      </ThemedText>
      {buttonLabel && onButtonPress ? (
        <Button onPress={onButtonPress} style={styles.button}>
          {buttonLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: Spacing["2xl"],
    opacity: 0.9,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
  },
  button: {
    paddingHorizontal: Spacing["3xl"],
  },
});
