import { useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';
const storageKey = 'stemPetLabTheme';

export function useTheme(defaultTheme: ThemeMode = 'dark') {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return { theme, setTheme };
}
