import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { CATEGORY_ICONS } from "@/types/rate";
import { addCategory } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AddCategory">;

export default function AddCategoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("box");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Category ka naam daalein");
      return;
    }

    setIsSaving(true);
    try {
      await addCategory(name.trim(), icon);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving category:", error);
      Alert.alert("Error", "Category save nahi ho saki. Dobara try karein.");
    } finally {
      setIsSaving(false);
    }
  }, [name, icon, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Nai Category",
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
  }, [navigation, handleSave, isSaving, theme]);

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
          Category Naam
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
          placeholder="e.g., LOHA, COPPER, ALUMINUM"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="characters"
          autoFocus
          testID="input-category-name"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Icon Choose Karein
        </ThemedText>
        <View style={styles.iconGrid}>
          {CATEGORY_ICONS.map((iconOption) => (
            <Pressable
              key={iconOption.value}
              onPress={() => {
                Haptics.selectionAsync();
                setIcon(iconOption.value);
              }}
              style={[
                styles.iconButton,
                {
                  backgroundColor:
                    icon === iconOption.value
                      ? isDark
                        ? Colors.dark.primary
                        : Colors.light.primary
                      : theme.backgroundDefault,
                  borderColor:
                    icon === iconOption.value
                      ? isDark
                        ? Colors.dark.primary
                        : Colors.light.primary
                      : theme.border,
                },
              ]}
              testID={`icon-${iconOption.value}`}
            >
              <Feather
                name={iconOption.value as any}
                size={24}
                color={icon === iconOption.value ? "#FFFFFF" : theme.text}
              />
            </Pressable>
          ))}
        </View>
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
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
