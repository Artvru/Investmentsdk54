import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../lib/themeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>  {/* Navigation ด้วย expo-router อยู่ตรง <Stack> ทั้งหมดนี้ */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            headerTitle: 'เพิ่มธุรกรรม',
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            headerTitle: 'แผนที่',
          }}
        />
        <Stack.Screen
          name="prices"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="asset/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
