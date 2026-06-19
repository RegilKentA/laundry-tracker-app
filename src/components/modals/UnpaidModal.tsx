// ============================================================
// UNPAID MODAL
// This is the bottom sheet that slides up when you add or edit
// an unpaid entry. It uses React Native's built-in Modal
// so NO extra packages are needed.
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../constants/theme';
import { UnpaidLaundry } from '../../types';

interface Props {
  visible: boolean;
  mode: 'add' | 'edit';           // Are we adding a new entry or editing an existing one?
  initialData?: UnpaidLaundry | null; // Passed in when editing
  onClose: () => void;
  onSubmit: (name: string, amount: number) => void;
  onMarkPaid: () => void;
  onDelete: () => void;
}

export default function UnpaidModal({
  visible,
  mode,
  initialData,
  onClose,
  onSubmit,
  onMarkPaid,
  onDelete,
}: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // Pre-fill the form when editing an existing record
  useEffect(() => {
    if (visible) {
      setName(initialData?.customerName ?? '');
      setAmount(initialData ? String(initialData.amount) : '');
    }
  }, [visible, initialData]);

  function handleSave() {
    const trimmedName = name.trim();
    const numericAmount = parseFloat(amount);

    // Basic validation
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter the customer name.');
      return;
    }
    if (amount.trim() === '' || isNaN(numericAmount) || numericAmount < 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount (e.g. 150).');
      return;
    }

    onSubmit(trimmedName, numericAmount);
  }

  return (
    <Modal
      visible={visible}
      transparent        // Makes the area behind the sheet dark/dimmed
      animationType="slide"
      onRequestClose={onClose} // Android back button closes the modal
    >
      {/* Dark overlay - tapping it closes the modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* The actual white sheet that slides up from the bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          {/* Handle bar at top */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {mode === 'add' ? 'New unpaid entry' : 'Edit entry'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Customer Name field */}
            <Text style={styles.label}>Customer name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Maria Santos"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />

            {/* Amount field */}
            <Text style={styles.label}>Amount due (₱)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />

            {/* Save / Add button */}
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>
                {mode === 'add' ? '+ Add entry' : 'Save changes'}
              </Text>
            </TouchableOpacity>

            {/* These buttons only appear when EDITING an existing entry */}
            {mode === 'edit' && (
              <>
                <TouchableOpacity style={styles.btnSuccess} onPress={onMarkPaid}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.btnSuccessText}>  Mark as paid</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDanger} onPress={onDelete}>
                  <Ionicons name="trash-outline" size={18} color={colors.dangerDark} />
                  <Text style={styles.btnDangerText}>  Delete entry</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Bottom padding so buttons aren't hidden by keyboard */}
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Semi-transparent black background
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    maxHeight: '90%',
    ...shadow.modal,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15.5,
  },
  btnSuccess: {
    backgroundColor: colors.secondary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnSuccessText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  btnDanger: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnDangerText: {
    color: colors.dangerDark,
    fontWeight: '700',
    fontSize: 15,
  },
});
