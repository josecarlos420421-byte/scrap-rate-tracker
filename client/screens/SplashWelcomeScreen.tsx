import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { JazzCashColors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SplashWelcome">;

export default function SplashWelcomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ImportantNotes");
  };

  return (
    <LinearGradient
      colors={["#7F0000", "#B71C1C", "#C62828", "#D32F2F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + Spacing["3xl"] }]}>
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.glowRing}>
            <View style={styles.logoCircle}>
              <Feather name="trending-up" size={60} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedText style={styles.urduGreeting}>السلام علیکم</ThemedText>
          <ThemedText style={styles.greeting}>Assalam-o-Alaikum!</ThemedText>
          
          <View style={styles.divider} />
          
          <ThemedText style={styles.welcomeTitle}>
            Khush Aamdeed
          </ThemedText>
          <ThemedText style={styles.urduWelcome}>خوش آمدید</ThemedText>
          
          <ThemedText style={styles.appName}>Scrap Rate Tracker</ThemedText>
          
          <View style={styles.messageBox}>
            <View style={styles.messageIcon}>
              <Feather name="star" size={20} color={JazzCashColors.accent} />
            </View>
            <ThemedText style={styles.messageText}>
              Pakistan ka number 1 scrap rate tracking app!{"\n"}
              Ab daily rates update karna bilkul aasan hai.
            </ThemedText>
          </View>

          <View style={styles.featuresRow}>
            <View style={styles.featurePill}>
              <Feather name="check" size={14} color="#2E7D32" />
              <ThemedText style={styles.featurePillText}>Trusted</ThemedText>
            </View>
            <View style={styles.featurePill}>
              <Feather name="zap" size={14} color="#E65100" />
              <ThemedText style={styles.featurePillText}>Fast</ThemedText>
            </View>
            <View style={styles.featurePill}>
              <Feather name="shield" size={14} color="#1565C0" />
              <ThemedText style={styles.featurePillText}>Secure</ThemedText>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient
            colors={[JazzCashColors.accent, "#FFB300", "#FFA000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <ThemedText style={styles.buttonText}>Aagay Barho</ThemedText>
              <View style={styles.buttonArrow}>
                <Feather name="arrow-right" size={22} color={JazzCashColors.accent} />
              </View>
            </Pressable>
          </LinearGradient>
          
          <ThemedText style={styles.footerText}>
            Powered by Fatima Bibi Enterprises
          </ThemedText>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logoSection: {
    marginBottom: Spacing["2xl"],
  },
  glowRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 193, 7, 0.4)",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  textSection: {
    alignItems: "center",
    width: "100%",
  },
  urduGreeting: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: JazzCashColors.accent,
    borderRadius: 2,
    marginVertical: Spacing.lg,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  urduWelcome: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 26,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  appName: {
    color: JazzCashColors.accent,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.xl,
    letterSpacing: 1,
  },
  messageBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  messageIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  featurePillText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
  },
  buttonGradient: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  continueButton: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
