// ============================================================
// HISTORY SCREEN  (src/app/history.tsx)
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ClaimedCard from "../components/cards/ClaimedCard";
import PaidCard from "../components/cards/PaidCard";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";
import { colors, radius, shadow, spacing } from "../constants/theme";
import {
  getUnclaimedList,
  getUnpaidList,
  saveUnclaimedList,
  saveUnpaidList,
} from "../services/storage";
import { UnclaimedLaundry, UnpaidLaundry } from "../types";

type ActiveTab = "paid" | "claimed";

// The three cutoff options the user can choose from
const MONTH_OPTIONS = [
  { label: "1 Month", months: 1 },
  { label: "2 Months", months: 2 },
  { label: "3 Months", months: 3 },
];

// Returns true if the given ISO date string is older than `months` months ago
function isOlderThan(isoDate: string, months: number): boolean {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months); // e.g. today minus 1 month
  return new Date(isoDate).getTime() < cutoff.getTime();
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("paid");
  const [paidList, setPaidList] = useState<UnpaidLaundry[]>([]);
  const [claimedList, setClaimedList] = useState<UnclaimedLaundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Cleanup modal state
  const [cleanupVisible, setCleanupVisible] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [cleaning, setCleaning] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => setSearch("");
    }, []),
  );

  async function loadData() {
    setLoading(true);

    const allUnpaid = await getUnpaidList();
    const paid = allUnpaid
      .filter((i) => i.status === "PAID" && i.paidDate)
      .sort(
        (a, b) =>
          new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime(),
      );

    const allUnclaimed = await getUnclaimedList();
    const claimed = allUnclaimed
      .filter((i) => i.status === "CLAIMED" && i.claimedDate)
      .sort(
        (a, b) =>
          new Date(b.claimedDate!).getTime() -
          new Date(a.claimedDate!).getTime(),
      );

    setPaidList(paid);
    setClaimedList(claimed);
    setLoading(false);
  }

  // ── Cleanup logic ──────────────────────────────────────────

  // Count how many entries WOULD be deleted for the selected month option
  function countToDelete(months: number): {
    paid: number;
    claimed: number;
    total: number;
  } {
    const paidCount = paidList.filter((i) =>
      isOlderThan(i.paidDate!, months),
    ).length;
    const claimedCount = claimedList.filter((i) =>
      isOlderThan(i.claimedDate!, months),
    ).length;
    return {
      paid: paidCount,
      claimed: claimedCount,
      total: paidCount + claimedCount,
    };
  }

  // Called when user confirms deletion
  async function handleCleanup() {
    if (!selectedMonths) return;

    const { total } = countToDelete(selectedMonths);
    if (total === 0) {
      Alert.alert(
        "Nothing to delete",
        `No entries older than ${selectedMonths} month${selectedMonths > 1 ? "s" : ""} found.`,
      );
      setCleanupVisible(false);
      return;
    }

    // Final confirmation before actually deleting
    Alert.alert(
      "Confirm Deletion",
      `This will permanently delete ${total} entr${total === 1 ? "y" : "ies"} older than ${selectedMonths} month${selectedMonths > 1 ? "s" : ""}.\n\nThis cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Delete ${total} entries`,
          style: "destructive",
          onPress: async () => {
            setCleaning(true);
            setCleanupVisible(false);

            // Remove old paid entries from the full unpaid list
            const allUnpaid = await getUnpaidList();
            const keptUnpaid = allUnpaid.filter(
              (i) =>
                !(
                  i.status === "PAID" &&
                  i.paidDate &&
                  isOlderThan(i.paidDate, selectedMonths)
                ),
            );
            await saveUnpaidList(keptUnpaid);

            // Remove old claimed entries from the full unclaimed list
            const allUnclaimed = await getUnclaimedList();
            const keptUnclaimed = allUnclaimed.filter(
              (i) =>
                !(
                  i.status === "CLAIMED" &&
                  i.claimedDate &&
                  isOlderThan(i.claimedDate, selectedMonths)
                ),
            );
            await saveUnclaimedList(keptUnclaimed);

            await loadData(); // Refresh the screen
            setCleaning(false);
            setSelectedMonths(null);

            Alert.alert(
              "Done ✓",
              `${total} old entr${total === 1 ? "y" : "ies"} deleted successfully.`,
            );
          },
        },
      ],
    );
  }

  // ── Filtered lists ─────────────────────────────────────────
  const filteredPaid = paidList.filter((i) =>
    i.customerName.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredClaimed = claimedList.filter((i) =>
    i.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loading spinner ────────────────────────────────────────
  if (loading || cleaning) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        {cleaning && (
          <Text style={styles.cleaningText}>Cleaning up old entries…</Text>
        )}
      </View>
    );
  }

  const totalHistory = paidList.length + claimedList.length;

  // ── Render ─────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── Tab switcher ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "paid" && styles.tabBtnActive]}
          onPress={() => {
            setActiveTab("paid");
            setSearch("");
          }}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "paid" && styles.tabLabelActive,
            ]}
          >
            Paid History
          </Text>
          {paidList.length > 0 && (
            <View
              style={[
                styles.countBadge,
                activeTab === "paid" && styles.countBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  activeTab === "paid" && styles.countTextActive,
                ]}
              >
                {paidList.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "claimed" && styles.tabBtnActive,
          ]}
          onPress={() => {
            setActiveTab("claimed");
            setSearch("");
          }}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "claimed" && styles.tabLabelActive,
            ]}
          >
            Claimed History
          </Text>
          {claimedList.length > 0 && (
            <View
              style={[
                styles.countBadge,
                activeTab === "claimed" && styles.countBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  activeTab === "claimed" && styles.countTextActive,
                ]}
              >
                {claimedList.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search bar ── */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search by customer name..."
      />

      {/* ── Sort hint + Clean Up button row ── */}
      <View style={styles.metaRow}>
        <Text style={styles.sortLabel}>
          Sorted by most recent {activeTab === "paid" ? "payment" : "claim"}{" "}
          first
        </Text>

        {/* Only show the button if there's any history to potentially clean */}
        {totalHistory > 0 && (
          <TouchableOpacity
            style={styles.cleanupBtn}
            onPress={() => {
              setSelectedMonths(null);
              setCleanupVisible(true);
            }}
            activeOpacity={0.75}
          >
            <Ionicons
              name="trash-outline"
              size={13}
              color={colors.dangerDark}
            />
            <Text style={styles.cleanupBtnText}>Clean Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Card list ── */}
      {activeTab === "paid" ? (
        <FlatList
          key="paid"
          data={filteredPaid}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PaidCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="cash-outline"
              title={search ? "No results found" : "No payment history yet"}
              subtitle={
                search
                  ? `No paid entries matching "${search}".`
                  : "Entries appear here after you mark them as paid."
              }
            />
          }
        />
      ) : (
        <FlatList
          key="claimed"
          data={filteredClaimed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ClaimedCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="shirt-outline"
              title={search ? "No results found" : "No claim history yet"}
              subtitle={
                search
                  ? `No claimed entries matching "${search}".`
                  : "Entries appear here after you mark them as claimed."
              }
            />
          }
        />
      )}

      {/* ════════════════════════════════════════════════════
          CLEAN UP MODAL
          ════════════════════════════════════════════════════ */}
      <Modal
        visible={cleanupVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCleanupVisible(false)}
      >
        {/* Dim overlay */}
        <TouchableWithoutFeedback onPress={() => setCleanupVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.dangerDark}
              />
              <Text style={styles.sheetTitle}>Clean Up Old History</Text>
            </View>
            <TouchableOpacity
              onPress={() => setCleanupVisible(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Explanation */}
            <Text style={styles.sheetDesc}>
              Select how far back to delete. Entries older than the chosen
              period will be permanently removed from history.
            </Text>

            {/* Current history summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{paidList.length}</Text>
                <Text style={styles.summaryLabel}>Paid entries</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{claimedList.length}</Text>
                <Text style={styles.summaryLabel}>Claimed entries</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{totalHistory}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>

            {/* Month option selector */}
            <Text style={styles.sectionLabel}>Delete entries older than:</Text>

            {MONTH_OPTIONS.map((option) => {
              const isSelected = selectedMonths === option.months;
              const counts = countToDelete(option.months);

              return (
                <TouchableOpacity
                  key={option.months}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedMonths(option.months)}
                  activeOpacity={0.72}
                >
                  {/* Left: radio circle + label */}
                  <View style={styles.optionLeft}>
                    <View
                      style={[styles.radio, isSelected && styles.radioSelected]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label} old
                      </Text>
                      <Text style={styles.optionSub}>
                        Keeps entries from the last {option.months} month
                        {option.months > 1 ? "s" : ""}
                      </Text>
                    </View>
                  </View>

                  {/* Right: how many will be deleted */}
                  <View
                    style={[
                      styles.deletePill,
                      counts.total === 0 && styles.deletePillEmpty,
                    ]}
                  >
                    <Text
                      style={[
                        styles.deletePillText,
                        counts.total === 0 && styles.deletePillTextEmpty,
                      ]}
                    >
                      {counts.total === 0
                        ? "None"
                        : `–${counts.total} entr${counts.total === 1 ? "y" : "ies"}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Breakdown of selected option */}
            {selectedMonths !== null &&
              (() => {
                const counts = countToDelete(selectedMonths);
                return counts.total > 0 ? (
                  <View style={styles.breakdownBox}>
                    <Ionicons
                      name="information-circle-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.breakdownText}>
                      This will delete{" "}
                      <Text style={styles.breakdownBold}>
                        {counts.paid} paid
                      </Text>{" "}
                      and{" "}
                      <Text style={styles.breakdownBold}>
                        {counts.claimed} claimed
                      </Text>{" "}
                      entries older than {selectedMonths} month
                      {selectedMonths > 1 ? "s" : ""}.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.breakdownBox,
                      { backgroundColor: colors.secondaryLight },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={15}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.breakdownText,
                        { color: colors.secondaryDark },
                      ]}
                    >
                      No entries older than {selectedMonths} month
                      {selectedMonths > 1 ? "s" : ""} found. Nothing to delete.
                    </Text>
                  </View>
                );
              })()}

            {/* Action buttons */}
            <TouchableOpacity
              style={[
                styles.deleteBtn,
                (!selectedMonths ||
                  countToDelete(selectedMonths).total === 0) &&
                  styles.deleteBtnDisabled,
              ]}
              onPress={handleCleanup}
              disabled={
                !selectedMonths || countToDelete(selectedMonths).total === 0
              }
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={17} color={colors.white} />
              <Text style={styles.deleteBtnText}>
                {selectedMonths
                  ? countToDelete(selectedMonths).total > 0
                    ? `Delete ${countToDelete(selectedMonths).total} old entr${countToDelete(selectedMonths).total === 1 ? "y" : "ies"}`
                    : "Nothing to delete"
                  : "Select a time period above"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setCleanupVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  cleaningText: { marginTop: 12, fontSize: 14, color: colors.textMuted },

  // Tab switcher
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: radius.md,
    padding: 4,
    ...shadow.card,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.sm,
    gap: 6,
  },
  tabBtnActive: { backgroundColor: colors.primary },
  tabLabel: { fontSize: 13.5, fontWeight: "600", color: colors.textMuted },
  tabLabelActive: { color: colors.white, fontWeight: "700" },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  countText: { fontSize: 11, fontWeight: "700", color: colors.textMuted },
  countTextActive: { color: colors.white },

  // Meta row
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  sortLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontStyle: "italic",
    flex: 1,
  },

  // Clean Up button (small, in the meta row)
  cleanupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  cleanupBtnText: { fontSize: 12, fontWeight: "700", color: colors.dangerDark },

  listContent: { paddingTop: 6, paddingBottom: 40, flexGrow: 1 },

  // ── Modal / Sheet ──
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    maxHeight: "90%",
    ...shadow.modal,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sheetTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  sheetDesc: {
    fontSize: 13.5,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Summary box
  summaryBox: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryNumber: { fontSize: 22, fontWeight: "800", color: colors.primary },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  // Section label
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 10,
  },

  // Option cards
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionLabel: { fontSize: 14, fontWeight: "600", color: colors.text },
  optionLabelSelected: { color: colors.primaryDark },
  optionSub: { fontSize: 11.5, color: colors.textMuted, marginTop: 2 },

  // Delete count pill (right side of each option)
  deletePill: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginLeft: 8,
  },
  deletePillEmpty: { backgroundColor: colors.border },
  deletePillText: { fontSize: 12, fontWeight: "700", color: colors.dangerDark },
  deletePillTextEmpty: { color: colors.textMuted },

  // Breakdown info box
  breakdownBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 18,
    marginTop: 4,
  },
  breakdownText: {
    fontSize: 13,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 19,
  },
  breakdownBold: { fontWeight: "700" },

  // Delete button
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: 15,
    marginBottom: spacing.sm,
  },
  deleteBtnDisabled: { backgroundColor: colors.border },
  deleteBtnText: { color: colors.white, fontWeight: "700", fontSize: 15 },

  // Cancel button
  cancelBtn: { paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { fontSize: 15, color: colors.textMuted, fontWeight: "600" },
});
