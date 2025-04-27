import React, { createContext, useState, useContext, useEffect } from 'react';

// Define theme tokens based on contrast ratio requirements
const lightTheme = {
  background: '#F8F9FA', // Light background
  surface: '#FFFFFF',    // White surface
  border: '#E2E8F0',     // Light border
  primaryText: '#000000', // Black text on background (13.7:1 contrast)
  secondaryText: '#4A5568', // Dark gray text on background (7.0:1 contrast)
  primaryAction: '#2563EB', // Blue for primary actions
  accent: '#3B82F6',     // Lighter blue for accents
};

const darkTheme = {
  background: '#121212', // Very dark background
  surface: '#1E1E1E',    // Dark surface
  border: '#333333',     // Dark border
  primaryText: '#FFFFFF', // White text on background (17.1:1 contrast)
  secondaryText: '#CCCCCC', // Light gray text on background (12.0:1 contrast)
  primaryAction: '#60A5FA', // Blue for primary actions
  accent: '#93C5FD',     // Lighter blue for accents
};

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  // or use system preference as default
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Default to light mode
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Update the HTML class and CSS variables when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the previous theme class
    root.classList.remove('light', 'dark');

    // Add the current theme class
    root.classList.add(theme);

    // Apply theme tokens as CSS variables
    const tokens = theme === 'light' ? lightTheme : darkTheme;

    // Set CSS variables
    root.style.setProperty('--color-background', tokens.background);
    root.style.setProperty('--color-surface', tokens.surface);
    root.style.setProperty('--color-border', tokens.border);
    root.style.setProperty('--color-text-primary', tokens.primaryText);
    root.style.setProperty('--color-text-secondary', tokens.secondaryText);
    root.style.setProperty('--color-primary', tokens.primaryAction);
    root.style.setProperty('--color-accent', tokens.accent);

    // Add transition for smooth theme switching
    root.style.setProperty('--transition-speed', '0.3s');

    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set a specific theme
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };

  // Provide theme state and functions to children
  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
