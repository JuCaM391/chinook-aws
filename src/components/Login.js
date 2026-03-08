import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Ingresa usuario y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://100.53.118.6:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError('Credenciales incorrectas');
        return;
      }
      const data = await res.json();
      onLogin(data.access_token);
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px' }}>🎵</div>
          <h2 style={{ color: '#1a1a2e', margin: '10px 0 5px' }}>Panel Administrador</h2>
          <p style={{ color: '#666', margin: 0 }}>Chinook Music Store</p>
        </div>

        {error && (
          <div style={{
            background: '#fee', border: '1px solid #fcc', borderRadius: '8px',
            padding: '10px', marginBottom: '20px', color: '#c00', textAlign: 'center'
          }}>{error}</div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333' }}>
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin"
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '2px solid #e0e0e0', fontSize: '16px', boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '2px solid #e0e0e0', fontSize: '16px', boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', background: loading ? '#ccc' : '#ff9900',
            border: 'none', borderRadius: '8px', fontSize: '16px',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            color: 'white', transition: 'background 0.2s'
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </div>
    </div>
  );
}

export default Login;
