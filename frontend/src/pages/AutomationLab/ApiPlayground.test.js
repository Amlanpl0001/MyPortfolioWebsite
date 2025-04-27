import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ApiPlayground from './ApiPlayground';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: '/' } }),
}));

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => ({
    isAuthenticated: () => true,
  }),
}));

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ApiPlayground Component', () => {
  test('renders API Playground title', () => {
    renderWithRouter(<ApiPlayground />);
    expect(screen.getByText(/API Playground/i)).toBeInTheDocument();
  });

  test('renders API categories', () => {
    renderWithRouter(<ApiPlayground />);
    expect(screen.getByText(/Users API/i)).toBeInTheDocument();
    expect(screen.getByText(/Products API/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders API/i)).toBeInTheDocument();
    expect(screen.getByText(/Authentication API/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics API/i)).toBeInTheDocument();
    expect(screen.getByText(/Payments API/i)).toBeInTheDocument();
    expect(screen.getByText(/Search API/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Queries/i)).toBeInTheDocument();
  });

  test('changes active category when clicked', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Default active category is 'users'
    expect(screen.getByText(/Users API/i).closest('button')).toHaveClass('bg-blue-600');
    
    // Click on Products API
    fireEvent.click(screen.getByText(/Products API/i));
    
    // Check if Products API is now active
    expect(screen.getByText(/Products API/i).closest('button')).toHaveClass('bg-blue-600');
    expect(screen.getByText(/Users API/i).closest('button')).not.toHaveClass('bg-blue-600');
  });

  test('renders advanced queries section', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Click on Advanced Queries
    fireEvent.click(screen.getByText(/Advanced Queries/i));
    
    // Check if advanced queries endpoints are rendered
    expect(screen.getByText(/GraphQL-style query endpoint/i)).toBeInTheDocument();
    expect(screen.getByText(/Batch operations endpoint/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced aggregation endpoint/i)).toBeInTheDocument();
    expect(screen.getByText(/SQL-like query interface/i)).toBeInTheDocument();
  });

  test('displays endpoint details when clicked', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Click on Advanced Queries
    fireEvent.click(screen.getByText(/Advanced Queries/i));
    
    // Click on GraphQL endpoint
    fireEvent.click(screen.getByText(/GraphQL-style query endpoint/i));
    
    // Check if endpoint details are displayed
    expect(screen.getByText(/Request Body/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Response/i)).toBeInTheDocument();
    expect(screen.getByText(/GetUserWithOrdersAndProducts/i)).toBeInTheDocument();
  });

  test('displays batch operations endpoint details', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Click on Advanced Queries
    fireEvent.click(screen.getByText(/Advanced Queries/i));
    
    // Click on Batch operations endpoint
    fireEvent.click(screen.getByText(/Batch operations endpoint/i));
    
    // Check if endpoint details are displayed
    expect(screen.getByText(/Request Body/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Response/i)).toBeInTheDocument();
    expect(screen.getByText(/operations/i)).toBeInTheDocument();
    expect(screen.getByText(/continueOnError/i)).toBeInTheDocument();
  });

  test('displays aggregation endpoint details', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Click on Advanced Queries
    fireEvent.click(screen.getByText(/Advanced Queries/i));
    
    // Click on Advanced aggregation endpoint
    fireEvent.click(screen.getByText(/Advanced aggregation endpoint/i));
    
    // Check if endpoint details are displayed
    expect(screen.getByText(/Request Body/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Response/i)).toBeInTheDocument();
    expect(screen.getByText(/dimensions/i)).toBeInTheDocument();
    expect(screen.getByText(/metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
  });

  test('displays SQL-like query interface details', () => {
    renderWithRouter(<ApiPlayground />);
    
    // Click on Advanced Queries
    fireEvent.click(screen.getByText(/Advanced Queries/i));
    
    // Click on SQL-like query interface
    fireEvent.click(screen.getByText(/SQL-like query interface/i));
    
    // Check if endpoint details are displayed
    expect(screen.getByText(/Request Body/i)).toBeInTheDocument();
    expect(screen.getByText(/Example Response/i)).toBeInTheDocument();
    expect(screen.getByText(/SELECT p.id, p.name/i)).toBeInTheDocument();
    expect(screen.getByText(/params/i)).toBeInTheDocument();
    expect(screen.getByText(/options/i)).toBeInTheDocument();
  });

  test('navigates back to lab home when back button is clicked', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    
    renderWithRouter(<ApiPlayground />);
    
    // Click on back button
    fireEvent.click(screen.getByText(/← Back to Lab Home/i));
    
    // Check if navigate was called with correct path
    expect(navigateMock).toHaveBeenCalledWith('/lab');
  });
});