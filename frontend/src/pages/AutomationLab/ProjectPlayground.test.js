import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProjectPlayground from './ProjectPlayground';

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

describe('ProjectPlayground Component', () => {
  test('renders loading state initially', () => {
    renderWithRouter(<ProjectPlayground />);
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument();
  });

  test('renders products after loading', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Check if products are rendered
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
  });

  test('search functionality filters products', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search by name, description, category, or tags/i);
    
    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    
    // Check if the search filters the products
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.queryByText(/T-shirt/i)).not.toBeInTheDocument();
  });

  test('price range filter works', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Get the price range inputs
    const minPriceInput = screen.getByLabelText(/Price Range/i).nextElementSibling.firstChild;
    const maxPriceInput = screen.getByLabelText(/Price Range/i).nextElementSibling.lastChild;
    
    // Set price range
    fireEvent.change(minPriceInput, { target: { value: 100 } });
    fireEvent.change(maxPriceInput, { target: { value: 200 } });
    
    // Check if the price filter works
    expect(screen.getByText(/Headphones/i)).toBeInTheDocument();
    expect(screen.queryByText(/Laptop/i)).not.toBeInTheDocument();
  });

  test('category filter works', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Click on a category filter button
    fireEvent.click(screen.getByText(/Electronics/i));
    
    // Check if the category filter works
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument();
    expect(screen.queryByText(/T-shirt/i)).not.toBeInTheDocument();
  });

  test('audience filter works', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Click on an audience filter button
    fireEvent.click(screen.getByText(/men/i));
    
    // Check if the audience filter works
    expect(screen.getByText(/T-shirt/i)).toBeInTheDocument();
    expect(screen.queryByText(/Kids Backpack/i)).not.toBeInTheDocument();
  });

  test('sort functionality works', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Get the sort select
    const sortSelect = screen.getByLabelText(/Sort By/i);
    
    // Change the sort option
    fireEvent.change(sortSelect, { target: { value: 'price-low-high' } });
    
    // Check if the sort works (this is a simplified check)
    const productPrices = screen.getAllByText(/\$\d+\.\d{2}/i).map(el => 
      parseFloat(el.textContent.replace('$', ''))
    );
    
    // Check if prices are in ascending order
    const isSorted = productPrices.every((price, i) => 
      i === 0 || price >= productPrices[i - 1]
    );
    
    expect(isSorted).toBe(true);
  });

  test('add to cart functionality works', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Check that cart is empty
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    
    // Click add to cart button for a product
    const addToCartButtons = screen.getAllByText(/Add to Cart/i);
    fireEvent.click(addToCartButtons[0]);
    
    // Check if product is added to cart
    expect(screen.queryByText(/Your cart is empty/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
  });

  test('recommended products appear when a product is selected', async () => {
    renderWithRouter(<ProjectPlayground />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
    });
    
    // Click on a product to select it
    const productCards = screen.getAllByText(/Laptop|Smartphone|Headphones/i);
    fireEvent.click(productCards[0]);
    
    // Check if recommended products section appears
    await waitFor(() => {
      expect(screen.getByText(/Recommended Products/i)).toBeInTheDocument();
    });
  });
});