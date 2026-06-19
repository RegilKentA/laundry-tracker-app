// ============================================================
// ABOUT SCREEN  (src/app/about.tsx)
// Accessible from the ☰ menu button in the header.
// ============================================================

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../constants/theme';

// Simple info row for the about screen
function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* App icon / logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Ionicons name="shirt" size={40} color={colors.white} />
        </View>
        <Text style={styles.appName}>Laundry Tracker</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>

      {/* Description card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About this app</Text>
        <Text style={styles.cardBody}>
          Laundry Tracker helps small laundry shops keep track of customers
          who haven't paid yet and laundry items that haven't been picked up.
          All data is stored locally on this device.
        </Text>
      </View>

      {/* Features card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Features</Text>
        <InfoRow icon="wallet-outline"  label="Unpaid Laundry"   value="Track who hasn't paid" />
        <InfoRow icon="shirt-outline"   label="Unclaimed Laundry" value="Track uncollected items" />
        <InfoRow icon="search-outline"  label="Search"           value="Find customers quickly" />
        <InfoRow icon="save-outline"    label="Local Storage"    value="Works fully offline" />
      </View>

      {/* How to use card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to use</Text>
        <Text style={styles.step}><Text style={styles.num}>1.</Text>  Tap the blue + button to add a new entry.</Text>
        <Text style={styles.step}><Text style={styles.num}>2.</Text>  Tap a card to edit or update its status.</Text>
        <Text style={styles.step}><Text style={styles.num}>3.</Text>  Tap the trash icon 🗑 to delete an entry.</Text>
        <Text style={styles.step}><Text style={styles.num}>4.</Text>  Use the search bar to find a customer.</Text>
      </View>

      <Text style={styles.footer}>Built with Expo & React Native</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  logoWrap: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  appVersion: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 14,
    ...shadow.card,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  step: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 4,
  },
  num: {
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 8,
  },
});
