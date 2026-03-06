import { supabase } from '../lib/supabase';
import { Asset } from '../types';

export async function fetchAssets(): Promise<Asset[]> {
  try {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) {
      console.error('Fetch assets error:', error);
      throw error;
    }
    return (data || []) as Asset[];
  } catch (e) {
    console.error('Failed to fetch assets:', e);
    return [];
  }
}

export async function createAsset(a: Omit<Asset, 'id'>) {
  const assetData = {
    name: a.name || '',
    symbol: (a.symbol || '').toUpperCase(),
    type: a.type || 'cryptocurrency',
  };
  
  try {
    const { data, error } = await supabase.from('assets').insert([assetData]).select();
    if (error) {
      console.error('Create asset error:', error);
      throw new Error(error.message || 'Failed to create asset');
    }
    return data?.[0] as Asset;
  } catch (e) {
    console.error('Exception in createAsset:', e);
    throw e;
  }
}
