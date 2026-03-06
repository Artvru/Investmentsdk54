import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAssets } from '../../hooks/useAssets';
import { deleteTransaction } from '../../services/transactionService';
import { useTheme, getColors } from '../../lib/themeContext';

export default function AssetDetail() {
  const { id } = useLocalSearchParams();
  const { assets, refreshAssets } = useAssets();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);

  const assetData = assets.find(a => a.asset.id === Number(id));

  const handleDeleteTransaction = async (transactionId: number) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTransaction(transactionId);
            if (success) {
              await refreshAssets(); // Refresh the assets data
              Alert.alert('Success', 'Transaction deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          }
        }
      ]
    );
  };

  if (!assetData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Asset not found</Text>
        </View>
      </View>
    );
  }

  const { asset, transactions } = assetData;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{asset.name} ({asset.symbol})</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.transactionHeader}>
              <Text style={[styles.date, { color: colors.text }]}>{item.date}</Text>
              <View style={styles.headerRight}>
                <Text style={[styles.total, { color: colors.primary }]}>${Number(item.investment_amount).toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTransaction(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.transactionDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price per Unit:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>${Number(item.price_purchase).toFixed(2)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Units:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{Number(item.units).toFixed(8)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Investment Amount:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>${Number(item.investment_amount).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add-transaction')}
            >
              <Text style={styles.addButtonText}>Add First Transaction</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={transactions.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 40, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  backButton: { fontSize: 16, marginRight: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18 },
  emptyText: { fontSize: 16, marginBottom: 20 },
  addButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  transactionItem: { padding: 16, marginHorizontal: 12, marginVertical: 4, borderRadius: 8, borderWidth: 1 },
  transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { fontSize: 16, fontWeight: '600' },
  total: { fontSize: 16, fontWeight: '700' },
  deleteButton: { padding: 4 },
  deleteButtonText: { fontSize: 16 },
  transactionDetails: { gap: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 14, fontWeight: '500' },
  detailValue: { fontSize: 14, fontWeight: '500' },
});