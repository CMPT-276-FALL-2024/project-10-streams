// src/App.test.js

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PlanYourPlate heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/PlanYourPlate/i);
  expect(headingElement).toBeInTheDocument();
});

