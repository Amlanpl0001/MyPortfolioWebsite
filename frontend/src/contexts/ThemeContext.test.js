import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Test component that uses the ThemeContext
const TestComponent = () => {
  const { theme, toggleTheme, setThemeMode, isDark, isLight } = useTheme();

  return (
    <div>
      <div data-testid="theme-mode">{theme}</div>
      <div data-testid="is-dark">{isDark ? 'Dark Mode' : 'Not Dark Mode'}</div>
      <div data-testid="is-light">{isLight ? 'Light Mode' : 'Not Light Mode'}</div>
      
      <button 
        data-testid="toggle-theme"
        onClick={toggleTheme}
      >
        Toggle Theme
      </button>
      
      <button 
        data-testid="set-light"
        onClick={() => setThemeMode('light')}
      >
        Set Light Mode
      </button>
      
      <button 
        data-testid="set-dark"
        onClick={() => setThemeMode('dark')}
      >
        Set Dark Mode
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('provides theme context to children with default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Not Dark Mode');
    expect(screen.getByTestId('is-light')).toHaveTextContent('Light Mode');
  });

  test('toggles theme between light and dark', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially light mode
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    
    // Toggle to dark mode
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Dark Mode');
    expect(screen.getByTestId('is-light')).toHaveTextContent('Not Light Mode');
    
    // Toggle back to light mode
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Not Dark Mode');
    expect(screen.getByTestId('is-light')).toHaveTextContent('Light Mode');
  });

  test('sets theme mode directly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Set to dark mode
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Dark Mode');
    
    // Set to light mode
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('is-light')).toHaveTextContent('Light Mode');
  });

  test('loads theme from localStorage on mount', () => {
    // Set theme in localStorage
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Dark Mode');
  });

  test('saves theme to localStorage when changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Toggle to dark mode
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Check localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Toggle back to light mode
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Check localStorage again
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('prefers dark color scheme from system', () => {
    // Mock matchMedia to prefer dark color scheme
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('Dark Mode');
  });
});