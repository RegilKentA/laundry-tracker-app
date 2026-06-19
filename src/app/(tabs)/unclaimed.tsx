// ============================================================
// UNCLAIMED LAUNDRY SCREEN  (src/app/(tabs)/unclaimed.tsx)
//
// This is Tab 2. It shows a list of laundry not yet picked up.
// Features:
//   - Load list from storage
//   - Search/filter by name
//   - Add new entry (FAB button)
//   - Edit entry (tap a card)
//   - Mark as claimed (with confirmation)
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
import { UnclaimedLaundry } from '../../types';
import { getUnclaimedList, saveUnclaimedList } from '../../services/storage';
import { generateId } from '../../utils/id';
import { nowISO, sortByNewest } from '../../utils/date';
import UnclaimedCard from '../../components/cards/UnclaimedCard';
import EmptyState from '../../components/common/EmptyState';
import FAB from '../../components/common/FAB';
import SearchBar from '../../components/common/SearchBar';
import UnclaimedModal from '../../components/modals/UnclaimedModal';

export default function UnclaimedScreen() {
  // ---- State ----
  const [list, setList] = useState<UnclaimedLaundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnclaimedLaundry | null>(null);

  // Reload every time this tab is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    setLoading(true);
    const all = await getUnclaimedList();
    // Only show items that haven't been claimed yet
    const unclaimedOnly = all.filter((item) => item.status === 'UNCLAIMED');
    setList(sortByNewest(unclaimedOnly));
    setLoading(false);
  }

  const filteredList = list.filter((item) =>
    item.customerName.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setSelectedItem(null);
    setModalVisible(true);
  }

  function openEditModal(item: UnclaimedLaundry) {
    setSelectedItem(item);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedItem(null);
  }

  async function handleSubmit(name: string) {
    const all = await getUnclaimedList();

    if (selectedItem) {
      // EDIT mode
      const updated = all.map((i) =>
        i.id === selectedItem.id ? { ...i, customerName: name } : i
      );
      await saveUnclaimedList(updated);
    } else {
      // ADD mode
      const newEntry: UnclaimedLaundry = {
        id: generateId(),
        customerName: name,
        dateCreated: nowISO(),
        status: 'UNCLAIMED',
      };
      await saveUnclaimedList([...all, newEntry]);
    }

    closeModal();
    await loadData();
  }

  function confirmMarkClaimed() {
    Alert.alert(
      'Mark as Claimed',
      'Are you sure you want to mark this laundry as claimed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, mark claimed', onPress: handleMarkClaimed },
      ]
    );
  }

  async function handleMarkClaimed() {
    if (!selectedItem) return;
    const all = await getUnclaimedList();
    const updated = all.map((i) =>
      i.id === selectedItem.id
        ? { ...i, status: 'CLAIMED' as const, claimedDate: nowISO() }
        : i
    );
    await saveUnclaimedList(updated);
    closeModal();
    await loadData();
  }

  function confirmDelete(item: UnclaimedLaundry) {
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
    const all = await getUnclaimedList();
    await saveUnclaimedList(all.filter((i) => i.id !== id));
    closeModal();
    await loadData();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UnclaimedCard
            item={item}
            onPress={() => openEditModal(item)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="shirt-outline"
            title={search ? 'No results found' : 'No unclaimed laundry'}
            subtitle={
              search
                ? `No customer named "${search}" found.`
                : 'Tap the blue + button to add an unclaimed laundry entry.'
            }
          />
        }
      />

      <FAB onPress={openAddModal} />

      <UnclaimedModal
        visible={modalVisible}
        mode={selectedItem ? 'edit' : 'add'}
        initialData={selectedItem}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onMarkClaimed={confirmMarkClaimed}
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
    paddingBottom: 110,
    flexGrow: 1,
  },
});
