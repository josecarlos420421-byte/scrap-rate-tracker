import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
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
import { Spacing, BorderRadius, getCategoryColor } from "@/constants/theme";
import { Category } from "@/types/rate";
import { formatRelativeTime } from "@/lib/storage";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  onDelete?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryCard({ category, onPress, onDelete }: CategoryCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const categoryColor = getCategoryColor(category.name);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleDelete = () => {
    if (onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDelete();
    }
  };

  const itemCount = category.items.length;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? theme.backgroundDefault : categoryColor.bg,
          borderColor: isDark ? theme.cardBorder : categoryColor.accent + "40",
        },
        animatedStyle,
      ]}
      testID={`category-card-${category.id}`}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryColor.accent },
          ]}
        >
          <Feather name={category.icon as any} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.textContent}>
          <ThemedText type="h4" style={[styles.categoryName, isDark ? {} : { color: categoryColor.icon }]}>
            {category.name}
          </ThemedText>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: categoryColor.accent + "20" }]}>
              <ThemedText style={[styles.itemCount, { color: categoryColor.accent }]}>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </ThemedText>
            </View>
            <ThemedText style={[styles.timestamp, { color: theme.textSecondary }]}>
              {formatRelativeTime(category.updatedAt)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.deleteButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            hitSlop={12}
            testID={`delete-category-${category.id}`}
          >
            <Feather name="trash-2" size={18} color={theme.error} />
          </Pressable>
          <View style={[styles.arrowContainer, { backgroundColor: categoryColor.accent }]}>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  categoryName: {
    marginBottom: Spacing.sm,
    fontSize: 17,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
  },
  rightContent: {
    alignItems: "center",
    gap: Spacing.md,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
