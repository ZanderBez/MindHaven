import React from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import GlobalBackground from "../components/GlobalBackground";
import { styles } from "../styles/journalEdit";
import { useJournalEdit } from "../hooks/useJournalEdit";

const EMOJI = ["😀", "🙂", "😐", "😕", "😢", "😡", "😴", "😰", "😌", "🥳"];

type Params = { id: string | null };

export default function JournalEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const id = route.params?.id ?? null;

  const {
    isNew,
    mood,
    setMood,
    title,
    setTitle,
    body,
    setBody,
    editable,
    setEditable,
    saving,
    typing,
    setTyping,
    canSave,
    dismissIfTyping,
    onSave,
    onDelete,
  } = useJournalEdit(id);

  async function handleSave() {
    const res = await onSave();
    if (res.ok) {
      const focusId = res.id ?? id ?? undefined;
      navigation.reset({
        index: 0,
        routes: [{ name: "Journal", params: { focusId } }],
      });
    }
  }

  function confirmDelete() {
    if (isNew) return;
    Alert.alert("Delete note?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const res = await onDelete();
          if (res.ok) {
            navigation.reset({ index: 0, routes: [{ name: "Journal" }] });
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      <View pointerEvents="none" style={styles.baseOverlay} />
      {typing && <View pointerEvents="none" style={styles.typingOverlay} />}

      <SafeAreaView style={styles.safe}>
        <TouchableWithoutFeedback onPress={dismissIfTyping}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.reset({ index: 0, routes: [{ name: "Journal" }] })}
                style={styles.backBtn}
              >
                <Feather name="chevron-left" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>All Notes</Text>
              <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.body}>
              <Text style={styles.label}>Mood :</Text>
              <View style={styles.moodRow}>
                {EMOJI.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.moodBtn, mood === e && styles.moodActive]}
                    onPress={() => editable && setMood(e)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.moodText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.titleInput, typing && styles.inputFocused]}
                editable={editable}
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Write here…"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.descInput, typing && styles.inputFocused]}
                editable={editable}
                multiline
                textAlignVertical="top"
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
              />

              <View style={styles.actionsRow}>
                {!isNew && (
                  <TouchableOpacity style={styles.editBtn} onPress={() => setEditable((v) => !v)} disabled={saving}>
                    <Text style={styles.editText}>{editable ? "Cancel" : "Edit"}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.saveBtn, !canSave && { opacity: 0.7 }]}
                  onPress={handleSave}
                  disabled={!canSave}
                >
                  <Text style={styles.saveText}>{isNew ? "Save" : saving ? "Saving…" : "Save"}</Text>
                </TouchableOpacity>
              </View>

              {!isNew && (
                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete} disabled={saving}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
}
