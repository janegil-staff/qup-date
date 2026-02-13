import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import GlassBackground from "../components/GlassBackground";
import SafeBottomView from "../components/SafeBottomView";
import MatchCongrats from "../components/MatchCongrats";
import VerifiedBadge from "../components/VerifiedBadge";
import { getAgeFromDate } from "../utils/getAgeFromDate";
import theme from "../theme";

const { width } = Dimensions.get("window");

const INDUSTRIES = [
  "", "Technology", "Finance", "Healthcare", "Education", "Marketing",
  "Sales", "Engineering", "Law", "Consulting", "Real Estate", "Media",
];

const EDUCATION_LEVELS = [
  "", "High School", "Bachelor's Degree", "Master's Degree",
  "MBA", "PhD", "Professional Degree",
];

const LOOKING_FOR_OPTIONS = [
  "", "Relationship", "Casual", "Friendship", "Marriage", "Not sure yet",
];

export default function DiscoverScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const [filters, setFilters] = useState({ industry: "", education: "", lookingFor: "" });
  const [tempFilters, setTempFilters] = useState({ industry: "", education: "", lookingFor: "" });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(null);

  const activeFilterCount = [filters.industry, filters.education, filters.lookingFor].filter(Boolean).length;

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const fetchUsers = async (reset = false, activeFilters = filters) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const params = new URLSearchParams();
      if (!reset && cursor) params.append("cursor", cursor);
      if (activeFilters.industry) params.append("industry", activeFilters.industry);
      if (activeFilters.education) params.append("education", activeFilters.education);
      if (activeFilters.lookingFor) params.append("lookingFor", activeFilters.lookingFor);

      const url = `https://qup.dating/api/mobile/discover${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");

      if (reset) { setUsers(data.users); } else {
        setUsers((prev) => {
          const map = new Map([...prev, ...data.users].map((u) => [u._id, u]));
          return Array.from(map.values());
        });
      }
      setCursor(data.nextCursor);
      setHasMore(data.users.length === 20);
    } catch (err) {
      console.error("Fetch users error:", err);
      setHasMore(false);
    } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { setCursor(null); setHasMore(true); fetchUsers(true); }, [filters]));
  useEffect(() => { fetchUsers(true); }, []);

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilterModal(false);
    setCursor(null); setHasMore(true);
    fetchUsers(true, tempFilters);
  };

  const clearFilters = () => {
    const empty = { industry: "", education: "", lookingFor: "" };
    setTempFilters(empty); setFilters(empty); setShowFilterModal(false);
    setCursor(null); setHasMore(true); fetchUsers(true, empty);
  };

  const removeFilter = (key) => {
    const updated = { ...filters, [key]: "" };
    setFilters(updated); setCursor(null); setHasMore(true); fetchUsers(true, updated);
  };

  const handleLike = async (id) => {
    const token = await SecureStore.getItemAsync("authToken");
    setUsers((prev) => prev.filter((u) => u._id !== id));
    const res = await fetch("https://qup.dating/api/mobile/like", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: id }),
    });
    const data = await res.json();
    if (data.match === true) setShowCongrats(true);
  };

  const handleDislike = async (id) => {
    const token = await SecureStore.getItemAsync("authToken");
    setUsers((prev) => prev.filter((u) => u._id !== id));
    await fetch("https://qup.dating/api/mobile/dislike", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: id }),
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("UserProfile", { userId: item._id })} activeOpacity={0.9}>
      <View style={styles.card}>
        <LinearGradient colors={theme.gradients.glass} style={styles.cardGradient}>
          {item.isVerified && <View style={styles.verifiedBadge}><VerifiedBadge /></View>}
          {item.linkedin?.isVerified && (
            <View style={styles.linkedinBadge}>
              <FontAwesome name="linkedin-square" size={14} color="#fff" />
              <Text style={styles.linkedinText}>LinkedIn</Text>
            </View>
          )}

          <View style={styles.imageContainer}>
            <Image source={{ uri: item.profileImage || "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png" }} style={styles.image} />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.imageOverlay}>
              <View>
                <Text style={styles.imageName}>{item.name}, {getAgeFromDate(item.birthdate)}</Text>
                {item.location?.name && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.locationText}>{item.location.name.split(",")[0]}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          {(item.occupation || item.company) && (
            <View style={styles.chipRow}>
              {item.occupation && (
                <View style={styles.chip}>
                  <Ionicons name="briefcase-outline" size={12} color={theme.colors.primary} />
                  <Text style={styles.chipText}>{item.occupation}</Text>
                </View>
              )}
              {item.company && (
                <View style={styles.chip}>
                  <Ionicons name="business-outline" size={12} color={theme.colors.primary} />
                  <Text style={styles.chipText}>{item.company}</Text>
                </View>
              )}
            </View>
          )}

          {item.bio && <View style={styles.bioContainer}><Text style={styles.bio} numberOfLines={2}>{item.bio}</Text></View>}

          {!item.isMatch && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); handleDislike(item._id); }} activeOpacity={0.8}>
                <LinearGradient colors={["#ff4444", "#cc0000"]} style={styles.actionGradient}>
                  <Ionicons name="close" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={(e) => { e.stopPropagation(); handleLike(item._id); }} activeOpacity={0.8}>
                <LinearGradient colors={theme.gradients.primary} style={styles.actionGradient}>
                  <Ionicons name="heart" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Discover 🔍</Text>
          <Text style={styles.headerSubtitle}>{users.length} profiles available</Text>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => { setTempFilters({ ...filters }); setShowFilterModal(true); }} activeOpacity={0.8}>
          <LinearGradient colors={activeFilterCount > 0 ? theme.gradients.primary : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]} style={styles.filterGradient}>
            <Ionicons name="options" size={20} color={activeFilterCount > 0 ? "#fff" : theme.colors.textMuted} />
            {activeFilterCount > 0 && <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeFilterCount}</Text></View>}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {activeFilterCount > 0 && (
        <View style={styles.activeFilters}>
          {filters.industry ? <ActiveChip icon="globe-outline" label={filters.industry} onRemove={() => removeFilter("industry")} /> : null}
          {filters.education ? <ActiveChip icon="school-outline" label={filters.education} onRemove={() => removeFilter("education")} /> : null}
          {filters.lookingFor ? <ActiveChip icon="heart-outline" label={capitalize(filters.lookingFor)} onRemove={() => removeFilter("lookingFor")} /> : null}
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View>
      {loading && <View style={styles.footer}><ActivityIndicator size="large" color={theme.colors.primary} /><Text style={styles.loadingText}>Loading more...</Text></View>}
      <SafeBottomView />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <LinearGradient colors={theme.gradients.glass} style={styles.emptyGradient}>
          <Text style={styles.emptyIcon}>{activeFilterCount > 0 ? "🔍" : "🎯"}</Text>
          <Text style={styles.emptyTitle}>{activeFilterCount > 0 ? "No Matches Found" : "No More Profiles"}</Text>
          <Text style={styles.emptyText}>{activeFilterCount > 0 ? "Try adjusting your filters" : "You've seen all available profiles!"}</Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters} activeOpacity={0.8}>
              <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <GlassBackground>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <FlatList data={users} renderItem={renderItem} keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader} ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmpty : null}
          onEndReached={() => fetchUsers()} onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} />
        {showCongrats && <MatchCongrats onClose={() => setShowCongrats(false)} />}
      </View>

      {/* FILTER MODAL */}
      <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHandle} />
            <View style={styles.filterHeader}><Text style={styles.filterTitle}>Filter Profiles</Text><TouchableOpacity onPress={() => setShowFilterModal(false)}><Ionicons name="close-circle" size={28} color="#555" /></TouchableOpacity></View>

            <FilterDropdown label="🌐 Industry" value={tempFilters.industry} placeholder="Any Industry" onPress={() => setShowPickerModal("industry")} />
            <FilterDropdown label="🎓 Education" value={tempFilters.education} placeholder="Any Education" onPress={() => setShowPickerModal("education")} />
            <FilterDropdown label="💕 Looking For" value={tempFilters.lookingFor ? capitalize(tempFilters.lookingFor) : ""} placeholder="Any" onPress={() => setShowPickerModal("lookingFor")} />

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters} activeOpacity={0.8}><Text style={styles.clearBtnText}>Clear All</Text></TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters} activeOpacity={0.8}>
                <LinearGradient colors={theme.gradients.primary} style={styles.applyGradient}><Text style={styles.applyBtnText}>Apply Filters</Text></LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PICKER MODAL */}
      <Modal visible={showPickerModal !== null} transparent animationType="slide" onRequestClose={() => setShowPickerModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <View style={styles.modalHandle} />
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{showPickerModal === "industry" ? "Select Industry" : showPickerModal === "education" ? "Select Education" : "Looking For"}</Text>
              <TouchableOpacity onPress={() => setShowPickerModal(null)}><Ionicons name="close-circle" size={28} color="#555" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {(showPickerModal === "industry" ? INDUSTRIES : showPickerModal === "education" ? EDUCATION_LEVELS : LOOKING_FOR_OPTIONS).map((item) => {
                const isSelected = tempFilters[showPickerModal]?.toLowerCase() === item.toLowerCase();
                const isAny = item === "";
                return (
                  <TouchableOpacity key={item || "any"} style={[styles.pickerOption, isSelected && styles.pickerOptionActive]}
                    onPress={() => { setTempFilters((p) => ({ ...p, [showPickerModal]: item })); setShowPickerModal(null); }} activeOpacity={0.7}>
                    <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive, isAny && { fontStyle: "italic" }]}>{isAny ? "Any (no filter)" : item}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
       <SafeBottomView />
    </GlassBackground>
  );
}

function ActiveChip({ icon, label, onRemove }) {
  return (
    <View style={styles.activeChip}>
      <Ionicons name={icon} size={12} color={theme.colors.primary} />
      <Text style={styles.activeChipText}>{label}</Text>
      <TouchableOpacity onPress={onRemove}><Ionicons name="close-circle" size={16} color={theme.colors.textMuted} /></TouchableOpacity>
    </View>
  );
}

function FilterDropdown({ label, value, placeholder, onPress }) {
  return (
    <View style={styles.filterField}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdownContainer} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]} style={styles.dropdownGradient}>
          <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>{value || placeholder}</Text>
          <Ionicons name="chevron-down" size={20} color="#888" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 32, fontWeight: "800", color: theme.colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: theme.colors.textMuted },
  filterButton: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.glassBorder },
  filterGradient: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  filterBadge: { position: "absolute", top: 4, right: 4, backgroundColor: "#fff", width: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center" },
  filterBadgeText: { color: theme.colors.primary, fontSize: 11, fontWeight: "800" },
  activeFilters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  activeChip: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(233,69,96,0.12)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 6, borderWidth: 1, borderColor: "rgba(233,69,96,0.25)" },
  activeChipText: { color: theme.colors.text, fontSize: 13, fontWeight: "600" },
  card: { marginBottom: 20, borderRadius: theme.borderRadius.xl, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.glassBorder, ...theme.shadows.lg },
  cardGradient: { padding: 16 },
  verifiedBadge: { position: "absolute", top: 24, right: 24, zIndex: 10 },
  linkedinBadge: { position: "absolute", top: 24, left: 24, zIndex: 10, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(10,102,194,0.9)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, gap: 5 },
  linkedinText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  imageContainer: { position: "relative", borderRadius: theme.borderRadius.lg, overflow: "hidden", marginBottom: 12 },
  image: { width: "100%", height: 400, backgroundColor: theme.colors.backgroundDark },
  imageOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 120, justifyContent: "flex-end", padding: 16 },
  imageName: { color: theme.colors.text, fontSize: 24, fontWeight: "800", marginBottom: 4, textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "500" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(233,69,96,0.1)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, gap: 5, borderWidth: 1, borderColor: "rgba(233,69,96,0.2)" },
  chipText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600" },
  bioContainer: { marginBottom: 16 },
  bio: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 22 },
  actions: { flexDirection: "row", justifyContent: "center", gap: 20 },
  actionButton: { borderRadius: 35, overflow: "hidden", ...theme.shadows.md },
  likeButton: { ...theme.shadows.glow },
  actionGradient: { width: 70, height: 70, justifyContent: "center", alignItems: "center" },
  footer: { paddingVertical: 24, alignItems: "center" },
  loadingText: { color: theme.colors.textMuted, marginTop: 12, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyCard: { borderRadius: theme.borderRadius.xl, overflow: "hidden", borderWidth: 1, borderColor: theme.colors.glassBorder, maxWidth: 300 },
  emptyGradient: { padding: 32, alignItems: "center" },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text, marginBottom: 8 },
  emptyText: { fontSize: 16, color: theme.colors.textSecondary, textAlign: "center", marginBottom: 4 },
  clearFiltersBtn: { marginTop: 16, backgroundColor: "rgba(233,69,96,0.15)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  clearFiltersBtnText: { color: theme.colors.primary, fontWeight: "700", fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modalHandle: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  filterModal: { backgroundColor: "#1a1a2e", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  filterHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  filterTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },
  filterField: { marginBottom: 20 },
  filterLabel: { color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: "600", marginBottom: 8 },
  dropdownContainer: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  dropdownGradient: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16 },
  dropdownText: { color: "#fff", fontSize: 16, flex: 1 },
  dropdownPlaceholder: { color: "#555" },
  filterActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  clearBtn: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", paddingVertical: 16, alignItems: "center" },
  clearBtnText: { color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 16 },
  applyBtn: { flex: 1, borderRadius: 12, overflow: "hidden" },
  applyGradient: { paddingVertical: 16, alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  pickerModal: { backgroundColor: "#1a1a2e", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "70%" },
  pickerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  pickerTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  pickerOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  pickerOptionActive: { backgroundColor: "rgba(233,69,96,0.08)", marginHorizontal: -4, paddingHorizontal: 8, borderRadius: 8 },
  pickerOptionText: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
  pickerOptionTextActive: { color: theme.colors.primary, fontWeight: "600" },
});
