'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR初期値は 'light' にしておき、クライアントで上書き
  const [theme, setTheme] = useState<Theme>('light');

  // 初回マウント時に保存値またはOS設定から決定
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    console.log('[ThemeProvider] 初回マウント - saved theme:', saved);
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('[ThemeProvider] システム設定 prefersDark:', prefersDark);
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // DOMクラスとlocalStorageを同期
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.toggle('dark', theme === 'dark');
    const hasDark = root.classList.contains('dark');
    console.log('[ThemeProvider] テーマ変更:', theme, '| darkクラス:', hadDark, '->', hasDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('[ThemeProvider] toggleTheme実行 - 現在:', theme);
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
