import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, TextInput, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, JazzCashColors, CategoryColors } from "@/constants/theme";
import { formatDate } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ImportantNotes">;

const NOTES_KEY = "@important_notes";

interface DailyNote {
  id: string;
  text: string;
  date: string;
}

const DEFAULT_NOTE = `دھوئیں (smog) کے باعث کام کی رفتار کم ہے، کچھ آڑھتیں جزوی طور پر بند ہیں۔

تمام ممبران سے گزارش ہے کہ پیٹر انجن اور واٹر پمپ ٹیوب ویل والا خریداری کرتے وقت احتیاط کریں۔ کیونکہ یہ اکثر چوری کئے ھوئے ھوتے ھیں۔ جس سے بھی لیں اس کا شناختی کارڈ اور واقف کار سے لیں۔

خاص طور پر گٹروں کے ڈھکن نا لیں۔ پولیس نے اس پر سختی کی ھوئی ھے۔

عزت سے بڑھ کر کوئی چیز نہیں ہے۔`;

export default function ImportantNotesScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (data) {
        setNotes(JSON.parse(data));
      } else {
        const defaultNote: DailyNote = {
          id: Date.now().toString(),
          text: DEFAULT_NOTE,
          date: formatDate(),
        };
        setNotes([defaultNote]);
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify([defaultNote]));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const note: DailyNote = {
        id: Date.now().toString(),
        text: newNote.trim(),
        date: formatDate(),
      };
      const updatedNotes = [note, ...notes];
      setNotes(updatedNotes);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      setNewNote("");
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Welcome");
  };

  const noteColors = [
    { bg: "#FFF8E1", accent: JazzCashColors.accent, icon: "#E65100" },
    { bg: "#FFEBEE", accent: JazzCashColors.primary, icon: "#B71C1C" },
    { bg: "#E8F5E9", accent: "#2E7D32", icon: "#1B5E20" },
    { bg: "#E3F2FD", accent: "#1565C0", icon: "#0D47A1" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: Spacing["3xl"],
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
            <Feather name="alert-triangle" size={28} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.headerTitle}>Zaruri Maloomat</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Important Notes - اہم اطلاعات</ThemedText>
          
          <View style={styles.dateBox}>
            <Feather name="calendar" size={14} color={JazzCashColors.primary} />
            <ThemedText style={styles.dateText}>{formatDate()}</ThemedText>
          </View>
        </LinearGradient>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: JazzCashColors.primary,
                },
              ]}
              placeholder="نیا نوٹ لکھیں..."
              placeholderTextColor={theme.textSecondary}
              value={newNote}
              onChangeText={setNewNote}
              multiline
              textAlignVertical="top"
              testID="input-new-note"
            />
            <View style={styles.editButtons}>
              <Pressable
                onPress={() => {
                  setIsEditing(false);
                  setNewNote("");
                }}
                style={[styles.cancelButton, { borderColor: theme.border }]}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <LinearGradient
                colors={[JazzCashColors.primary, "#C62828"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Pressable onPress={handleAddNote} style={styles.saveButton}>
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>Save</ThemedText>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsEditing(true)}
            style={[
              styles.addNoteButton,
              {
                backgroundColor: "#FFF8E1",
                borderColor: JazzCashColors.accent,
              },
            ]}
          >
            <View style={[styles.addIcon, { backgroundColor: JazzCashColors.accent }]}>
              <Feather name="plus" size={20} color="#FFFFFF" />
            </View>
            <ThemedText style={{ color: "#E65100", fontWeight: "600" }}>
              Naya Note Add Karein
            </ThemedText>
          </Pressable>
        )}

        <View style={styles.notesContainer}>
          {notes.map((note, index) => {
            const colorScheme = noteColors[index % noteColors.length];
            return (
              <View
                key={note.id}
                style={[
                  styles.noteCard,
                  { backgroundColor: isDark ? theme.backgroundDefault : colorScheme.bg },
                ]}
              >
                <View style={[styles.noteColorBar, { backgroundColor: colorScheme.accent }]} />
                <View style={styles.noteContent}>
                  <View style={styles.noteHeader}>
                    <View style={[styles.noteIcon, { backgroundColor: colorScheme.accent }]}>
                      <Feather name="file-text" size={12} color="#FFFFFF" />
                    </View>
                    <ThemedText style={[styles.noteDate, { color: colorScheme.icon }]}>
                      {note.date}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.noteText}>{note.text}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <LinearGradient
          colors={[JazzCashColors.accent, "#FFB300"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.nextButtonGradient}
        >
          <Pressable onPress={handleNext} style={styles.nextButton}>
            <ThemedText style={styles.nextButtonText}>Agay Barhen</ThemedText>
            <View style={styles.buttonArrow}>
              <Feather name="arrow-right" size={18} color={JazzCashColors.accent} />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
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
    padding: Spacing.lg,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dateText: {
    color: JazzCashColors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  editContainer: {
    marginBottom: Spacing.lg,
  },
  textInput: {
    minHeight: 100,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    padding: Spacing.md,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  editButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonGradient: {
    flex: 1,
    borderRadius: BorderRadius.sm,
  },
  saveButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  addNoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: Spacing.lg,
  },
  addIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  notesContainer: {
    gap: Spacing.md,
  },
  noteCard: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    flexDirection: "row",
  },
  noteColorBar: {
    width: 4,
  },
  noteContent: {
    flex: 1,
    padding: Spacing.md,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  noteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noteDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  nextButtonGradient: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  nextButtonText: {
    color: "#1A1A1A",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
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
