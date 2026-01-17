import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert, FlatList, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, JazzCashColors, getCategoryColor } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

const ADMIN_PASSWORD = "FATIMA2024";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: RateItem[];
}

interface RateItem {
  id: string;
  name: string;
  rate: number;
  unit: string;
  notes?: string;
}

export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<RateItem | null>(null);
  const [newRate, setNewRate] = useState("");
  const [newItemNameEdit, setNewItemNameEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("package");
  const [newItemName, setNewItemName] = useState("");
  const [newItemRate, setNewItemRate] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kg");
  const [addingToCategory, setAddingToCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadCategories();
      }
    }, [isAuthenticated, loadCategories])
  );

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loadCategories();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ghalat Password", "Admin password ghalat hai");
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !newRate || !newItemNameEdit.trim()) {
      Alert.alert("Error", "Naam aur rate dono daalein");
      return;
    }

    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0) {
      Alert.alert("Error", "Valid rate daalein");
      return;
    }

    try {
      setIsLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}api/admin/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ 
          name: newItemNameEdit.trim(),
          rate 
        }),
      });

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Item update ho gaya!");
        setShowEditModal(false);
        setEditingItem(null);
        setNewRate("");
        setNewItemNameEdit("");
        loadCategories();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "Item update nahi ho saka");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Category naam daalein");
      return;
    }

    try {
      setIsLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({
          name: newCategoryName.toUpperCase().trim(),
          icon: newCategoryIcon,
          color: "#B71C1C",
        }),
      });

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Nai category add ho gayi!");
        setShowAddCategoryModal(false);
        setNewCategoryName("");
        setNewCategoryIcon("package");
        loadCategories();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "Category add nahi ho saki");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Error", "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemRate || !addingToCategory) {
      Alert.alert("Error", "Item naam aur rate daalein");
      return;
    }

    const rate = parseFloat(newItemRate);
    if (isNaN(rate) || rate < 0) {
      Alert.alert("Error", "Valid rate daalein");
      return;
    }

    try {
      setIsLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}api/admin/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({
          categoryId: addingToCategory.id,
          name: newItemName.trim(),
          rate,
          unit: newItemUnit,
        }),
      });

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Nai item add ho gayi!");
        setShowAddItemModal(false);
        setNewItemName("");
        setNewItemRate("");
        setNewItemUnit("kg");
        setAddingToCategory(null);
        loadCategories();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "Item add nahi ho saki");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    Alert.alert(
      "Delete Category?",
      `Kya aap "${category.name}" category delete karna chahte hain? Is ke saare items bhi delete ho jayenge.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const apiUrl = getApiUrl();
              const response = await fetch(`${apiUrl}api/admin/categories/${category.id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${ADMIN_PASSWORD}`,
                },
              });

              if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Category delete ho gayi!");
                setSelectedCategory(null);
                loadCategories();
              } else {
                const error = await response.json();
                Alert.alert("Error", error.error || "Delete nahi ho saki");
              }
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "Server error");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteItem = async (item: RateItem) => {
    Alert.alert(
      "Delete Item?",
      `Kya aap "${item.name}" delete karna chahte hain?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const apiUrl = getApiUrl();
              const response = await fetch(`${apiUrl}api/admin/items/${item.id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${ADMIN_PASSWORD}`,
                },
              });

              if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Item delete ho gayi!");
                loadCategories();
              } else {
                const error = await response.json();
                Alert.alert("Error", error.error || "Delete nahi ho saki");
              }
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Server error");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditItem = (item: RateItem) => {
    setEditingItem(item);
    setNewItemNameEdit(item.name);
    setNewRate(item.rate.toString());
    setShowEditModal(true);
  };

  const openAddItemModal = (category: Category) => {
    setAddingToCategory(category);
    setShowAddItemModal(true);
  };

  const availableIcons = [
    "package", "layers", "box", "circle", "square", "triangle",
    "cpu", "battery", "file", "archive", "database", "disc",
    "grid", "zap", "tool", "settings"
  ];

  const unitOptions = ["kg", "gram", "piece", "ton", "maund"];

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <KeyboardAwareScrollViewCompat
          contentContainerStyle={[
            styles.authContent,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ["#7F0000", "#B71C1C"] : ["#B71C1C", "#C62828"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authHeader}
          >
            <View style={styles.authIcon}>
              <Feather name="lock" size={40} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.authTitle}>Admin Panel</ThemedText>
            <ThemedText style={styles.authSubtitle}>Rate Management System</ThemedText>
          </LinearGradient>

          <View style={styles.authForm}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Admin Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? theme.backgroundSecondary : "#FFFFFF",
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Password daalein..."
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
            />
            <Pressable onPress={handleLogin} style={styles.loginButton}>
              <LinearGradient
                colors={[JazzCashColors.accent, JazzCashColors.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
              >
                <Feather name="unlock" size={20} color="#1A1A1A" />
                <ThemedText style={styles.loginText}>Login</ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        </KeyboardAwareScrollViewCompat>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: insets.bottom + Spacing.xl + 100,
          },
        ]}
        data={categories}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <LinearGradient
              colors={isDark ? ["#7F0000", "#B71C1C"] : ["#B71C1C", "#C62828"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerRow}>
                <View style={styles.headerIcon}>
                  <Feather name="settings" size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.headerTitle}>Rate Management</ThemedText>
                  <ThemedText style={styles.headerSubtitle}>Rates aur categories manage karein</ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>
        }
        renderItem={({ item: category }) => {
          const categoryColor = getCategoryColor(category.name);
          const isExpanded = selectedCategory?.id === category.id;
          
          return (
            <View style={styles.categoryCard}>
              <Pressable
                onPress={() => setSelectedCategory(isExpanded ? null : category)}
                style={[
                  styles.categoryHeader,
                  { backgroundColor: isDark ? theme.backgroundSecondary : categoryColor.bg },
                ]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: categoryColor.accent }]}>
                  <Feather name={category.icon as any} size={20} color="#FFFFFF" />
                </View>
                <ThemedText style={[styles.categoryName, { color: categoryColor.icon }]}>
                  {category.name}
                </ThemedText>
                <ThemedText style={[styles.itemCount, { color: theme.textSecondary }]}>
                  {category.items.length} items
                </ThemedText>
                <Pressable
                  onPress={() => handleDeleteCategory(category)}
                  hitSlop={8}
                  style={styles.deleteIconButton}
                >
                  <Feather name="trash-2" size={16} color="#C62828" />
                </Pressable>
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>

              {isExpanded ? (
                <View style={[styles.itemsList, { backgroundColor: theme.backgroundDefault }]}>
                  {category.items.map((item) => (
                    <View key={item.id} style={[styles.itemRow, { borderBottomColor: theme.border }]}>
                      <Pressable
                        onPress={() => handleEditItem(item)}
                        style={styles.itemInfo}
                      >
                        <ThemedText style={[styles.itemName, { color: theme.text }]}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={[styles.itemUnit, { color: theme.textSecondary }]}>
                          per {item.unit}
                        </ThemedText>
                      </Pressable>
                      <View style={styles.itemActions}>
                        <ThemedText style={[styles.rateValue, { color: categoryColor.accent }]}>
                          Rs {item.rate}
                        </ThemedText>
                        <Pressable onPress={() => handleEditItem(item)} hitSlop={8}>
                          <Feather name="edit-2" size={16} color={categoryColor.accent} />
                        </Pressable>
                        <Pressable onPress={() => handleDeleteItem(item)} hitSlop={8}>
                          <Feather name="trash-2" size={16} color="#C62828" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  <Pressable
                    onPress={() => openAddItemModal(category)}
                    style={styles.addItemButton}
                  >
                    <Feather name="plus" size={18} color="#2E7D32" />
                    <ThemedText style={styles.addItemText}>Nai Item Add Karein</ThemedText>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        }}
      />

      <Pressable
        onPress={() => setShowAddCategoryModal(true)}
        style={styles.fabButton}
      >
        <LinearGradient
          colors={[JazzCashColors.accent, JazzCashColors.accentLight]}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={24} color="#1A1A1A" />
          <ThemedText style={styles.fabText}>Nai Category</ThemedText>
        </LinearGradient>
      </Pressable>

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
              Item Edit Karein
            </ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                Item Naam
              </ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#F5F5F5",
                    color: theme.text,
                  },
                ]}
                value={newItemNameEdit}
                onChangeText={setNewItemNameEdit}
                placeholder="Item ka naam"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                Rate (Rs)
              </ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#F5F5F5",
                    color: theme.text,
                  },
                ]}
                value={newRate}
                onChangeText={setNewRate}
                keyboardType="numeric"
                placeholder="Rate daalein"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setNewRate("");
                  setNewItemNameEdit("");
                }}
                style={[styles.cancelButton, { borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleUpdateItem} style={styles.saveButton}>
                <LinearGradient
                  colors={[JazzCashColors.accent, JazzCashColors.accentLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <ThemedText style={styles.saveText}>
                    {isLoading ? "Saving..." : "Save"}
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
              Nai Category Add Karein
            </ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                Category Naam
              </ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#F5F5F5",
                    color: theme.text,
                  },
                ]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="e.g. TIN, ZINC, etc."
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                Icon Select Karein
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
                {availableIcons.map((iconName) => (
                  <Pressable
                    key={iconName}
                    onPress={() => setNewCategoryIcon(iconName)}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: newCategoryIcon === iconName ? JazzCashColors.primary : (isDark ? theme.backgroundSecondary : "#F5F5F5"),
                      },
                    ]}
                  >
                    <Feather
                      name={iconName as any}
                      size={20}
                      color={newCategoryIcon === iconName ? "#FFFFFF" : theme.text}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName("");
                  setNewCategoryIcon("package");
                }}
                style={[styles.cancelButton, { borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleAddCategory} style={styles.saveButton}>
                <LinearGradient
                  colors={[JazzCashColors.accent, JazzCashColors.accentLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <ThemedText style={styles.saveText}>
                    {isLoading ? "Adding..." : "Add Category"}
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddItemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
              Nai Item Add Karein
            </ThemedText>
            <ThemedText style={[styles.modalItemName, { color: theme.textSecondary }]}>
              Category: {addingToCategory?.name}
            </ThemedText>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                Item Naam
              </ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#F5F5F5",
                    color: theme.text,
                  },
                ]}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="e.g. Heavy Iron, Light Copper"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Rate (Rs)
                </ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: isDark ? theme.backgroundSecondary : "#F5F5F5",
                      color: theme.text,
                    },
                  ]}
                  value={newItemRate}
                  onChangeText={setNewItemRate}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <ThemedText style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Unit
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelector}>
                  {unitOptions.map((unit) => (
                    <Pressable
                      key={unit}
                      onPress={() => setNewItemUnit(unit)}
                      style={[
                        styles.unitOption,
                        {
                          backgroundColor: newItemUnit === unit ? JazzCashColors.primary : (isDark ? theme.backgroundSecondary : "#F5F5F5"),
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.unitOptionText,
                          { color: newItemUnit === unit ? "#FFFFFF" : theme.text },
                        ]}
                      >
                        {unit}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setShowAddItemModal(false);
                  setNewItemName("");
                  setNewItemRate("");
                  setNewItemUnit("kg");
                  setAddingToCategory(null);
                }}
                style={[styles.cancelButton, { borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={handleAddItem} style={styles.saveButton}>
                <LinearGradient
                  colors={[JazzCashColors.accent, JazzCashColors.accentLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <ThemedText style={styles.saveText}>
                    {isLoading ? "Adding..." : "Add Item"}
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  authHeader: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  authIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  authSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  authForm: {
    gap: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  loginButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  loginGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  loginText: {
    color: "#1A1A1A",
    fontSize: 17,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  categoryCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  itemCount: {
    fontSize: 13,
  },
  deleteIconButton: {
    padding: Spacing.xs,
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
  },
  itemUnit: {
    fontSize: 12,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rateValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: "#E8F5E9",
  },
  addItemText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  fabText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  modalItemName: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  rateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "600",
  },
  rateInput: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 20,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  formLabel: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  formInput: {
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  iconSelector: {
    flexDirection: "row",
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  unitSelector: {
    flexDirection: "row",
    marginTop: Spacing.xs,
  },
  unitOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  unitOptionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  saveGradient: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "700",
  },
});
