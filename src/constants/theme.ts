// ============================================================
// THEME - All colors and sizing in one place.
// If you want to change the app's look, edit this file.
// ============================================================

export const colors = {
  // --- Blue (primary) - used for unpaid items, main buttons ---
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // --- Green (secondary) - used for success, paid/claimed actions ---
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#D1FAE5',

  // --- App backgrounds ---
  background: '#F1F5F9', // Light gray page background
  card: '#FFFFFF',       // White card background

  // --- Text ---
  text: '#0F172A',        // Main text (very dark)
  textMuted: '#64748B',   // Faded text (dates, hints)
  textInverse: '#FFFFFF', // White text on dark backgrounds

  // --- Borders ---
  border: '#E2E8F0',

  // --- Red (danger) - used for delete, warnings ---
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerLight: '#FEE2E2',

  white: '#FFFFFF',
  black: '#000000',
};

// Rounded corners
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

// Spacing between elements
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Drop shadows (makes cards look lifted)
export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
};
