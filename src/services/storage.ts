// ============================================================
// STORAGE SERVICE
// This file handles saving and loading data from the phone.
// AsyncStorage works like a tiny database stored on the device.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnclaimedLaundry, UnpaidLaundry } from '../types';

// Keys used to identify our data in storage
const UNPAID_KEY = '@laundry/unpaid_v1';
const UNCLAIMED_KEY = '@laundry/unclaimed_v1';

// ---- Internal helpers ----

async function readList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return []; // No data saved yet → return empty array
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.error(`[Storage] Error reading "${key}":`, error);
    return [];
  }
}

async function writeList<T>(key: string, list: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.error(`[Storage] Error writing "${key}":`, error);
  }
}

// ---- Unpaid Laundry ----

export async function getUnpaidList(): Promise<UnpaidLaundry[]> {
  return readList<UnpaidLaundry>(UNPAID_KEY);
}

export async function saveUnpaidList(list: UnpaidLaundry[]): Promise<void> {
  return writeList<UnpaidLaundry>(UNPAID_KEY, list);
}

// ---- Unclaimed Laundry ----

export async function getUnclaimedList(): Promise<UnclaimedLaundry[]> {
  return readList<UnclaimedLaundry>(UNCLAIMED_KEY);
}

export async function saveUnclaimedList(list: UnclaimedLaundry[]): Promise<void> {
  return writeList<UnclaimedLaundry>(UNCLAIMED_KEY, list);
}
