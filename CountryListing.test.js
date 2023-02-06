import { render, screen } from '@testing-library/react';
import CountryListing from "./CountryListing";
test('renders learn react link', () => {
  render(<CountryListing />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
