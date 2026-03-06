import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export async function fetchTransactionsByAsset(assetId: number): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase.from('transactions').select('id, asset_id, date, investment_amount, units, price_purchase, created_at').eq('asset_id', assetId);
    if (error) throw error;
    return (data || []) as Transaction[];
  } catch (e) {
    console.error('Fetch transactions error:', e);
    return [];
  }
}

export async function createTransaction(t: Omit<Transaction, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase.from('transactions').insert([t]).select('id, asset_id, date, investment_amount, units, price_purchase, created_at');
    if (error) throw error;
    return data?.[0] as Transaction;
  } catch (e) {
    console.error('Create transaction error:', e);
    return null;
  }
}

export async function deleteTransaction(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Delete transaction error:', e);
    return false;
  }
}
