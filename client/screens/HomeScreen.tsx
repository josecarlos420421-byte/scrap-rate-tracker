import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius, JazzCashColors } from "@/constants/theme";
import { CategoryCard } from "@/components/CategoryCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { Category } from "@/types/rate";
import { formatDate } from "@/lib/storage";
import { isSubscriptionActive, getDaysRemaining, getSubscription } from "@/lib/subscription";
import { getApiUrl } from "@/lib/query-client";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscriptionDays, setSubscriptionDays] = useState<number>(0);

  const checkSubscription = useCallback(async () => {
    const isActive = await isSubscriptionActive();
    if (!isActive) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Subscription" }],
      });
      return false;
    }
    const sub = await getSubscription();
    setSubscriptionDays(getDaysRemaining(sub.expiresAt));
    return true;
  }, [navigation]);

  const loadData = useCallback(async () => {
    try {
      const hasAccess = await checkSubscription();
      if (!hasAccess) return;

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}api/categories`);
      if (response.ok) {
        const data = await response.json();
        const mappedData: Category[] = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          items: (cat.items || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            rate: item.rate,
            unit: item.unit,
            notes: item.notes,
            updatedAt: item.updatedAt,
            rateHistory: item.rateHistory || [],
          })),
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        }));
        setCategories(mappedData);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [checkSubscription]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadData();
  }, [loadData]);

  const handleCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate("CategoryDetail", { categoryId: category.id, categoryName: category.name });
    },
    [navigation]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <LinearGradient
          colors={isDark ? ["#7F0000", "#B71C1C"] : ["#B71C1C", "#C62828"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Feather name="calendar" size={22} color="#FFFFFF" />
            </View>
            <View>
              <ThemedText style={styles.dateLabel}>Aaj ki Tarikh</ThemedText>
              <ThemedText style={styles.dateValue}>{formatDate()}</ThemedText>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{categories.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Categories</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {categories.reduce((sum, cat) => sum + cat.items.length, 0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Items</ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{subscriptionDays}</ThemedText>
              <ThemedText style={styles.statLabel}>Din Baqi</ThemedText>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: JazzCashColors.accent }]}>
            <Feather name="grid" size={16} color="#FFFFFF" />
          </View>
          <View>
            <ThemedText type="h3" style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
              Mukamal Category List
            </ThemedText>
            <ThemedText style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Category par click karein rates dekhne ke liye
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }, [categories, isDark, theme, subscriptionDays]);

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryCard
        category={item}
        onPress={() => handleCategoryPress(item)}
      />
    ),
    [handleCategoryPress]
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title="Koi Category Nahi"
            message="Abhi koi category nahi hai. Server se data load ho raha hai..."
            showImage={false}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[JazzCashColors.primary]}
            tintColor={JazzCashColors.primary}
            progressViewOffset={headerHeight}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  dateLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
