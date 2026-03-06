import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAssets } from '../hooks/useAssets';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, getColors } from '../lib/themeContext';

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  dropdownButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  totalAmount: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  totalAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default function TransactionForm({ onSubmit }: { onSubmit: (payload: any) => void }) {
  const { assets } = useAssets();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = createStyles(colors);
  
  const [assetId, setAssetId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [units, setUnits] = useState('');
  const [pricePurchase, setPricePurchase] = useState('');
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);

  useEffect(() => {
    if (assets.length > 0 && !assetId) {
      setAssetId(assets[0].asset.id);
    }
  }, [assets]);

  const selectedAsset = assets.find(a => a.asset.id === assetId)?.asset;

  // Format date to YYYY-MM-DD
  const formatDateToString = (dateObj: Date): string => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle date picker change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(formatDateToString(selectedDate));
    }
  };

  // Validate date format
  const isValidDateFormat = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const dateObj = new Date(dateString);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  };

  const handleSubmit = () => {
    if (!assetId || !date || !investmentAmount || !units || !pricePurchase) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!isValidDateFormat(date)) {
      Alert.alert('Error', 'Date must be in format YYYY-MM-DD (e.g., 2026-03-05)');
      return;
    }

    // Validate numbers
    const invAmount = Number(investmentAmount);
    const unitsNum = Number(units);
    const price = Number(pricePurchase);

    if (invAmount <= 0 || unitsNum <= 0 || price <= 0) {
      Alert.alert('Error', 'Investment Amount, Units, and Price must be greater than 0');
      return;
    }

    onSubmit({ asset_id: assetId, date: `${date}T00:00:00`, investment_amount: invAmount, units: unitsNum, price_purchase: price });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Transaction</Text>

      <View style={styles.formSection}>
        <Text style={styles.label}>Asset</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowAssetDropdown(!showAssetDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : 'Select Asset'}
          </Text>
        </TouchableOpacity>
        {showAssetDropdown && (
          <View style={styles.dropdownMenu}>
            {assets.map((a, idx) => (
              <TouchableOpacity
                key={a.asset.id}
                style={[styles.dropdownItem, idx === assets.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  setAssetId(a.asset.id);
                  setShowAssetDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  {a.asset.name} ({a.asset.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <TextInput
              style={styles.input}
              placeholder="2026-03-04"
              placeholderTextColor={colors.textSecondary}
              value={date}
              onChangeText={setDate}
              editable={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, { paddingHorizontal: 12, paddingVertical: 12, width: 'auto' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.submitButtonText, { fontSize: 18 }]}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.formSection}>
        <Text style={styles.label}>Investment Amount (USD)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={investmentAmount}
            onChangeText={setInvestmentAmount}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Units</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={units}
            onChangeText={setUnits}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Price per Unit (USD)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={pricePurchase}
            onChangeText={setPricePurchase}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
