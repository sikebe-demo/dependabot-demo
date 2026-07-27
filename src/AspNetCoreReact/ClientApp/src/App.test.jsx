import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

it('renders without crashing', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>);

  expect(await screen.findByText('Hello, world!')).toBeDefined();
});
