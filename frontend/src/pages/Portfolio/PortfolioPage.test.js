import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PortfolioPage from './PortfolioPage';

// Simplified test that just checks if the component renders without crashing
test('renders portfolio page without crashing', () => {
  render(
    <BrowserRouter>
      <PortfolioPage />
    </BrowserRouter>
  );

  // Check if About section is rendered
  expect(screen.getByText('John Doe')).toBeInTheDocument();

  // Check if advertisement spaces are rendered
  const adBanners = screen.getAllByText('Advertisement Space');
  expect(adBanners.length).toBeGreaterThanOrEqual(2);
});
