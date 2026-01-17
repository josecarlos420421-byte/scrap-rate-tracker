import React, { useCallback, useState, useEffect } from "react";
import { FlatList, StyleSheet, View, RefreshControl, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, getCategoryColor } from "@/constants/theme";
import { RateItemCard } from "@/components/RateItemCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { RateItem, Category } from "@/types/rate";
import { getSettings, formatDate, getLastNDays } from "@/lib/storage";
import { getApiUrl } from "@/lib/query-client";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "CategoryDetail">;
type RouteType = RouteProp<RootStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const { categoryId, categoryName } = route.params;
  const categoryColor = getCategoryColor(categoryName);

  const [category, setCategory] = useState<Category | null>(null);
  const [currency, setCurrency] = useState("Rs");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate());
  const [availableDates] = useState<string[]>(getLastNDays(10));

  useEffect(() => {
    navigation.setOptions({
      headerTitle: categoryName,
      headerStyle: {
        backgroundColor: isDark ? theme.backgroundRoot : categoryColor.bg,
      },
    });
  }, [navigation, categoryName, isDark, theme, categoryColor]);

  const loadData = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const [categoryResponse, settingsData] = await Promise.all([
        fetch(`${apiUrl}api/categories/${categoryId}`),
        getSettings(),
      ]);
      
      if (categoryResponse.ok) {
        const data = await categoryResponse.json();
        const mappedCategory: Category = {
          id: data.id,
          name: data.name,
          icon: data.icon,
          items: (data.items || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            rate: item.rate,
            unit: item.unit,
            notes: item.notes,
            updatedAt: item.updatedAt,
            rateHistory: item.rateHistory || [],
          })),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        setCategory(mappedCategory);
      }
      setCurrency(settingsData.currency);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [categoryId]);

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

  const handleDateSelect = (date: string) => {
    Haptics.selectionAsync();
    setSelectedDate(date);
  };

  const getRateForDate = (item: RateItem, date: string): number => {
    if (!item.rateHistory || item.rateHistory.length === 0) {
      return item.rate;
    }
    const historyEntry = item.rateHistory.find(h => h.date === date);
    return historyEntry ? historyEntry.rate : item.rate;
  };

  const isToday = selectedDate === formatDate();

  const renderDateSelector = () => {
    return (
      <View style={styles.dateContainer}>
        <ThemedText style={[styles.dateTitle, { color: categoryColor.icon }]}>
          Tarikh Chunein (Date Select)
        </ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
        >
          {availableDates.map((date, index) => {
            const isSelected = date === selectedDate;
            const dateObj = new Date(date.split("-").reverse().join("-"));
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = date.split("-")[0];
            
            return (
              <Pressable
                key={date}
                onPress={() => handleDateSelect(date)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: isSelected ? categoryColor.accent : (isDark ? theme.backgroundSecondary : "#FFFFFF"),
                    borderColor: isSelected ? categoryColor.accent : theme.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayName,
                    { color: isSelected ? "#FFFFFF" : theme.textSecondary },
                  ]}
                >
                  {index === 0 ? "Aaj" : dayName}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.dayNum,
                    { color: isSelected ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {dayNum}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        {renderDateSelector()}
        
        <View
          style={[
            styles.ratesSection,
            { backgroundColor: isDark ? categoryColor.accent + "20" : categoryColor.bg },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: categoryColor.accent }]}>
              <Feather name="calendar" size={16} color="#FFFFFF" />
            </View>
            <View>
              <ThemedText style={[styles.sectionTitle, { color: categoryColor.icon }]}>
                {isToday ? "Today's Rates" : "Previous Rates"}
              </ThemedText>
              <ThemedText style={[styles.sectionDate, { color: theme.textSecondary }]}>
                {selectedDate}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    );
  }, [theme, isDark, categoryColor, selectedDate, isToday, availableDates]);

  const renderItem = useCallback(
    ({ item }: { item: RateItem }) => {
      const displayRate = getRateForDate(item, selectedDate);
      const todayRate = item.rate;
      const rateChange = displayRate !== todayRate ? todayRate - displayRate : 0;
      
      return (
        <RateItemCard
          item={{ ...item, rate: displayRate }}
          currency={currency}
          rateChange={isToday ? undefined : rateChange}
          categoryColor={categoryColor}
          categoryName={categoryName}
        />
      );
    },
    [currency, selectedDate, isToday, categoryColor, categoryName]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="Koi Item Nahi"
        message={`${categoryName} mein abhi koi item nahi hai.`}
      />
    );
  }, [isLoading, categoryName]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? theme.backgroundRoot : categoryColor.bg + "40" }]}>
        <View style={{ paddingTop: headerHeight + Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <LoadingState count={5} />
        </View>
      </View>
    );
  }

  const items = category?.items || [];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? theme.backgroundRoot : categoryColor.bg + "40" }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
          items.length === 0 && styles.emptyList,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={items.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={categoryColor.accent}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  dateContainer: {
    marginBottom: Spacing.lg,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  dateScrollContent: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  dateChip: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 56,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "500",
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "700",
  },
  ratesSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionDate: {
    fontSize: 13,
  },
});
