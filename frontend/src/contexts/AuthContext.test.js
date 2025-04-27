import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the AuthContext
const TestComponent = () => {
  const { 
    currentUser, 
    login, 
    logout, 
    isAdmin, 
    isPracticeUser, 
    isAuthenticated 
  } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-role">
        {currentUser?.role || 'No Role'}
      </div>
      <div data-testid="is-admin">
        {isAdmin() ? 'Is Admin' : 'Not Admin'}
      </div>
      <div data-testid="is-practice">
        {isPracticeUser() ? 'Is Practice User' : 'Not Practice User'}
      </div>
      <button 
        onClick={() => login('admin@example.com', 'admin123')}
        data-testid="login-admin"
      >
        Login as Admin
      </button>
      <button 
        onClick={() => login('practice@example.com', 'practice123')}
        data-testid="login-practice"
      >
        Login as Practice
      </button>
      <button 
        onClick={() => login('invalid@example.com', 'wrongpassword')}
        data-testid="login-invalid"
      >
        Invalid Login
      </button>
      <button 
        onClick={logout}
        data-testid="logout"
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock console.error to prevent error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    console.error.mockRestore();
  });

  test('provides authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-role')).toHaveTextContent('No Role');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Not Practice User');
  });

  test('login as admin works', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click login as admin button
    fireEvent.click(screen.getByTestId('login-admin'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Check user role and permissions
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Is Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Not Practice User');

    // Check localStorage
    expect(localStorage.getItem('token')).toBe('mock-admin-token');
    expect(localStorage.getItem('userRole')).toBe('admin');
  });

  test('login as practice user works', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click login as practice button
    fireEvent.click(screen.getByTestId('login-practice'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Check user role and permissions
    expect(screen.getByTestId('user-role')).toHaveTextContent('practice');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Is Practice User');

    // Check localStorage
    expect(localStorage.getItem('token')).toBe('mock-practice-token');
    expect(localStorage.getItem('userRole')).toBe('practice');
  });

  test('invalid login fails', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click invalid login button
    fireEvent.click(screen.getByTestId('login-invalid'));

    // Wait for authentication to complete
    await waitFor(() => {
      // Should still be unauthenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    // Check user role and permissions
    expect(screen.getByTestId('user-role')).toHaveTextContent('No Role');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Not Practice User');

    // Check localStorage
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
  });

  test('logout works', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    fireEvent.click(screen.getByTestId('login-admin'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Now logout
    fireEvent.click(screen.getByTestId('logout'));

    // Check if logged out
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-role')).toHaveTextContent('No Role');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Not Practice User');

    // Check localStorage
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
  });

  test('loads user from localStorage on mount', () => {
    // Set up localStorage with user data
    localStorage.setItem('token', 'mock-admin-token');
    localStorage.setItem('userRole', 'admin');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should be authenticated from localStorage
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Is Admin');
    expect(screen.getByTestId('is-practice')).toHaveTextContent('Not Practice User');
  });
});