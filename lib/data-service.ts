import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentUserId: string | null = null;
const USER_ID_KEY = 'current_user_id';

export async function getAllInvoices() {
  const { data, error } = await supabase.from('orders').select('*');

  if (error) {
    console.error(error);
    throw new Error('Invoices could not be loaded');
  }

  return data;
}

export async function setCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  currentUserId = user?.id ?? null;

  if (currentUserId) {
    await AsyncStorage.setItem(USER_ID_KEY, currentUserId);
  } else {
    await AsyncStorage.removeItem(USER_ID_KEY);
  }
}

export async function setUserIdDirectly(id: string | null) {
  currentUserId = id;

  if (id) {
    await AsyncStorage.setItem(USER_ID_KEY, id);
  } else {
    await AsyncStorage.removeItem(USER_ID_KEY);
  }
}

// Optional: refresh it periodically in foreground
export function getCurrentUserId(): string | null {
  return currentUserId;
}

export async function getUserIdFromStorage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (e) {
    console.error('Error reading user ID from storage:', e);
    return null;
  }
}

export async function getPokemons() {
  const { data, error } = await supabase.from('pokemons').select('*, pokemons_selling(*)');

  if (error) {
    console.error(error);
    throw new Error('Invoices could not be loaded');
  }

  return data;
}
