import React from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors, CategoryColors } from "@/constants/theme";
import { RateItem } from "@/types/rate";
import { formatCurrency, formatRelativeTime } from "@/lib/storage";
import { getItemImage } from "@/lib/scrapImages";

interface RateItemCardProps {
  item: RateItem;
  currency: string;
  onPress?: () => void;
  onDelete?: () => void;
  rateChange?: number;
  categoryColor?: typeof CategoryColors.loha;
  categoryName?: string;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RateItemCard({ 
  item, 
  currency, 
  onPress, 
  onDelete,
  rateChange,
  categoryColor,
  categoryName = "",
}: RateItemCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  
  const color = categoryColor || { accent: Colors.light.primary, bg: "#E3F2FD", icon: "#1565C0" };
  const scrapImage = getItemImage(item.name, categoryName);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDelete();
    }
  };

  const hasRateChange = rateChange !== undefined && rateChange !== 0;
  const isRateUp = hasRateChange && rateChange > 0;
  const isRateDown = hasRateChange && rateChange < 0;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF",
          borderColor: isDark ? theme.cardBorder : color.accent + "30",
        },
        animatedStyle,
      ]}
      testID={`rate-item-${item.id}`}
    >
      <View style={[styles.colorBar, { backgroundColor: color.accent }]} />
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={scrapImage}
            style={styles.itemImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.leftContent}>
            <ThemedText type="h4" style={styles.itemName} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <View style={styles.rateRow}>
              <ThemedText
                style={[
                  styles.rateValue,
                  { color: color.accent },
                ]}
              >
                {formatCurrency(item.rate, currency)}
              </ThemedText>
              <ThemedText
                style={[styles.unit, { color: theme.textSecondary }]}
              >
                /{item.unit}
              </ThemedText>
            </View>
            
            {hasRateChange ? (
              <View style={styles.changeRow}>
                <View
                  style={[
                    styles.changeBadge,
                    { backgroundColor: isRateUp ? "#E8F5E9" : "#FFEBEE" },
                  ]}
                >
                  <Feather
                    name={isRateUp ? "trending-up" : "trending-down"}
                    size={11}
                    color={isRateUp ? "#2E7D32" : "#C62828"}
                  />
                  <ThemedText
                    style={[
                      styles.changeText,
                      { color: isRateUp ? "#2E7D32" : "#C62828" },
                    ]}
                  >
                    {isRateUp ? "+" : ""}{formatCurrency(Math.abs(rateChange), currency)}
                  </ThemedText>
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.rightContent}>
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={12}
              testID={`delete-item-${item.id}`}
            >
              <Feather name="trash-2" size={16} color={theme.error} />
            </Pressable>
            <View style={[styles.editButton, { backgroundColor: color.bg }]}>
              <Feather name="edit-2" size={14} color={color.accent} />
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
    flexDirection: "row",
  },
  colorBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
  },
  itemName: {
    marginBottom: 2,
    fontSize: 15,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  unit: {
    fontSize: 12,
    marginLeft: 3,
  },
  changeRow: {
    marginTop: 2,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    gap: 3,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  rightContent: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
