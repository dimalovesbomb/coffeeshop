import { render, screen } from '@testing-library/react';
import App from './App';
import {Home} from './containers/Home';

test('renders learn react link', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Новый клиент/i);
  expect(linkElement).toBeInTheDocument();
});
