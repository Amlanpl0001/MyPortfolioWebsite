import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Simplified test that just checks if the App component renders without crashing
test('renders without crashing', () => {
  // This test simply verifies that the App component can be rendered without throwing an error
  expect(() => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    );
  }).not.toThrow();
});
