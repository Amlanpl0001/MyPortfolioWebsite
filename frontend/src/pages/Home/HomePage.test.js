import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Simplified test that just checks if the component renders without crashing
test('renders homepage without crashing', () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );

  // Check if hero section is rendered
  expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();

  // Check if advertisement spaces are rendered
  const adBanners = screen.getAllByText('Advertisement Space');
  expect(adBanners.length).toBeGreaterThanOrEqual(2);
});
