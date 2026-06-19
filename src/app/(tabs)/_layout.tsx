// ============================================================
// TAB LAYOUT  (src/app/(tabs)/_layout.tsx)
//
// This sets up the TWO bottom tabs:
//   Tab 1 → index.tsx     = Unpaid Laundry
//   Tab 2 → unclaimed.tsx = Unclaimed Laundry
//
// The header at the top is also configured here.
// ============================================================

import { Tabs, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // --- Bottom tab bar styling ---
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        // --- Header (top bar) styling ---
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },

        // The ☰ menu button on the top right
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/about')}
            style={{ marginRight: 16 }}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu-outline" size={26} color={colors.white} />
          </TouchableOpacity>
        ),
      }}
    >
      {/* -------- TAB 1: Unpaid Laundry -------- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Unpaid Laundry',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      {/* -------- TAB 2: Unclaimed Laundry -------- */}
      <Tabs.Screen
        name="unclaimed"
        options={{
          title: 'Unclaimed Laundry',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
