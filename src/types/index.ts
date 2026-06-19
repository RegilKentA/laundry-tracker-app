// ============================================================
// TYPE DEFINITIONS
// These are the "shapes" of the data we store and work with.
// TypeScript uses these to catch mistakes before they happen.
// ============================================================

export type UnpaidStatus = 'UNPAID' | 'PAID';
export type UnclaimedStatus = 'UNCLAIMED' | 'CLAIMED';

// A record for someone who hasn't paid yet
export interface UnpaidLaundry {
  id: string;           // Unique ID we generate
  customerName: string; // Customer's name
  amount: number;       // How much they owe
  dateCreated: string;  // When this record was created (ISO date string)
  paidDate?: string;    // When they paid (only set after marking as paid)
  status: UnpaidStatus; // 'UNPAID' or 'PAID'
}

// A record for laundry that hasn't been picked up yet
export interface UnclaimedLaundry {
  id: string;
  customerName: string;
  dateCreated: string;
  claimedDate?: string;  // When they claimed it
  status: UnclaimedStatus;
}
