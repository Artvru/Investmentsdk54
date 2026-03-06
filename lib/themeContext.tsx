import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@investment54_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [loading, setLoading] = useState(true);

  // โหลด theme จาก AsyncStorage เมื่อแอปเปิด
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Color palettes สำหรับ Light และ Dark mode
export const lightColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e8eef7',
  primary: '#2563eb',
  success: '#10b981',
  error: '#dc2626',
  warning: '#f59e0b',
};

export const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  border: '#334155',
  primary: '#3b82f6',
  success: '#34d399',
  error: '#ef4444',
  warning: '#fbbf24',
};

export const getColors = (theme: ThemeMode) => {
  return theme === 'light' ? lightColors : darkColors;
};
