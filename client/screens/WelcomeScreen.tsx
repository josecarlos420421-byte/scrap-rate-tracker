import React from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, JazzCashColors, CategoryColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Subscription");
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={isDark ? ["#7F0000", "#B71C1C", "#C62828"] : ["#B71C1C", "#C62828", "#D32F2F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + Spacing.xl }]}
      >
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <ThemedText style={styles.welcomeText}>Welcome to</ThemedText>
          <ThemedText style={styles.brandName}>Scrap Rate Tracker</ThemedText>
          <ThemedText style={styles.urduText}>پاکستان سکریپ ڈیلر</ThemedText>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Feather name="check-circle" size={14} color="#FFFFFF" />
            <ThemedText style={styles.badgeText}>Trusted</ThemedText>
          </View>
          <View style={styles.badge}>
            <Feather name="zap" size={14} color="#FFFFFF" />
            <ThemedText style={styles.badgeText}>Fast</ThemedText>
          </View>
          <View style={styles.badge}>
            <Feather name="shield" size={14} color="#FFFFFF" />
            <ThemedText style={styles.badgeText}>Secure</ThemedText>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.featuresContainer}>
          <View style={[styles.featureRow, { backgroundColor: "#FFF8E1" }]}>
            <View style={[styles.featureIcon, { backgroundColor: JazzCashColors.accent }]}>
              <Feather name="trending-up" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.featureTextContainer}>
              <ThemedText style={[styles.featureTitle, { color: "#E65100" }]}>
                Daily Rate Updates
              </ThemedText>
              <ThemedText style={[styles.featureSubtitle, { color: "#FF8F00" }]}>
                روزانہ ریٹس اپڈیٹ
              </ThemedText>
            </View>
          </View>

          <View style={[styles.featureRow, { backgroundColor: "#FFEBEE" }]}>
            <View style={[styles.featureIcon, { backgroundColor: JazzCashColors.primary }]}>
              <Feather name="layers" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.featureTextContainer}>
              <ThemedText style={[styles.featureTitle, { color: "#B71C1C" }]}>
                13 Complete Categories
              </ThemedText>
              <ThemedText style={[styles.featureSubtitle, { color: "#C62828" }]}>
                LOHA, COPPER, ALUMINUM, BRASS...
              </ThemedText>
            </View>
          </View>

          <View style={[styles.featureRow, { backgroundColor: "#E8F5E9" }]}>
            <View style={[styles.featureIcon, { backgroundColor: "#2E7D32" }]}>
              <Feather name="clock" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.featureTextContainer}>
              <ThemedText style={[styles.featureTitle, { color: "#1B5E20" }]}>
                10 Days Rate History
              </ThemedText>
              <ThemedText style={[styles.featureSubtitle, { color: "#2E7D32" }]}>
                پچھلے 10 دن کی ہسٹری
              </ThemedText>
            </View>
          </View>

          <View style={[styles.featureRow, { backgroundColor: "#E3F2FD" }]}>
            <View style={[styles.featureIcon, { backgroundColor: "#1565C0" }]}>
              <Feather name="image" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.featureTextContainer}>
              <ThemedText style={[styles.featureTitle, { color: "#0D47A1" }]}>
                Item Images Included
              </ThemedText>
              <ThemedText style={[styles.featureSubtitle, { color: "#1565C0" }]}>
                آئٹمز کی تصویریں
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <LinearGradient
          colors={[JazzCashColors.accent, "#FFB300", "#FFA000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Pressable onPress={handleNext} style={styles.nextButton}>
            <ThemedText style={styles.buttonText}>Shuru Karein</ThemedText>
            <View style={styles.buttonArrow}>
              <Feather name="arrow-right" size={20} color={JazzCashColors.accent} />
            </View>
          </Pressable>
        </LinearGradient>
        <ThemedText style={[styles.versionText, { color: theme.textSecondary }]}>
          Version 1.0.0 - Monthly Subscription Rs 200
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 14,
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },
  brandName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  urduText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    textAlign: "center",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  featuresContainer: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  featureSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  buttonGradient: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  buttonText: {
    color: "#1A1A1A",
    fontSize: 18,
    fontWeight: "700",
  },
  buttonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
