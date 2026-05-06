import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

/**
 * Custom hook to access theme mode state and toggle function.
 * @returns {{ mode: 'light' | 'dark', toggleTheme: () => void, isDark: boolean }}
 */
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

/**
 * ThemeModeProvider — manages dark/light mode state,
 * persists preference to localStorage, and syncs the
 * `data-theme` attribute on the document root.
 */
export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem('aarogyam-theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // localStorage may be unavailable
    }
    // Default to light, or respect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem('aarogyam-theme', mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({
    mode,
    toggleTheme,
    isDark: mode === 'dark',
  }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
