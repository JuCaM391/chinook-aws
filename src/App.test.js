import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('./api', () => ({
  getTracks: jest.fn(),
  getArtists: jest.fn(),
  getAlbums: jest.fn(),
  getCustomers: jest.fn(),
  createCustomer: jest.fn(),
  purchase: jest.fn(),
}));

test('renders title', () => {
  render(<App />);
  expect(screen.getByText(/Chinook/i)).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  const buscarBtns = screen.getAllByText(/Buscar canciones/i);
  expect(buscarBtns.length).toBeGreaterThan(0);
});

test('renders search inputs', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Nombre de canción/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Artista/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Género/i)).toBeInTheDocument();
});

test('switches to purchase tab on click', async () => {
  render(<App />);
  const buttons = screen.getAllByText(/Realizar Compra/i);
  await userEvent.click(buttons[0]);
  expect(screen.getByText(/ID de Cliente/i)).toBeInTheDocument();
});
