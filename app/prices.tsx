import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme, getColors } from '../lib/themeContext';

interface AssetPrice {
  symbol: string;
  name: string;
  price: number;
  change24h?: number;
  lastUpdated: string;
}

const ASSETS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'XRPUSDT', name: 'XRP' },
];

export default function Prices() {
  const router = useRouter();
  const [prices, setPrices] = useState<AssetPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const colors = getColors(theme);

  // Load cached prices on mount
  useEffect(() => {
    loadCachedPrices();
    fetchPrices();
  }, []);

  const loadCachedPrices = async () => {
    try {
      const cached = await AsyncStorage.getItem('asset_prices');
      if (cached) {
        const parsedPrices = JSON.parse(cached);
        setPrices(parsedPrices);
      }
    } catch (error) {
      console.error('Error loading cached prices:', error);
    }
  };

  const savePricesToCache = async (pricesData: AssetPrice[]) => {
    try {
      await AsyncStorage.setItem('asset_prices', JSON.stringify(pricesData));
    } catch (error) {
      console.error('Error saving prices to cache:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      const pricePromises = ASSETS.map(async (asset) => {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${asset.symbol}`);
        const data = await response.json();
        return {
          symbol: asset.symbol,
          name: asset.name,
          price: parseFloat(data.price),
          lastUpdated: new Date().toISOString(),
        };
      });

      const pricesData = await Promise.all(pricePromises);
      setPrices(pricesData);
      await savePricesToCache(pricesData);
    } catch (error) {
      console.error('Error fetching prices:', error);
      Alert.alert('Error', 'Failed to fetch prices. Using cached data if available.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrices();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const renderPriceItem = ({ item }: { item: AssetPrice }) => (
    <View style={[styles.priceItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.priceHeader}>
        <Text style={[styles.assetName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.assetSymbol, { color: colors.textSecondary }]}>{item.symbol.replace('USDT', '')}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={[styles.price, { color: colors.primary }]}>${formatPrice(item.price)}</Text>
        <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
          Updated: {new Date(item.lastUpdated).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Asset Prices</Text>
      </View>

      <FlatList
        data={prices}
        keyExtractor={(item) => item.symbol}
        renderItem={renderPriceItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading prices...</Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No prices available</Text>
            </View>
          )
        }
        contentContainerStyle={prices.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: { fontSize: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  priceItem: {
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetSymbol: { fontSize: 14, fontWeight: '500' },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: { fontSize: 18, fontWeight: '700' },
  lastUpdated: { fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16 },
  emptyText: { fontSize: 16 },
});