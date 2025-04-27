import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
import { slate, slateDark, blue, blueDark } from '@radix-ui/colors';

// Test component that will be wrapped with ThemeProvider
const TestComponent = () => <div data-testid="test-component">Test</div>;

describe('Theme Colors', () => {
  // Helper function to get computed styles
  const getComputedStyle = (element) => window.getComputedStyle(element);
  
  // Helper function to get CSS variable value
  const getCssVariable = (element, variable) => 
    getComputedStyle(element).getPropertyValue(variable).trim();

  test('light theme applies correct Radix UI Colors', () => {
    // Set up localStorage to ensure light theme
    localStorage.setItem('theme', 'light');
    
    // Render component with ThemeProvider
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Get the root element
    const root = document.documentElement;
    
    // Check that the light theme class is applied
    expect(root.classList.contains('light')).toBe(true);
    
    // Check CSS variables against Radix UI Colors
    expect(getCssVariable(root, '--color-background')).toBe(slate.slate1);
    expect(getCssVariable(root, '--color-surface')).toBe(slate.slate2);
    expect(getCssVariable(root, '--color-border')).toBe(slate.slate6);
    expect(getCssVariable(root, '--color-text-primary')).toBe(slate.slate12);
    expect(getCssVariable(root, '--color-text-secondary')).toBe(slate.slate11);
    expect(getCssVariable(root, '--color-primary')).toBe(blue.blue9);
    expect(getCssVariable(root, '--color-accent')).toBe(blue.blue10);
  });

  test('dark theme applies correct Radix UI Colors', () => {
    // Set up localStorage to ensure dark theme
    localStorage.setItem('theme', 'dark');
    
    // Render component with ThemeProvider
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Get the root element
    const root = document.documentElement;
    
    // Check that the dark theme class is applied
    expect(root.classList.contains('dark')).toBe(true);
    
    // Check CSS variables against Radix UI Colors
    expect(getCssVariable(root, '--color-background')).toBe(slateDark.slate1);
    expect(getCssVariable(root, '--color-surface')).toBe(slateDark.slate2);
    expect(getCssVariable(root, '--color-border')).toBe(slateDark.slate6);
    expect(getCssVariable(root, '--color-text-primary')).toBe(slateDark.slate12);
    expect(getCssVariable(root, '--color-text-secondary')).toBe(slateDark.slate11);
    expect(getCssVariable(root, '--color-primary')).toBe(blueDark.blue9);
    expect(getCssVariable(root, '--color-accent')).toBe(blueDark.blue10);
  });

  test('theme colors match the specified Radix UI palette', () => {
    // Light mode colors from issue description
    const lightModeColors = {
      background: '#fafafa', // slate1
      surface: '#f1f1f1',    // slate2
      border: '#e1e1e1',     // slate6
      primaryText: '#101010', // slate12
      secondaryText: '#141414', // slate11
      primaryAction: '#218bff', // blue9
      accent: '#0b6eff',     // blue10
    };
    
    // Dark mode colors from issue description
    const darkModeColors = {
      background: '#0a0a0a', // slate1Dark
      surface: '#131313',    // slate2Dark
      border: '#2a2a2a',     // slate6Dark
      primaryText: '#f0f0f0', // slate12Dark
      secondaryText: '#d0d0d0', // slate11Dark
      primaryAction: '#489bff', // blue9Dark
      accent: '#79a9ff',     // blue10Dark
    };
    
    // Check light mode colors
    expect(slate.slate1.toLowerCase()).toBe(lightModeColors.background.toLowerCase());
    expect(slate.slate2.toLowerCase()).toBe(lightModeColors.surface.toLowerCase());
    expect(slate.slate6.toLowerCase()).toBe(lightModeColors.border.toLowerCase());
    expect(slate.slate12.toLowerCase()).toBe(lightModeColors.primaryText.toLowerCase());
    expect(slate.slate11.toLowerCase()).toBe(lightModeColors.secondaryText.toLowerCase());
    expect(blue.blue9.toLowerCase()).toBe(lightModeColors.primaryAction.toLowerCase());
    expect(blue.blue10.toLowerCase()).toBe(lightModeColors.accent.toLowerCase());
    
    // Check dark mode colors
    expect(slateDark.slate1.toLowerCase()).toBe(darkModeColors.background.toLowerCase());
    expect(slateDark.slate2.toLowerCase()).toBe(darkModeColors.surface.toLowerCase());
    expect(slateDark.slate6.toLowerCase()).toBe(darkModeColors.border.toLowerCase());
    expect(slateDark.slate12.toLowerCase()).toBe(darkModeColors.primaryText.toLowerCase());
    expect(slateDark.slate11.toLowerCase()).toBe(darkModeColors.secondaryText.toLowerCase());
    expect(blueDark.blue9.toLowerCase()).toBe(darkModeColors.primaryAction.toLowerCase());
    expect(blueDark.blue10.toLowerCase()).toBe(darkModeColors.accent.toLowerCase());
  });
});