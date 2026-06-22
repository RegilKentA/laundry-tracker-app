// ============================================================
// HISTORY SCREEN  (src/app/history.tsx)
//
// Shows all entries that have been marked as PAID or CLAIMED.
// Has its own 2-tab switcher at the top (not bottom tabs).
// Sorted by most recently paid/claimed first.
// ============================================================

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ClaimedCard from "../components/cards/ClaimedCard";
import PaidCard from "../components/cards/PaidCard";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";
import { colors, radius, shadow } from "../constants/theme";
import { getUnclaimedList, getUnpaidList } from "../services/storage";
import { UnclaimedLaundry, UnpaidLaundry } from "../types";

// Which tab is currently active
type ActiveTab = "paid" | "claimed";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("paid");
  const [paidList, setPaidList] = useState<UnpaidLaundry[]>([]);
  const [claimedList, setClaimedList] = useState<UnclaimedLaundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Reload every time this screen is navigated to
  useFocusEffect(
    useCallback(() => {
      loadData();
      // Reset search when leaving screen
      return () => setSearch("");
    }, []),
  );

  async function loadData() {
    setLoading(true);

    // Load PAID entries — sorted by paidDate newest first
    const allUnpaid = await getUnpaidList();
    const paid = allUnpaid
      .filter((item) => item.status === "PAID" && item.paidDate)
      .sort(
        (a, b) =>
          new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime(),
      );

    // Load CLAIMED entries — sorted by claimedDate newest first
    const allUnclaimed = await getUnclaimedList();
    const claimed = allUnclaimed
      .filter((item) => item.status === "CLAIMED" && item.claimedDate)
      .sort(
        (a, b) =>
          new Date(b.claimedDate!).getTime() -
          new Date(a.claimedDate!).getTime(),
      );

    setPaidList(paid);
    setClaimedList(claimed);
    setLoading(false);
  }

  // Filter current tab's list by search text
  const filteredPaid = paidList.filter((item) =>
    item.customerName.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredClaimed = claimedList.filter((item) =>
    item.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  // Loading spinner
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Custom top tab switcher ── */}
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
          {/* Count badge */}
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

      {/* ── Sort label ── */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>
          Sorted by most recent {activeTab === "paid" ? "payment" : "claim"}{" "}
          first
        </Text>
      </View>

      {/* ── List ── */}
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
                  : "Entries will appear here after you mark them as paid."
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
                  : "Entries will appear here after you mark them as claimed."
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  // ── Top tab bar ──
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
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: "700",
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  countTextActive: {
    color: colors.white,
  },

  // ── Sort hint ──
  sortRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  sortLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontStyle: "italic",
  },

  listContent: {
    paddingTop: 6,
    paddingBottom: 40,
    flexGrow: 1,
  },
});
