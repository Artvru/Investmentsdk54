import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme, getColors } from '../lib/themeContext';

interface LocationData {
	latitude: number;
	longitude: number;
	accuracy: number | null;
	altitude: number | null;
	heading: number | null;
	speed: number | null;
}

export default function MapScreen() {
	const [location, setLocation] = useState<LocationData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { theme } = useTheme();
	const colors = getColors(theme);
	const mapRef = React.useRef<MapView>(null);

	useEffect(() => {
		(async () => {
			try {
				// Request location permission
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setError('Permission to access location was denied');
					setLoading(false);
					return;
				}

				// Get initial location
				const currentLocation = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.High,
				});

				setLocation({
					latitude: currentLocation.coords.latitude,
					longitude: currentLocation.coords.longitude,
					accuracy: currentLocation.coords.accuracy,
					altitude: currentLocation.coords.altitude,
					heading: currentLocation.coords.heading,
					speed: currentLocation.coords.speed,
				});
				setLoading(false);

				// Watch for location changes (real-time tracking)
				const subscription = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.High,
						timeInterval: 1000, // Update every 1 second
						distanceInterval: 5, // Update if moved 5 meters
					},
					(newLocation) => {
						const updatedLocation: LocationData = {
							latitude: newLocation.coords.latitude,
							longitude: newLocation.coords.longitude,
							accuracy: newLocation.coords.accuracy,
							altitude: newLocation.coords.altitude,
							heading: newLocation.coords.heading,
							speed: newLocation.coords.speed,
						};
						setLocation(updatedLocation);

						// Animate map to follow user
						if (mapRef.current) {
							mapRef.current.animateToRegion({
								latitude: updatedLocation.latitude,
								longitude: updatedLocation.longitude,
								latitudeDelta: 0.05,
								longitudeDelta: 0.05,
							}, 500);
						}
					}
				);

				// Cleanup subscription on unmount
				return () => {
					subscription.remove();
				};
			} catch (err) {
				setError('Failed to get location');
				setLoading(false);
			}
		})();
	}, []);

	if (loading) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={[styles.loadingText, { color: colors.text }]}>Getting your location...</Text>
			</View>
		);
	}

	if (error || !location) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text style={[styles.errorText, { color: colors.error }]}>{error || 'Unable to get location'}</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}}
			>
				<Marker
					coordinate={{
						latitude: location.latitude,
						longitude: location.longitude,
					}}
					title="Your Location"
					description={`Latitude: ${location.latitude.toFixed(6)}, Longitude: ${location.longitude.toFixed(6)}`}
				/>
			</MapView>

			<View style={[styles.infoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
				<Text style={[styles.infoTitle, { color: colors.text }]}>📍 Your Location</Text>
				<View style={styles.infoItem}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>Latitude:</Text>
					<Text style={[styles.value, { color: colors.primary }]}>{location.latitude.toFixed(6)}</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>Longitude:</Text>
					<Text style={[styles.value, { color: colors.primary }]}>{location.longitude.toFixed(6)}</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>Accuracy:</Text>
					<Text style={[styles.value, { color: colors.primary }]}>{location.accuracy?.toFixed(2) || 'N/A'} m</Text>
				</View>
				<View style={styles.infoItem}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>Altitude:</Text>
					<Text style={[styles.value, { color: colors.primary }]}>{location.altitude?.toFixed(2) || 'N/A'} m</Text>
				</View>
				{location.speed !== null && location.speed !== 0 && (
					<View style={styles.infoItem}>
						<Text style={[styles.label, { color: colors.textSecondary }]}>Speed:</Text>
						<Text style={[styles.value, { color: colors.primary }]}>{(location.speed * 3.6).toFixed(2)} km/h</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 0.6,
		borderBottomWidth: 1,
	},
	infoContainer: {
		flex: 0.4,
		padding: 16,
		paddingTop: 20,
		borderTopWidth: 1,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 16,
	},
	infoItem: {
		marginBottom: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		flex: 1,
	},
	value: {
		fontSize: 14,
		fontWeight: '600',
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
	},
});
