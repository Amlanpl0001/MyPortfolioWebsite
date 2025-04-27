import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReadingPage from './ReadingPage';

// Simplified test that just checks if the component renders without crashing
test('renders reading page without crashing', () => {
  render(
    <BrowserRouter>
      <ReadingPage />
    </BrowserRouter>
  );

  // Check if header section is rendered
  expect(screen.getByText('Reading')).toBeInTheDocument();

  // Check if advertisement spaces are rendered
  const adBanners = screen.getAllByText('Advertisement Space');
  expect(adBanners.length).toBeGreaterThanOrEqual(2);
});
