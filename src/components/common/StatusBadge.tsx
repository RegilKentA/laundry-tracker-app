import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';

// The three visual styles for badges
type BadgeVariant = 'unpaid' | 'unclaimed' | 'paid' | 'claimed';

interface Props {
  label: string;
  variant: BadgeVariant;
}

const STYLES: Record<BadgeVariant, { bg: string; fg: string }> = {
  unpaid:    { bg: colors.dangerLight,    fg: colors.dangerDark },
  unclaimed: { bg: colors.primaryLight,   fg: colors.primaryDark },
  paid:      { bg: colors.secondaryLight, fg: colors.secondaryDark },
  claimed:   { bg: colors.secondaryLight, fg: colors.secondaryDark },
};

export default function StatusBadge({ label, variant }: Props) {
  const { bg, fg } = STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
