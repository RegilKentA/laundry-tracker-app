import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../common/StatusBadge';
import { colors, radius, shadow } from '../../constants/theme';
import { UnpaidLaundry } from '../../types';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface Props {
  item: UnpaidLaundry;
  onPress: () => void;   // Called when the card is tapped (opens edit modal)
  onDelete: () => void;  // Called when the trash icon is tapped
}

export default function UnpaidCard({ item, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.72}>
      {/* Top row: name + badge */}
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>{item.customerName}</Text>
          <Text style={styles.date}>{formatDate(item.dateCreated)}</Text>
        </View>
        <StatusBadge label="UNPAID" variant="unpaid" />
      </View>

      {/* Bottom row: amount + delete button */}
      <View style={styles.bottomRow}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
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
  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
