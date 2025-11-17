'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const applyTheme = (newTheme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
  };

  useEffect(() => {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    let systemTheme = 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};