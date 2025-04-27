import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Simplified test that just checks if the context provider renders without crashing
test('AuthProvider renders without crashing', () => {
  render(
    <AuthProvider>
      <div>Test</div>
    </AuthProvider>
  );

  expect(screen.getByText('Test')).toBeInTheDocument();
});
