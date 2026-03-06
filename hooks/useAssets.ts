import { useEffect, useState } from 'react';
import { Asset, Transaction } from '../types';
import { fetchAssets } from '../services/assetService';
import { fetchTransactionsByAsset } from '../services/transactionService';

export type AssetWithTransactions = {
  asset: Asset;
  transactions: Transaction[];
};

export function useAssets() {
  const [assets, setAssets] = useState<AssetWithTransactions[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const as = await fetchAssets();
      const txPromises = as.map((a) => fetchTransactionsByAsset(a.id));
      const txs = await Promise.all(txPromises);
      
      const assetsWithTransactions: AssetWithTransactions[] = as.map((a, i) => ({
        asset: a,
        transactions: txs[i] as Transaction[],
      }));

      setAssets(assetsWithTransactions);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadAssets().then(() => {
      if (!mounted) setAssets([]);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refreshAssets = () => loadAssets();

  return { assets, loading, refreshAssets };
}
