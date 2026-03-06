// import library ที่จำเป็นจาก React และ React Native
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// import hook ที่ใช้ดึงข้อมูล asset จาก database / storage
import { useAssets } from '../hooks/useAssets';

// ใช้สำหรับเปลี่ยนหน้าในแอป (navigation)
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useTheme, getColors } from '../lib/themeContext';

export default function Index() {
	const { assets, loading, refreshAssets } = useAssets();
	const isFocused = useIsFocused();
	const { theme, toggleTheme } = useTheme();
	const colors = getColors(theme);

	useEffect(() => {
		if (isFocused) {
			refreshAssets();
		}
	}, [isFocused]);
	const router = useRouter();

	const fetchBTCPrice = async () => {
		router.push('/prices');
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
				<View style={styles.headerTop}>
					<Text style={[styles.title, { color: colors.text }]}>Investment Log</Text>
					<TouchableOpacity 
						style={[styles.themeToggle, { backgroundColor: colors.border }]}
						onPress={toggleTheme}
					>
						<Text style={styles.themeToggleText}>{theme === 'light' ? '🌙' : '☀️'}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.buttons}>
					<TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => router.push('/add-transaction')}>
						<Text style={styles.btnText}>➕ Add Transaction</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={fetchBTCPrice}>
						<Text style={styles.btnText}>₿ Prices</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => router.push('/map')}>
						<Text style={styles.btnText}>📍 GPS</Text>
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={assets}
				keyExtractor={(item) => item.asset.id.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity 
						style={[styles.assetItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
						onPress={() => router.push(`/asset/${item.asset.id}`)}
					>
						<Text style={[styles.assetName, { color: colors.text }]}>{item.asset.name} ({item.asset.symbol})</Text>
						<Text style={[styles.transactionCount, { color: colors.textSecondary }]}>{item.transactions.length} transactions</Text>
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					loading ? (
						<View style={styles.center}>
							<ActivityIndicator size="large" color={colors.primary} />
							<Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading assets...</Text>
						</View>
					) : (
						<View style={styles.center}>
							<Text style={[styles.emptyText, { color: colors.textSecondary }]}>No assets yet</Text>
							<Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Add your first transaction to get started</Text>
						</View>
					)
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { padding: 16, paddingTop: 40, borderBottomWidth: 1 },
	headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
	title: { fontSize: 24, fontWeight: '800' },
	themeToggle: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
	themeToggleText: { fontSize: 20 },
	buttons: { flexDirection: 'row', gap: 8 },
	btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
	btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
	assetItem: { padding: 16, marginHorizontal: 12, marginVertical: 4, borderRadius: 8, borderWidth: 1 },
	assetName: { fontSize: 16, fontWeight: '600' },
	transactionCount: { fontSize: 14, marginTop: 4 },
	center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
	loadingText: { marginTop: 10, fontSize: 16 },
	emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
	emptySubtext: { fontSize: 14, textAlign: 'center' },
});
