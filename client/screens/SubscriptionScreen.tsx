import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert, Linking, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, JazzCashColors } from "@/constants/theme";
import {
  getSubscription,
  activateSubscription,
  isSubscriptionActive,
  PAYMENT_INFO,
  getDaysRemaining,
  formatExpiryDate,
  SubscriptionData,
} from "@/lib/subscription";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadSubscription = useCallback(async () => {
    const sub = await getSubscription();
    setSubscription(sub);
    const active = await isSubscriptionActive();
    setIsActive(active);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSubscription();
    }, [loadSubscription])
  );

  const handleActivate = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Apna phone number daalein jis se payment kiya hai");
      return;
    }
    if (!transactionId.trim()) {
      Alert.alert("Error", "Transaction ID daalein jo payment ke baad mili thi");
      return;
    }
    if (!activationCode.trim()) {
      Alert.alert("Error", "Activation code daalein jo admin ne diya hai");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await activateSubscription(phoneNumber, transactionId, activationCode);

    setIsLoading(false);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await loadSubscription();
      Alert.alert("Success", result.message);
      navigation.navigate("Main");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", result.message);
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Assalam-o-Alaikum! Main Scrap Rate Tracker app ke liye subscription lena chahta/chahti hoon. Mera phone number: ${phoneNumber || "[apna number]"}`
    );
    Linking.openURL(`https://wa.me/92${PAYMENT_INFO.accountNumber.replace(/-/g, "").substring(1)}?text=${message}`);
  };

  const handleContinue = () => {
    navigation.navigate("Main");
  };

  const daysRemaining = subscription ? getDaysRemaining(subscription.expiresAt) : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={JazzCashColors.primary} />
        </Pressable>

        <LinearGradient
          colors={isDark ? ["#7F0000", "#B71C1C"] : ["#B71C1C", "#C62828"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerIcon}>
            <Feather name="lock" size={32} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.headerTitle}>Monthly Subscription</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Mahana Fees - ماہانہ فیس</ThemedText>
          
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceValue}>Rs {PAYMENT_INFO.monthlyFee}</ThemedText>
            <ThemedText style={styles.pricePeriod}>/month</ThemedText>
          </View>
        </LinearGradient>

        {isActive ? (
          <View style={[styles.statusCard, { backgroundColor: "#E8F5E9" }]}>
            <View style={[styles.statusIcon, { backgroundColor: "#2E7D32" }]}>
              <Feather name="check-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.statusInfo}>
              <ThemedText style={[styles.statusTitle, { color: "#1B5E20" }]}>
                Subscription Active
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: "#2E7D32" }]}>
                {daysRemaining} din baqi hain
              </ThemedText>
              <ThemedText style={[styles.statusExpiry, { color: "#388E3C" }]}>
                Expire: {formatExpiryDate(subscription?.expiresAt || null)}
              </ThemedText>
            </View>
          </View>
        ) : (
          <View style={[styles.statusCard, { backgroundColor: "#FFEBEE" }]}>
            <View style={[styles.statusIcon, { backgroundColor: JazzCashColors.primary }]}>
              <Feather name="alert-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.statusInfo}>
              <ThemedText style={[styles.statusTitle, { color: "#B71C1C" }]}>
                Subscription Required
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: "#C62828" }]}>
                Rates dekhne ke liye subscription lein
              </ThemedText>
            </View>
          </View>
        )}

        <View style={styles.paymentSection}>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
            Payment Details - ادائیگی
          </ThemedText>
          
          <View style={[styles.paymentCard, { backgroundColor: isDark ? theme.backgroundDefault : "#FFFFFF" }]}>
            <View style={styles.paymentRow}>
              <View style={[styles.paymentIcon, { backgroundColor: "#E8F5E9" }]}>
                <Feather name="smartphone" size={18} color="#2E7D32" />
              </View>
              <View style={styles.paymentInfo}>
                <ThemedText style={[styles.paymentLabel, { color: theme.textSecondary }]}>
                  Account Number
                </ThemedText>
                <ThemedText style={styles.paymentValue}>
                  {PAYMENT_INFO.accountNumber}
                </ThemedText>
              </View>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.paymentRow}>
              <View style={[styles.paymentIcon, { backgroundColor: "#FFF8E1" }]}>
                <Feather name="user" size={18} color="#E65100" />
              </View>
              <View style={styles.paymentInfo}>
                <ThemedText style={[styles.paymentLabel, { color: theme.textSecondary }]}>
                  Account Name
                </ThemedText>
                <ThemedText style={styles.paymentValue}>
                  {PAYMENT_INFO.accountName}
                </ThemedText>
              </View>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.paymentRow}>
              <View style={[styles.paymentIcon, { backgroundColor: "#E3F2FD" }]}>
                <Feather name="credit-card" size={18} color="#1565C0" />
              </View>
              <View style={styles.paymentInfo}>
                <ThemedText style={[styles.paymentLabel, { color: theme.textSecondary }]}>
                  Payment Methods
                </ThemedText>
                <ThemedText style={styles.paymentValue}>
                  {PAYMENT_INFO.methods.join(" / ")}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.stepsSection}>
          <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
            Payment Steps - اقدامات
          </ThemedText>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: JazzCashColors.accent }]}>
                <ThemedText style={styles.stepNumberText}>1</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                JazzCash ya EasyPaisa se Rs {PAYMENT_INFO.monthlyFee} bhejein
              </ThemedText>
            </View>
            
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: JazzCashColors.accent }]}>
                <ThemedText style={styles.stepNumberText}>2</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                WhatsApp par payment screenshot bhejein
              </ThemedText>
            </View>
            
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: JazzCashColors.accent }]}>
                <ThemedText style={styles.stepNumberText}>3</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                Admin se activation code hasil karein
              </ThemedText>
            </View>
            
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: JazzCashColors.accent }]}>
                <ThemedText style={styles.stepNumberText}>4</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>
                Neeche code daal kar activate karein
              </ThemedText>
            </View>
          </View>
        </View>

        <Pressable onPress={handleWhatsAppContact} style={styles.whatsappButton}>
          <LinearGradient
            colors={["#25D366", "#128C7E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.whatsappGradient}
          >
            <Feather name="message-circle" size={20} color="#FFFFFF" />
            <ThemedText style={styles.whatsappText}>WhatsApp Par Contact Karein</ThemedText>
          </LinearGradient>
        </Pressable>

        {!isActive ? (
          <View style={styles.activationSection}>
            <ThemedText style={[styles.sectionTitle, { color: JazzCashColors.primary }]}>
              Activate Subscription
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#FFFFFF",
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Apna Phone Number (0300-1234567)"
                placeholderTextColor={theme.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                testID="input-phone"
              />
              
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#FFFFFF",
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Transaction ID (payment ke baad mili)"
                placeholderTextColor={theme.textSecondary}
                value={transactionId}
                onChangeText={setTransactionId}
                testID="input-transaction"
              />
              
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? theme.backgroundSecondary : "#FFFFFF",
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Activation Code (Admin se lein)"
                placeholderTextColor={theme.textSecondary}
                value={activationCode}
                onChangeText={setActivationCode}
                autoCapitalize="characters"
                testID="input-activation-code"
              />
            </View>

            <Pressable
              onPress={handleActivate}
              disabled={isLoading}
              testID="button-activate"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.activateButton,
                { opacity: pressed || isLoading ? 0.8 : 1 },
              ]}
            >
              <LinearGradient
                colors={[JazzCashColors.accent, "#FFB300"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activateGradient}
              >
                <Feather name="unlock" size={20} color="#1A1A1A" />
                <ThemedText style={styles.activateText}>
                  {isLoading ? "Activating..." : "Activate Karein"}
                </ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleContinue} style={styles.continueButton}>
            <LinearGradient
              colors={["#2E7D32", "#388E3C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <ThemedText style={styles.continueText}>Continue to App</ThemedText>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerGradient: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  priceValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  pricePeriod: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginLeft: 4,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 14,
    marginTop: 2,
  },
  statusExpiry: {
    fontSize: 12,
    marginTop: 2,
  },
  paymentSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  paymentCard: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 12,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
  stepsSection: {
    marginBottom: Spacing.lg,
  },
  stepsContainer: {
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  whatsappButton: {
    marginBottom: Spacing.lg,
  },
  whatsappGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  whatsappText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  activationSection: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
  },
  activateButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
  },
  activateGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  activateText: {
    color: "#1A1A1A",
    fontSize: 17,
    fontWeight: "700",
  },
  continueButton: {
    overflow: "hidden",
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  continueGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
