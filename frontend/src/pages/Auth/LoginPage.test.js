import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';

// Mock the useNavigate hook
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { from: '/lab' } }),
}));

// Mock the useAuth hook
const loginMock = jest.fn();
jest.mock('../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      login: loginMock,
    }),
  };
});

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    navigateMock.mockClear();
    loginMock.mockClear();
  });

  test('renders login form', () => {
    renderWithRouter(<LoginPage />);
    
    // Check if login form elements are rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows error when form is submitted with empty fields', async () => {
    renderWithRouter(<LoginPage />);
    
    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if error message is displayed
    expect(await screen.findByText(/Please enter both email and password/i)).toBeInTheDocument();
    
    // Login should not be called
    expect(loginMock).not.toHaveBeenCalled();
  });

  test('calls login function with correct credentials', async () => {
    // Mock successful login
    loginMock.mockResolvedValue({ success: true, role: 'admin' });
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if login was called with correct credentials
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('admin@example.com', 'admin123');
    });
  });

  test('redirects admin user to admin dashboard after successful login', async () => {
    // Mock successful admin login
    loginMock.mockResolvedValue({ success: true, role: 'admin' });
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if redirected to admin dashboard
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/admin');
    });
  });

  test('redirects practice user to lab after successful login', async () => {
    // Mock successful practice user login
    loginMock.mockResolvedValue({ success: true, role: 'practice' });
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'practice@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'practice123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if redirected to lab
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/lab');
    });
  });

  test('redirects to original location after successful login', async () => {
    // Mock successful login
    loginMock.mockResolvedValue({ success: true, role: 'practice' });
    
    // Mock location with from path
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      state: { from: { pathname: '/lab/project' } }
    }));
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'practice@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'practice123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if redirected to original location
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/lab/project');
    });
  });

  test('shows error message on failed login', async () => {
    // Mock failed login
    loginMock.mockResolvedValue({ success: false, error: 'Invalid email or password' });
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if error message is displayed
    expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
    
    // Should not navigate
    expect(navigateMock).not.toHaveBeenCalled();
  });

  test('disables login button during login process', async () => {
    // Mock login with delay to test loading state
    loginMock.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ success: true, role: 'admin' }), 100);
    }));
    
    renderWithRouter(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check if button is disabled and shows loading text
    expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logging in.../i })).toBeDisabled();
    
    // Wait for login to complete
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalled();
    });
  });

  test('displays demo credentials', () => {
    renderWithRouter(<LoginPage />);
    
    // Check if demo credentials are displayed
    expect(screen.getByText(/Demo Credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin:/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/admin123/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice User:/i)).toBeInTheDocument();
    expect(screen.getByText(/practice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/practice123/i)).toBeInTheDocument();
  });
});