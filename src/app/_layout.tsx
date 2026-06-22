// ============================================================
// ROOT LAYOUT  (src/app/_layout.tsx)
//
// This is the very top of the navigation tree.
// It wraps everything in a Stack navigator.
// The "(tabs)" group is the main area with the bottom tab bar.
// "about" is a separate screen reachable from the menu button.
// ============================================================

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <>
      {/* StatusBar style="light" makes the clock/battery icons WHITE on the blue header */}
      <StatusBar style="light" backgroundColor={colors.primary} />

      <Stack>
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* History screen — navigated to from the ☰ menu */}
        <Stack.Screen
          name="history"
          options={{
            title: "History",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: "700" },
          }}
        />

        {/* About screen - accessible from the menu button in the header */}
        <Stack.Screen
          name="about"
          options={{
            title: "About",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: "700" },
          }}
        />
      </Stack>
    </>
  );
}
