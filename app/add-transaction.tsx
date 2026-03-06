import React from 'react';
import { View, Text, Alert } from 'react-native';
import TransactionForm from '../components/TransactionForm';
import { createTransaction } from '../services/transactionService';

export default function AddTransaction() {
	const handleSubmit = async (payload: any) => {
		try {
			console.log('Creating transaction with payload:', payload);
			const t = await createTransaction(payload);
			console.log('Transaction created:', t);
			Alert.alert('Saved', 'Transaction saved successfully');
		} catch (e) {
			console.error('Create transaction error:', e);
			const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
			Alert.alert('Error', `Failed to save transaction:\n${errorMessage}`);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<TransactionForm onSubmit={handleSubmit} />
		</View>
	);
}
