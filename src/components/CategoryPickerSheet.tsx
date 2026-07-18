import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../utils";
import { ServiceCategory } from "../interface/interfaces";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface CategoryVisual {
  icon: IoniconName;
  color: string;
  backgroundColor: string;
}

const CATEGORY_VISUALS: {
  keywords: string[];
  icon: IoniconName;
  color: string;
  backgroundColor: string;
}[] = [
  { keywords: ["plumb", "pipe", "water", "leak"], icon: "water-outline", color: "#0EA5E9", backgroundColor: "#E0F2FE" },
  { keywords: ["electric", "wire", "light", "power"], icon: "flash-outline", color: "#F59E0B", backgroundColor: "#FEF3C7" },
  { keywords: ["clean", "maid", "housekeep", "sanitize"], icon: "sparkles-outline", color: "#14B8A6", backgroundColor: "#CCFBF1" },
  { keywords: ["paint", "decor", "interior"], icon: "color-palette-outline", color: "#A855F7", backgroundColor: "#F3E8FF" },
  { keywords: ["carpent", "wood", "furniture"], icon: "hammer-outline", color: "#B45309", backgroundColor: "#FEF3C7" },
  { keywords: ["garden", "lawn", "landscap", "plant"], icon: "leaf-outline", color: "#16A34A", backgroundColor: "#DCFCE7" },
  { keywords: ["move", "moving", "shift", "transport"], icon: "car-outline", color: "#2563EB", backgroundColor: "#DBEAFE" },
  { keywords: ["deliver", "courier", "parcel", "package"], icon: "cube-outline", color: "#EA580C", backgroundColor: "#FFEDD5" },
  { keywords: ["appliance", "ac", "hvac", "fridge", "washer"], icon: "hardware-chip-outline", color: "#475569", backgroundColor: "#E2E8F0" },
  { keywords: ["repair", "fix", "maintenance"], icon: "build-outline", color: "#4F46E5", backgroundColor: "#E0E7FF" },
  { keywords: ["beauty", "salon", "hair", "makeup"], icon: "cut-outline", color: "#DB2777", backgroundColor: "#FCE7F3" },
  { keywords: ["teach", "tutor", "school", "class"], icon: "school-outline", color: "#7C3AED", backgroundColor: "#EDE9FE" },
  { keywords: ["pet", "dog", "cat"], icon: "paw-outline", color: "#D97706", backgroundColor: "#FEF3C7" },
  { keywords: ["health", "medical", "care", "nurse"], icon: "medkit-outline", color: "#DC2626", backgroundColor: "#FEE2E2" },
  { keywords: ["food", "cook", "chef", "cater"], icon: "fast-food-outline", color: "#F97316", backgroundColor: "#FFEDD5" },
  { keywords: ["security", "guard", "safe"], icon: "shield-checkmark-outline", color: "#0F766E", backgroundColor: "#CCFBF1" },
  { keywords: ["computer", "tech", "software", "laptop"], icon: "laptop-outline", color: "#0284C7", backgroundColor: "#E0F2FE" },
  { keywords: ["photo", "video", "camera"], icon: "camera-outline", color: "#6D28D9", backgroundColor: "#EDE9FE" },
  { keywords: ["fitness", "gym", "trainer"], icon: "barbell-outline", color: "#BE123C", backgroundColor: "#FFE4E6" },
  { keywords: ["legal", "law", "document"], icon: "document-text-outline", color: "#334155", backgroundColor: "#E2E8F0" },
  { keywords: ["account", "tax", "bookkeep"], icon: "calculator-outline", color: "#047857", backgroundColor: "#D1FAE5" },
  { keywords: ["child", "baby", "caregiver"], icon: "happy-outline", color: "#CA8A04", backgroundColor: "#FEF9C3" },
];

const FALLBACK_VISUALS: CategoryVisual[] = [
  { icon: "briefcase-outline", color: "#2563EB", backgroundColor: "#DBEAFE" },
  { icon: "construct-outline", color: "#4F46E5", backgroundColor: "#E0E7FF" },
  { icon: "home-outline", color: "#0891B2", backgroundColor: "#CFFAFE" },
  { icon: "options-outline", color: "#64748B", backgroundColor: "#E2E8F0" },
];

export const getCategoryVisual = (category?: Partial<ServiceCategory> | null): CategoryVisual => {
  const rawIcon = category?.icon?.trim();
  if (rawIcon && rawIcon in Ionicons.glyphMap) {
    return { ...FALLBACK_VISUALS[0], icon: rawIcon as IoniconName };
  }

  const haystack = `${category?.name ?? ""} ${category?.slug ?? ""} ${category?.description ?? ""}`.toLowerCase();
  const match = CATEGORY_VISUALS.find((visual) =>
    visual.keywords.some((keyword) => haystack.includes(keyword))
  );

  if (match) {
    return {
      icon: match.icon,
      color: match.color,
      backgroundColor: match.backgroundColor,
    };
  }

  const stableIndex = (category?._id ?? category?.slug ?? category?.name ?? "").length % FALLBACK_VISUALS.length;
  return FALLBACK_VISUALS[stableIndex];
};

