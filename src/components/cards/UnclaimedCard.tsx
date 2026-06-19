import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../common/StatusBadge';
import { colors, radius, shadow } from '../../constants/theme';
import { UnclaimedLaundry } from '../../types';
import { formatDate } from '../../utils/date';

interface Props {
  item: UnclaimedLaundry;
  onPress: () => void;
  onDelete: () => void;
}

export default function UnclaimedCard({ item, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.72}>
      {/* Top row: name + badge */}
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>{item.customerName}</Text>
          <Text style={styles.date}>{formatDate(item.dateCreated)}</Text>
        </View>
        <StatusBadge label="UNCLAIMED" variant="unclaimed" />
      </View>

      {/* Bottom row: hint text + delete button */}
      <View style={styles.bottomRow}>
        <View style={styles.hintRow}>
          <Ionicons name="shirt-outline" size={15} color={colors.textMuted} />
          <Text style={styles.hint}>  Tap to manage</Text>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={`Delete ${item.customerName}`}
        >
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
