import { render, screen } from '@testing-library/react';
import App from './App';
import { RegCup } from './containers/RegCup';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('hello world', () => {
  render(<RegCup/>);

  const inputElement = screen.getAllByDisplayValue(/Сколько/i);
  expect(inputElement).toBeInTheDocument();
});