interface CategoryPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: ServiceCategory) => void;
  categories: ServiceCategory[];
  loading?: boolean;
  error?: string | null;
  selectedId?: string | null;
  /** Pass an array of selected IDs to enable multi-select mode */
  selectedIds?: string[];
  /** When true: items don't auto-close the sheet; a Done button appears instead */
  multiSelect?: boolean;
  onRetry?: () => void;
  /** When true, shows a "Reset" action that calls onReset and clears the picker */
  showReset?: boolean;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
}

const CategoryPickerSheet: React.FC<CategoryPickerSheetProps> = ({
  visible,
  onClose,
  onSelect,
  categories,
  loading,
  error,
  selectedId,
  selectedIds,
  multiSelect = false,
  onRetry,
  showReset,
  onReset,
  title,
  subtitle,
}) => {
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Reset the search field whenever the sheet opens, for consistency.
    if (visible) setQuery("");
  }, [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description ? c.description.toLowerCase().includes(q) : false)
    );
  }, [categories, query]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
            onPress={() => {}}
          >
            <View style={styles.handle} />

            <View style={styles.headerRow}>
              <Text style={styles.title}>
                {title || "Select a service category"}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              {subtitle || "Choose what kind of help you're looking for"}
            </Text>

            {showReset ? (
              <View style={styles.resetRow}>
                <Text style={styles.resetHint}>
                  {selectedId ? "1 filter applied" : "No filter applied"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    onReset?.();
                    onClose();
                  }}
                  style={[
                    styles.resetBtn,
                    !selectedId && styles.resetBtnDisabled,
                  ]}
                  disabled={!selectedId}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="refresh"
                    size={14}
                    color={selectedId ? Colors.primary : "#A8B0C2"}
                  />
                  <Text
                    style={[
                      styles.resetText,
                      !selectedId && { color: "#A8B0C2" },
                    ]}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.searchWrap}>
              <Ionicons
                name="search"
                size={18}
                color="#8B95A6"
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search categories..."
                placeholderTextColor="#8B95A6"
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
                  <Ionicons name="close-circle" size={18} color="#8B95A6" />
                </TouchableOpacity>
              ) : null}
            </View>

            {loading ? (
              <View style={styles.stateWrap}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.stateText}>Loading categories...</Text>
              </View>
            ) : error ? (
              <View style={styles.stateWrap}>
                <Ionicons name="alert-circle-outline" size={26} color="#E35D5D" />
                <Text style={styles.stateText}>{error}</Text>
                {onRetry ? (
                  <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Try again</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : filtered.length === 0 ? (
              <View style={styles.stateWrap}>
                <Ionicons name="search-outline" size={26} color="#8B95A6" />
                <Text style={styles.stateText}>
                  {`No categories match "${query}"`}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => {
                  const selected = multiSelect
                    ? (selectedIds ?? []).includes(item._id)
                    : selectedId === item._id;
                  const categoryVisual = getCategoryVisual(item);
                  return (
                    <TouchableOpacity
                      style={[styles.row, selected && styles.rowSelected]}
                      activeOpacity={0.85}
                      onPress={() => {
                        onSelect(item);
                        if (!multiSelect) onClose();
                      }}
                    >
                      <View
                        style={[
                          styles.rowIconWrap,
                          { backgroundColor: categoryVisual.backgroundColor },
                        ]}
                      >
                        <Ionicons
                          name={categoryVisual.icon}
                          size={20}
                          color={categoryVisual.color}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowTitle}>{item.name}</Text>
                        {item.description ? (
                          <Text
                            style={styles.rowSubtitle}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons
                        name={selected ? "checkmark-circle" : "ellipse-outline"}
                        size={22}
                        color={selected ? "#12B264" : "#A8B0C2"}
                      />
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}

            {/* Done button — only in multi-select mode */}
            {multiSelect && (
              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.doneBtnText}>
                  Done{selectedIds && selectedIds.length > 0 ? ` (${selectedIds.length} selected)` : ""}
                </Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CategoryPickerSheet;

const styles = StyleSheet.create({
  kbWrap: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    // Fixed height so the sheet doesn't grow/shrink with the result count
    height: "75%",
    width: "100%",
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8DEEC",
    alignSelf: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
  },
  subtitle: {
    fontSize: 13,
    color: "#697386",
    marginTop: 2,
    marginBottom: 14,
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F7FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  resetHint: {
    fontSize: 13,
    fontWeight: "600",
    color: "#516072",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE7FF",
  },
  resetBtnDisabled: {
    backgroundColor: "#F0F2F8",
    borderColor: "#E2EAFF",
  },
  resetText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 6,
    borderWidth: 1,
    borderColor: "#E2EAFF",
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    padding: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2EAFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#EEF4FF",
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#697386",
    marginTop: 2,
  },
  stateWrap: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: "#697386",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  retryText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  doneBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
