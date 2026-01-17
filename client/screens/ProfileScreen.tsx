import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert, Linking, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, JazzCashColors } from "@/constants/theme";
import { getSettings, saveSettings, AppSettings } from "@/lib/storage";
import { RATE_UNITS } from "@/types/rate";
import {
  getSubscription,
  isSubscriptionActive,
  getDaysRemaining,
  formatExpiryDate,
  PAYMENT_INFO,
  SubscriptionData,
  verifyAdminPassword,
  generateActivationCodes,
  getActivationCodes,
  deleteUnusedCodes,
  ActivationCode,
} from "@/lib/subscription";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CURRENCIES = [
  { value: "Rs", label: "Rs (Pakistani Rupee)" },
  { value: "USD", label: "$ (US Dollar)" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
  { value: "INR", label: "Indian Rupee" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [settings, setSettings] = useState<AppSettings>({
    currency: "Rs",
    defaultUnit: "kg",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isSubActive, setIsSubActive] = useState(false);
  
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    const sub = await getSubscription();
    setSubscription(sub);
    const active = await isSubscriptionActive();
    setIsSubActive(active);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
      loadSubscription();
    }, [loadSettings, loadSubscription])
  );

  const handleSaveSetting = useCallback(
    async (key: keyof AppSettings, value: string) => {
      try {
        const updated = await saveSettings({ [key]: value });
        setSettings(updated);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error("Error saving setting:", error);
        Alert.alert("Error", "Failed to save setting");
      }
    },
    []
  );

  const handleNameChange = useCallback(
    (text: string) => {
      setSettings((prev) => ({ ...prev, displayName: text }));
    },
    []
  );

  const handleNameBlur = useCallback(() => {
    handleSaveSetting("displayName", settings.displayName);
  }, [handleSaveSetting, settings.displayName]);

  const handleRenewSubscription = () => {
    navigation.navigate("Subscription");
  };

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent(
      "Assalam-o-Alaikum! Mujhe Scrap Rate Tracker app ke baare mein madad chahiye."
    );
    Linking.openURL(`https://wa.me/92${PAYMENT_INFO.accountNumber.replace(/-/g, "").substring(1)}?text=${message}`);
  };

  const loadActivationCodes = useCallback(async () => {
    const codes = await getActivationCodes();
    setActivationCodes(codes);
  }, []);

  const handleAdminLogin = useCallback(() => {
    if (verifyAdminPassword(adminPassword)) {
      setIsAdminUnlocked(true);
      setAdminPassword("");
      loadActivationCodes();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert("Ghalat Password", "Admin password sahi nahi hai.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [adminPassword, loadActivationCodes]);

  const handleGenerateCodes = useCallback(async (count: number) => {
    setIsGenerating(true);
    try {
      const newCodes = await generateActivationCodes(count);
      await loadActivationCodes();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Codes Bana Diye", `${newCodes.length} naye activation codes bana diye gaye hain.`);
    } catch (error) {
      Alert.alert("Error", "Codes banane mein masla aaya.");
    } finally {
      setIsGenerating(false);
    }
  }, [loadActivationCodes]);

  const handleShareCode = useCallback(async (code: string) => {
    try {
      await Share.share({
        message: `Aapka Scrap Rate Tracker Activation Code: ${code}\n\nYeh code sirf ek baar use ho sakta hai. Rs ${PAYMENT_INFO.monthlyFee}/month subscription ke liye.`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  }, []);

  const handleDeleteUnusedCodes = useCallback(async () => {
    Alert.alert(
      "Unused Codes Delete?",
      "Kya aap sab unused codes delete karna chahte ho? Yeh wapis nahi aayenge.",
      [
        { text: "Nahi", style: "cancel" },
        {
          text: "Haan, Delete Karo",
          style: "destructive",
          onPress: async () => {
            await deleteUnusedCodes();
            await loadActivationCodes();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  }, [loadActivationCodes]);

  const unusedCodes = activationCodes.filter(c => !c.isUsed);
  const usedCodes = activationCodes.filter(c => c.isUsed);
  const daysRemaining = subscription ? getDaysRemaining(subscription.expiresAt) : 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: isDark ? theme.backgroundRoot : "#F5F5F5" }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing["3xl"],
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <LinearGradient
        colors={isDark ? ["#7F0000", "#B71C1C"] : ["#B71C1C", "#C62828"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileGradient}
      >
        <View style={styles.avatarContainer}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <TextInput
          style={styles.nameInput}
          placeholder="Apna Naam Likhein"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={settings.displayName}
          onChangeText={handleNameChange}
          onBlur={handleNameBlur}
          testID="input-display-name"
        />
        <ThemedText style={styles.profileSubtitle}>Scrap Dealer Profile</ThemedText>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: isSubActive ? "#2E7D32" : JazzCashColors.primary }]}>
            <Feather name={isSubActive ? "check-circle" : "clock"} size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
            Subscription - سبسکرپشن
          </ThemedText>
        </View>
        <View style={[styles.subscriptionCard, { backgroundColor: isSubActive ? "#E8F5E9" : "#FFEBEE" }]}>
          <View style={styles.subscriptionInfo}>
            <View style={[styles.subscriptionBadge, { backgroundColor: isSubActive ? "#2E7D32" : JazzCashColors.primary }]}>
              <Feather name={isSubActive ? "unlock" : "lock"} size={16} color="#FFFFFF" />
            </View>
            <View style={styles.subscriptionDetails}>
              <ThemedText style={[styles.subscriptionStatus, { color: isSubActive ? "#1B5E20" : "#B71C1C" }]}>
                {isSubActive ? "Active - فعال" : "Expired - ختم"}
              </ThemedText>
              {isSubActive ? (
                <>
                  <ThemedText style={[styles.subscriptionDays, { color: "#2E7D32" }]}>
                    {daysRemaining} din baqi hain
                  </ThemedText>
                  <ThemedText style={[styles.subscriptionExpiry, { color: "#388E3C" }]}>
                    Expire: {formatExpiryDate(subscription?.expiresAt || null)}
                  </ThemedText>
                </>
              ) : (
                <ThemedText style={[styles.subscriptionDays, { color: "#C62828" }]}>
                  Subscription khatam ho gayi
                </ThemedText>
              )}
            </View>
          </View>
          <Pressable
            onPress={handleRenewSubscription}
            style={({ pressed }) => [
              styles.renewButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <LinearGradient
              colors={isSubActive ? ["#2E7D32", "#388E3C"] : [JazzCashColors.accent, "#FFB300"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.renewGradient}
            >
              <Feather name="refresh-cw" size={14} color={isSubActive ? "#FFFFFF" : "#1A1A1A"} />
              <ThemedText style={[styles.renewText, { color: isSubActive ? "#FFFFFF" : "#1A1A1A" }]}>
                {isSubActive ? "Renew Karein" : "Subscribe Karein"}
              </ThemedText>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: JazzCashColors.accent }]}>
            <Feather name="dollar-sign" size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>Currency - کرنسی</ThemedText>
        </View>
        <View style={[styles.optionsCard, { backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF" }]}>
          {CURRENCIES.map((currency, index) => {
            const isSelected = settings.currency === currency.value;
            return (
              <Pressable
                key={currency.value}
                onPress={() => handleSaveSetting("currency", currency.value)}
                style={[
                  styles.optionRow,
                  isSelected && { backgroundColor: "#FFF8E1" },
                  index < CURRENCIES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
                testID={`currency-${currency.value}`}
              >
                <ThemedText style={[styles.optionLabel, isSelected && { color: "#E65100", fontWeight: "600" }]}>
                  {currency.label}
                </ThemedText>
                {isSelected ? (
                  <View style={[styles.checkIcon, { backgroundColor: JazzCashColors.accent }]}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: "#2E7D32" }]}>
            <Feather name="package" size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>Default Unit - ڈیفالٹ یونٹ</ThemedText>
        </View>
        <View style={[styles.optionsCard, { backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF" }]}>
          {RATE_UNITS.map((unit, index) => {
            const isSelected = settings.defaultUnit === unit.value;
            return (
              <Pressable
                key={unit.value}
                onPress={() => handleSaveSetting("defaultUnit", unit.value)}
                style={[
                  styles.optionRow,
                  isSelected && { backgroundColor: "#E8F5E9" },
                  index < RATE_UNITS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
                testID={`default-unit-${unit.value}`}
              >
                <ThemedText style={[styles.optionLabel, isSelected && { color: "#1B5E20", fontWeight: "600" }]}>
                  {unit.label}
                </ThemedText>
                {isSelected ? (
                  <View style={[styles.checkIcon, { backgroundColor: "#2E7D32" }]}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: "#25D366" }]}>
            <Feather name="message-circle" size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>Support - مدد</ThemedText>
        </View>
        <Pressable
          onPress={handleWhatsAppSupport}
          style={({ pressed }) => [
            styles.supportButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <LinearGradient
            colors={["#25D366", "#128C7E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.supportGradient}
          >
            <Feather name="message-circle" size={20} color="#FFFFFF" />
            <View style={styles.supportTextContainer}>
              <ThemedText style={styles.supportTitle}>WhatsApp Support</ThemedText>
              <ThemedText style={styles.supportNumber}>{PAYMENT_INFO.accountNumber}</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: "#7B1FA2" }]}>
            <Feather name="key" size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
            Admin Panel - ایڈمن
          </ThemedText>
        </View>
        
        {!isAdminUnlocked ? (
          <View style={[styles.adminLoginCard, { backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF" }]}>
            <ThemedText style={styles.adminLoginHint}>
              Admin password daalein codes manage karne ke liye
            </ThemedText>
            <View style={styles.adminLoginRow}>
              <TextInput
                style={[styles.adminPasswordInput, { 
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F5F5F5",
                  color: isDark ? "#FFFFFF" : "#1A1A1A"
                }]}
                placeholder="Admin Password"
                placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "#999"}
                value={adminPassword}
                onChangeText={setAdminPassword}
                secureTextEntry
                testID="input-admin-password"
              />
              <Pressable
                onPress={handleAdminLogin}
                style={({ pressed }) => [
                  styles.adminLoginButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <LinearGradient
                  colors={[JazzCashColors.primary, "#7F0000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.adminLoginButtonGradient}
                >
                  <Feather name="unlock" size={18} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.adminPanel, { backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF" }]}>
            <Pressable
              onPress={() => navigation.navigate("AdminPanel")}
              style={({ pressed }) => [
                styles.rateManagementButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <LinearGradient
                colors={[JazzCashColors.primary, "#7F0000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rateManagementGradient}
              >
                <Feather name="trending-up" size={20} color="#FFFFFF" />
                <View style={styles.rateManagementText}>
                  <ThemedText style={styles.rateManagementTitle}>Rate Management</ThemedText>
                  <ThemedText style={styles.rateManagementSubtitle}>Rates yahan se change karein</ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>

            <View style={styles.adminStatsRow}>
              <View style={[styles.adminStatCard, { backgroundColor: "#E8F5E9" }]}>
                <ThemedText style={[styles.adminStatNumber, { color: "#2E7D32" }]}>
                  {unusedCodes.length}
                </ThemedText>
                <ThemedText style={[styles.adminStatLabel, { color: "#388E3C" }]}>
                  Available Codes
                </ThemedText>
              </View>
              <View style={[styles.adminStatCard, { backgroundColor: "#FFEBEE" }]}>
                <ThemedText style={[styles.adminStatNumber, { color: "#C62828" }]}>
                  {usedCodes.length}
                </ThemedText>
                <ThemedText style={[styles.adminStatLabel, { color: "#C62828" }]}>
                  Used Codes
                </ThemedText>
              </View>
            </View>

            <View style={styles.adminButtonsRow}>
              <Pressable
                onPress={() => handleGenerateCodes(5)}
                disabled={isGenerating}
                style={({ pressed }) => [
                  styles.adminActionButton,
                  { opacity: pressed || isGenerating ? 0.7 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#2E7D32", "#388E3C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.adminActionGradient}
                >
                  <Feather name="plus" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.adminActionText}>5 Codes</ThemedText>
                </LinearGradient>
              </Pressable>
              <Pressable
                onPress={() => handleGenerateCodes(10)}
                disabled={isGenerating}
                style={({ pressed }) => [
                  styles.adminActionButton,
                  { opacity: pressed || isGenerating ? 0.7 : 1 },
                ]}
              >
                <LinearGradient
                  colors={[JazzCashColors.accent, "#FFB300"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.adminActionGradient}
                >
                  <Feather name="plus" size={16} color="#1A1A1A" />
                  <ThemedText style={[styles.adminActionText, { color: "#1A1A1A" }]}>10 Codes</ThemedText>
                </LinearGradient>
              </Pressable>
            </View>

            {unusedCodes.length > 0 ? (
              <>
                <ThemedText style={styles.codesListTitle}>Available Codes - Share with customers:</ThemedText>
                {unusedCodes.map((code) => (
                  <View key={code.code} style={styles.codeItem}>
                    <View style={styles.codeTextContainer}>
                      <ThemedText style={styles.codeText}>{code.code}</ThemedText>
                      <ThemedText style={styles.codeDate}>
                        Created: {new Date(code.createdAt).toLocaleDateString()}
                      </ThemedText>
                    </View>
                    <Pressable
                      onPress={() => handleShareCode(code.code)}
                      style={({ pressed }) => [
                        styles.shareButton,
                        { opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Feather name="share-2" size={18} color="#2E7D32" />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  onPress={handleDeleteUnusedCodes}
                  style={({ pressed }) => [
                    styles.deleteAllButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Feather name="trash-2" size={14} color="#C62828" />
                  <ThemedText style={styles.deleteAllText}>Delete All Unused</ThemedText>
                </Pressable>
              </>
            ) : (
              <View style={styles.noCodesContainer}>
                <Feather name="alert-circle" size={24} color="#999" />
                <ThemedText style={styles.noCodesText}>
                  Koi code nahi hai. Naye codes generate karein.
                </ThemedText>
              </View>
            )}

            <Pressable
              onPress={() => setIsAdminUnlocked(false)}
              style={({ pressed }) => [
                styles.lockAdminButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="lock" size={14} color="#7B1FA2" />
              <ThemedText style={styles.lockAdminText}>Lock Admin Panel</ThemedText>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: "#1565C0" }]}>
            <Feather name="info" size={14} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>About - معلومات</ThemedText>
        </View>
        <LinearGradient
          colors={isDark ? ["#7F0000", "#B71C1C"] : ["#FFEBEE", "#FFCDD2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aboutCard}
        >
          <View style={[styles.appIconContainer, { backgroundColor: isDark ? "rgba(255,255,255,0.2)" : JazzCashColors.primary }]}>
            <Feather name="trending-up" size={28} color="#FFFFFF" />
          </View>
          <ThemedText style={[styles.appName, { color: isDark ? "#FFFFFF" : JazzCashColors.primary }]}>
            Scrap Rate Tracker
          </ThemedText>
          <ThemedText style={[styles.appVersion, { color: isDark ? "rgba(255,255,255,0.8)" : "#C62828" }]}>
            Version 1.0.0
          </ThemedText>
          <ThemedText style={[styles.appDescription, { color: isDark ? "rgba(255,255,255,0.9)" : "#B71C1C" }]}>
            Pakistani scrap dealers ke liye daily rates manage karna ab aasan hai.
          </ThemedText>
        </LinearGradient>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  profileGradient: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  nameInput: {
    width: "100%",
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  profileSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  subscriptionCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  subscriptionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  subscriptionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionDetails: {
    flex: 1,
  },
  subscriptionStatus: {
    fontSize: 16,
    fontWeight: "700",
  },
  subscriptionDays: {
    fontSize: 14,
    marginTop: 2,
  },
  subscriptionExpiry: {
    fontSize: 12,
    marginTop: 2,
  },
  renewButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  renewGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  renewText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionsCard: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  optionLabel: {
    fontSize: 15,
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  supportButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  supportGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  supportNumber: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
  },
  aboutCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  appIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  appDescription: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  adminLoginCard: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  adminLoginHint: {
    fontSize: 13,
    color: "#666",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  adminLoginRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  adminPasswordInput: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
  },
  adminLoginButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  adminLoginButtonGradient: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  adminPanel: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  adminStatsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  adminStatCard: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  adminStatNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  adminStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  adminButtonsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  adminActionButton: {
    flex: 1,
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  adminActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  adminActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  codesListTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: Spacing.sm,
  },
  codeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  codeTextContainer: {
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  codeDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  shareButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 18,
  },
  deleteAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  deleteAllText: {
    fontSize: 13,
    color: "#C62828",
  },
  noCodesContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  noCodesText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
  lockAdminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  lockAdminText: {
    fontSize: 13,
    color: "#7B1FA2",
  },
  rateManagementButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  rateManagementGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  rateManagementText: {
    flex: 1,
  },
  rateManagementTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  rateManagementSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
});
