// ============================================================
// UNPAID LAUNDRY SCREEN  (src/app/(tabs)/index.tsx)
//
// This is Tab 1. It shows a list of customers who haven't paid.
// Features:
//   - Load list from storage
//   - Search/filter by name
//   - Add new entry (FAB button)
//   - Edit entry (tap a card)
//   - Mark as paid (with confirmation)
//   - Delete (with confirmation)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors } from '../../constants/theme';
import { UnpaidLaundry } from '../../types';
import { getUnpaidList, saveUnpaidList } from '../../services/storage';
import { generateId } from '../../utils/id';
import { nowISO, sortByNewest } from '../../utils/date';
import UnpaidCard from '../../components/cards/UnpaidCard';
import EmptyState from '../../components/common/EmptyState';
import FAB from '../../components/common/FAB';
import SearchBar from '../../components/common/SearchBar';
import UnpaidModal from '../../components/modals/UnpaidModal';

export default function UnpaidScreen() {
  // ---- State ----
  const [list, setList] = useState<UnpaidLaundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnpaidLaundry | null>(null);

  // ---- Load data every time this screen is focused ----
  // useFocusEffect runs the code whenever the user navigates to this tab.
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    setLoading(true);
    const all = await getUnpaidList();
    // Only show items that are still UNPAID (not already paid)
    const unpaidOnly = all.filter((item) => item.status === 'UNPAID');
    setList(sortByNewest(unpaidOnly));
    setLoading(false);
  }

  // ---- Filtered list (based on search text) ----
  const filteredList = list.filter((item) =>
    item.customerName.toLowerCase().includes(search.toLowerCase())
  );

  // ---- Modal helpers ----
  function openAddModal() {
    setSelectedItem(null); // No pre-filled data = "add" mode
    setModalVisible(true);
  }

  function openEditModal(item: UnpaidLaundry) {
    setSelectedItem(item); // Pre-fill data = "edit" mode
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedItem(null);
  }

  // ---- CRUD Operations ----

  async function handleSubmit(name: string, amount: number) {
    const all = await getUnpaidList();

    if (selectedItem) {
      // EDIT: update the matching record
      const updated = all.map((i) =>
        i.id === selectedItem.id ? { ...i, customerName: name, amount } : i
      );
      await saveUnpaidList(updated);
    } else {
      // ADD: create a brand new record
      const newEntry: UnpaidLaundry = {
        id: generateId(),
        customerName: name,
        amount,
        dateCreated: nowISO(),
        status: 'UNPAID',
      };
      await saveUnpaidList([...all, newEntry]);
    }

    closeModal();
    await loadData();
  }

  // Show a YES/NO dialog before marking as paid
  function confirmMarkPaid() {
    Alert.alert(
      'Mark as Paid',
      'Are you sure you want to mark this laundry as paid?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, mark paid', onPress: handleMarkPaid },
      ]
    );
  }

  async function handleMarkPaid() {
    if (!selectedItem) return;
    const all = await getUnpaidList();
    const updated = all.map((i) =>
      i.id === selectedItem.id
        ? { ...i, status: 'PAID' as const, paidDate: nowISO() }
        : i
    );
    await saveUnpaidList(updated);
    closeModal();
    await loadData(); // Refresh - this item will now disappear from the list
  }

  // Show a YES/NO dialog before deleting
  function confirmDelete(item: UnpaidLaundry) {
    Alert.alert(
      'Delete Entry',
      `Delete "${item.customerName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(item.id),
        },
      ]
    );
  }

  async function handleDelete(id: string) {
    const all = await getUnpaidList();
    await saveUnpaidList(all.filter((i) => i.id !== id));
    closeModal();
    await loadData();
  }

  // ---- Loading spinner ----
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ---- Main render ----
  return (
    <View style={styles.container}>
      {/* Search bar at the top */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* The scrollable list of cards */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UnpaidCard
            item={item}
            onPress={() => openEditModal(item)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="wallet-outline"
            title={search ? 'No results found' : 'No unpaid entries'}
            subtitle={
              search
                ? `No customer named "${search}" found.`
                : 'Tap the blue + button to add an unpaid laundry record.'
            }
          />
        }
      />

      {/* Floating + button (bottom right) */}
      <FAB onPress={openAddModal} />

      {/* Bottom sheet modal for add/edit */}
      <UnpaidModal
        visible={modalVisible}
        mode={selectedItem ? 'edit' : 'add'}
        initialData={selectedItem}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onMarkPaid={confirmMarkPaid}
        onDelete={() => selectedItem && confirmDelete(selectedItem)}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 110, // Leave room for the FAB button
    flexGrow: 1,
  },
});
