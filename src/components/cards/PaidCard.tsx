import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow } from "../../constants/theme";
import { UnpaidLaundry } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import StatusBadge from "../common/StatusBadge";

interface Props {
  item: UnpaidLaundry;
}

export default function PaidCard({ item }: Props) {
  return (
    <View style={styles.card}>
      {/* Top row: name + PAID badge */}
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {item.customerName}
          </Text>
          <Text style={styles.dateLabel}>
            Created: {formatDate(item.dateCreated)}
          </Text>
        </View>
        <StatusBadge label="PAID" variant="paid" />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom rows: amount + paid date */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoLabel}>Amount paid</Text>
        </View>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="checkmark-circle-outline"
            size={14}
            color={colors.secondary}
          />
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>
            Date paid
          </Text>
        </View>
        <Text style={styles.paidDate}>
          {item.paidDate ? formatDate(item.paidDate) : "—"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    ...shadow.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameBlock: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoLabel: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginLeft: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  paidDate: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondary,
  },
});
