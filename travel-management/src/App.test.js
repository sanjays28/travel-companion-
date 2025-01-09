import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders travel management header', () => {
  render(<App />);
  const headerElement = screen.getByText(/travel management/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders main components', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('banner')).toBeInTheDocument();
});
