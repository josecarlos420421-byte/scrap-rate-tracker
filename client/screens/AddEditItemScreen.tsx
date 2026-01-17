import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RateItem, RATE_UNITS, RateUnit } from "@/types/rate";
import { addRateItem, updateRateItem, getSettings } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AddEditItem">;
type RouteType = RouteProp<RootStackParamList, "AddEditItem">;

export default function AddEditItemScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();

  const { mode, categoryId, categoryName, item: existingItem } = route.params;
  const isEditing = mode === "edit";

  const [name, setName] = useState(existingItem?.name || "");
  const [rate, setRate] = useState(existingItem?.rate?.toString() || "");
  const [unit, setUnit] = useState<RateUnit>((existingItem?.unit as RateUnit) || "kg");
  const [notes, setNotes] = useState(existingItem?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadDefaultUnit = async () => {
      if (!isEditing) {
        const settings = await getSettings();
        setUnit(settings.defaultUnit as RateUnit);
      }
    };
    loadDefaultUnit();
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Item ka naam daalein");
      return;
    }

    const rateValue = parseFloat(rate);
    if (isNaN(rateValue) || rateValue <= 0) {
      Alert.alert("Error", "Sahi rate daalein");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && existingItem) {
        await updateRateItem(categoryId, existingItem.id, {
          name: name.trim(),
          rate: rateValue,
          unit,
          notes: notes.trim() || undefined,
        });
      } else {
        await addRateItem(categoryId, {
          name: name.trim(),
          rate: rateValue,
          unit,
          notes: notes.trim() || undefined,
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Item save nahi ho saka. Dobara try karein.");
    } finally {
      setIsSaving(false);
    }
  }, [name, rate, unit, notes, isEditing, existingItem, categoryId, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? "Rate Update Karein" : `${categoryName} - Naya Item`,
      headerLeft: () => (
        <HeaderButton
          onPress={() => navigation.goBack()}
          pressColor="transparent"
          pressOpacity={0.7}
        >
          <ThemedText style={{ color: theme.link }}>Cancel</ThemedText>
        </HeaderButton>
      ),
      headerRight: () => (
        <HeaderButton
          onPress={handleSave}
          disabled={isSaving}
          pressColor="transparent"
          pressOpacity={0.7}
        >
          <ThemedText
            style={{
              color: isSaving ? theme.textSecondary : theme.link,
              fontWeight: "600",
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </ThemedText>
        </HeaderButton>
      ),
    });
  }, [navigation, isEditing, categoryName, handleSave, isSaving, theme]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing["3xl"],
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.field}>
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Item Naam
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="e.g., Sarya, Patti, Wire"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          testID="input-item-name"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Rate (Rs)
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.rateInput,
            {
              backgroundColor: theme.backgroundDefault,
              color: isDark ? Colors.dark.primary : Colors.light.primary,
              borderColor: theme.border,
            },
          ]}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          value={rate}
          onChangeText={setRate}
          keyboardType="numeric"
          testID="input-rate"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Unit
        </ThemedText>
        <View style={styles.unitContainer}>
          {RATE_UNITS.map((u) => (
            <Pressable
              key={u.value}
              onPress={() => {
                Haptics.selectionAsync();
                setUnit(u.value);
              }}
              style={[
                styles.unitButton,
                {
                  backgroundColor:
                    unit === u.value
                      ? isDark
                        ? Colors.dark.primary
                        : Colors.light.primary
                      : theme.backgroundDefault,
                  borderColor:
                    unit === u.value
                      ? isDark
                        ? Colors.dark.primary
                        : Colors.light.primary
                      : theme.border,
                },
              ]}
              testID={`unit-${u.value}`}
            >
              <ThemedText
                style={[
                  styles.unitText,
                  {
                    color: unit === u.value ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {u.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Notes (Optional)
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.notesInput,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Koi notes likhein..."
          placeholderTextColor={theme.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          testID="input-notes"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  field: {
    marginBottom: Spacing["2xl"],
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  rateInput: {
    fontSize: 28,
    fontWeight: "700",
    height: 64,
  },
  unitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  unitButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
  },
  notesInput: {
    height: 100,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
});
