import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import DbPlayground from './DbPlayground';

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

describe('DbPlayground Component', () => {
  test('renders Database Playground title', () => {
    renderWithRouter(<DbPlayground />);
    expect(screen.getByText(/Database Playground/i)).toBeInTheDocument();
  });

  test('renders database schemas', () => {
    renderWithRouter(<DbPlayground />);
    expect(screen.getByText(/E-commerce Database/i)).toBeInTheDocument();
    expect(screen.getByText(/HR Database/i)).toBeInTheDocument();
    expect(screen.getByText(/Library Database/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics Database/i)).toBeInTheDocument();
  });

  test('changes active schema when clicked', () => {
    renderWithRouter(<DbPlayground />);
    
    // Default active schema is 'ecommerce'
    expect(screen.getByText(/E-commerce Database/i).closest('button')).toHaveClass('bg-blue-600');
    
    // Click on HR Database
    fireEvent.click(screen.getByText(/HR Database/i));
    
    // Check if HR Database is now active
    expect(screen.getByText(/HR Database/i).closest('button')).toHaveClass('bg-blue-600');
    expect(screen.getByText(/E-commerce Database/i).closest('button')).not.toHaveClass('bg-blue-600');
  });

  test('renders sample queries for ecommerce schema', () => {
    renderWithRouter(<DbPlayground />);
    
    // Check if sample queries are rendered
    expect(screen.getByText(/List all products/i)).toBeInTheDocument();
    expect(screen.getByText(/Find products with price > \$500/i)).toBeInTheDocument();
    expect(screen.getByText(/Count products by category/i)).toBeInTheDocument();
    expect(screen.getByText(/Product sales analysis/i)).toBeInTheDocument();
  });

  test('renders sample queries for analytics schema', () => {
    renderWithRouter(<DbPlayground />);
    
    // Click on Analytics Database
    fireEvent.click(screen.getByText(/Analytics Database/i));
    
    // Check if analytics sample queries are rendered
    expect(screen.getByText(/Basic website analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/User session analysis with window functions/i)).toBeInTheDocument();
    expect(screen.getByText(/Funnel analysis with conversion rates/i)).toBeInTheDocument();
    expect(screen.getByText(/Cohort retention analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Recursive CTE for user journey paths/i)).toBeInTheDocument();
    expect(screen.getByText(/JSON operations and dynamic pivot/i)).toBeInTheDocument();
  });

  test('loads query into editor when sample query is clicked', () => {
    renderWithRouter(<DbPlayground />);
    
    // Click on a sample query
    fireEvent.click(screen.getByText(/List all products/i));
    
    // Check if query is loaded into editor
    const sqlEditor = screen.getByLabelText(/SQL Query/i);
    expect(sqlEditor.value).toBe('SELECT * FROM products;');
  });

  test('loads complex query into editor when clicked', () => {
    renderWithRouter(<DbPlayground />);
    
    // Click on Analytics Database
    fireEvent.click(screen.getByText(/Analytics Database/i));
    
    // Click on a complex query
    fireEvent.click(screen.getByText(/User session analysis with window functions/i));
    
    // Check if complex query is loaded into editor
    const sqlEditor = screen.getByLabelText(/SQL Query/i);
    expect(sqlEditor.value).toContain('WITH user_sessions AS (');
    expect(sqlEditor.value).toContain('Window functions for user-level analysis');
    expect(sqlEditor.value).toContain('PERCENT_RANK()');
  });

  test('executes query when run button is clicked', async () => {
    renderWithRouter(<DbPlayground />);
    
    // Enter a query
    const sqlEditor = screen.getByLabelText(/SQL Query/i);
    fireEvent.change(sqlEditor, { target: { value: 'SELECT * FROM products;' } });
    
    // Click run button
    fireEvent.click(screen.getByText(/Run Query/i));
    
    // Check if query is executing
    expect(screen.getByText(/Executing query/i)).toBeInTheDocument();
    
    // Wait for query to complete
    await waitFor(() => {
      expect(screen.queryByText(/Executing query/i)).not.toBeInTheDocument();
    });
    
    // Check if results are displayed
    expect(screen.getByText(/Query Results/i)).toBeInTheDocument();
  });

  test('displays error message for invalid query', async () => {
    renderWithRouter(<DbPlayground />);
    
    // Enter an invalid query
    const sqlEditor = screen.getByLabelText(/SQL Query/i);
    fireEvent.change(sqlEditor, { target: { value: 'INVALID QUERY;' } });
    
    // Click run button
    fireEvent.click(screen.getByText(/Run Query/i));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  test('clears query when clear button is clicked', () => {
    renderWithRouter(<DbPlayground />);
    
    // Enter a query
    const sqlEditor = screen.getByLabelText(/SQL Query/i);
    fireEvent.change(sqlEditor, { target: { value: 'SELECT * FROM products;' } });
    
    // Click clear button
    fireEvent.click(screen.getByText(/Clear/i));
    
    // Check if query is cleared
    expect(sqlEditor.value).toBe('');
  });

  test('navigates back to lab home when back button is clicked', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);
    
    renderWithRouter(<DbPlayground />);
    
    // Click on back button
    fireEvent.click(screen.getByText(/← Back to Lab Home/i));
    
    // Check if navigate was called with correct path
    expect(navigateMock).toHaveBeenCalledWith('/lab');
  });
});