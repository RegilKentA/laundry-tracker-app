// ============================================================
// UNCLAIMED MODAL
// Same concept as UnpaidModal but simpler -
// only has a customer name field (no amount).
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
import { UnclaimedLaundry } from '../../types';

interface Props {
  visible: boolean;
  mode: 'add' | 'edit';
  initialData?: UnclaimedLaundry | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
  onMarkClaimed: () => void;
  onDelete: () => void;
}

export default function UnclaimedModal({
  visible,
  mode,
  initialData,
  onClose,
  onSubmit,
  onMarkClaimed,
  onDelete,
}: Props) {
  const [name, setName] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (visible) {
      setName(initialData?.customerName ?? '');
    }
  }, [visible, initialData]);

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter the customer name.');
      return;
    }
    onSubmit(trimmedName);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dim background overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {mode === 'add' ? 'New unclaimed entry' : 'Edit entry'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Customer name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Juan Dela Cruz"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoFocus={mode === 'add'}
            />

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>
                {mode === 'add' ? '+ Add entry' : 'Save changes'}
              </Text>
            </TouchableOpacity>

            {mode === 'edit' && (
              <>
                <TouchableOpacity style={styles.btnSuccess} onPress={onMarkClaimed}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.btnSuccessText}>  Mark as claimed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDanger} onPress={onDelete}>
                  <Ionicons name="trash-outline" size={18} color={colors.dangerDark} />
                  <Text style={styles.btnDangerText}>  Delete entry</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '85%',
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
