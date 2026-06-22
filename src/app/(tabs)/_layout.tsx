// ============================================================
// TAB LAYOUT  (src/app/(tabs)/_layout.tsx)
//
// Sets up the two bottom tabs.
// The ☰ menu button now opens an action sheet with options:
//   - History  → navigates to /history
//   - About    → navigates to /about
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { colors } from "../../constants/theme";

// Called when the ☰ menu button is pressed
function openMenu() {
  Alert.alert(
    "Menu",
    "",
    [
      {
        text: "📋  History",
        onPress: () => router.push("/history"),
      },
      {
        text: "ℹ️  About",
        onPress: () => router.push("/about"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
    { cancelable: true },
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
          fontWeight: "600",
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        // ☰ menu button — shown on every tab's header
        headerRight: () => (
          <TouchableOpacity
            onPress={openMenu}
            style={{ marginRight: 16 }}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu-outline" size={26} color={colors.white} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Unpaid Laundry",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="unclaimed"
        options={{
          title: "Unclaimed Laundry",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
