import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import Login from './components/Login';
import SearchTracks from './components/SearchTracks';
import Purchase from './components/Purchase';

// Mock the api module
jest.mock('./api', () => ({
  getTracks: jest.fn(() => Promise.resolve({ data: [] })),
  purchase: jest.fn(() => Promise.resolve({}))
}));

// Mock fetch for login
global.fetch = jest.fn();

describe('App', () => {
  test('renderiza el header correctamente', () => {
    render(<App />);
    expect(screen.getByText(/Chinook Music Store/i)).toBeInTheDocument();
  });

  test('muestra botón de Admin cuando no hay sesión', () => {
    render(<App />);
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  test('muestra SearchTracks por defecto', () => {
    render(<App />);
    expect(screen.getByText(/Buscar Canciones/i)).toBeInTheDocument();
  });
});

describe('Login', () => {
  test('renderiza el formulario de login', () => {
    render(<Login onLogin={() => {}} />);
    expect(screen.getByText(/Panel Administrador/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
  });

  test('muestra error si campos vacíos', () => {
    render(<Login onLogin={() => {}} />);
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));
    expect(screen.getByText(/Ingresa usuario y contraseña/i)).toBeInTheDocument();
  });

  test('llama onLogin con token si login es exitoso', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' })
    });
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));
    await waitFor(() => expect(mockOnLogin).toHaveBeenCalledWith('test-token'));
  });

  test('muestra error si credenciales incorrectas', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    render(<Login onLogin={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));
    await waitFor(() => expect(screen.getByText(/Credenciales incorrectas/i)).toBeInTheDocument());
  });
});

describe('SearchTracks', () => {
  test('renderiza el buscador', () => {
    render(<SearchTracks />);
    expect(screen.getByPlaceholderText(/Nombre de canción/i)).toBeInTheDocument();
  });

  test('muestra error si busca sin criterios', () => {
    render(<SearchTracks />);
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));
    expect(screen.getByText(/Ingresa al menos un criterio/i)).toBeInTheDocument();
  });
});

describe('Purchase', () => {
  test('renderiza el formulario de compra', () => {
    render(<Purchase />);
    expect(screen.getByText(/Realizar Compra/i)).toBeInTheDocument();
  });
});
