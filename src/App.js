import { useState } from 'react';
import SearchTracks from './components/SearchTracks';
import Purchase from './components/Purchase';
import Login from './components/Login';

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: 'white',
    padding: '0 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '65px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { display: 'flex', gap: '8px', alignItems: 'center' },
  navBtn: (active) => ({
    padding: '8px 20px', borderRadius: '20px', border: 'none',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
    background: active ? '#ff9900' : 'rgba(255,255,255,0.1)',
    color: 'white', transition: 'all 0.2s'
  }),
  adminBtn: {
    padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
    background: 'transparent', color: 'white'
  },
  main: { padding: '30px', maxWidth: '1100px', margin: '0 auto' },
  adminBar: {
    background: '#1a1a2e', color: 'white', padding: '10px 30px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '14px'
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin && !token) {
    return <Login onLogin={(t) => { setToken(t); setShowLogin(false); setActiveTab('admin'); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Segoe UI, sans-serif' }}>
      {token && (
        <div style={styles.adminBar}>
          <span>👑 Modo Administrador activo</span>
          <button onClick={() => { setToken(null); setActiveTab('search'); }}
            style={{ background: 'transparent', border: '1px solid #ff9900', color: '#ff9900', padding: '4px 12px', borderRadius: '12px', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      )}

      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={{ fontSize: '28px' }}>🎵</span>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>Chinook Music Store</span>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navBtn(activeTab === 'search')} onClick={() => setActiveTab('search')}>
            🔍 Buscar
          </button>
          <button style={styles.navBtn(activeTab === 'purchase')} onClick={() => setActiveTab('purchase')}>
            🛒 Comprar
          </button>
          {token && (
            <button style={styles.navBtn(activeTab === 'admin')} onClick={() => setActiveTab('admin')}>
              👑 Admin
            </button>
          )}
          {!token && (
            <button style={styles.adminBtn} onClick={() => setShowLogin(true)}>
              🔐 Admin
            </button>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === 'search' && <SearchTracks />}
        {activeTab === 'purchase' && <Purchase />}
        {activeTab === 'admin' && token && <AdminPanel token={token} />}
      </main>
    </div>
  );
}

function AdminPanel({ token }) {
  return (
    <div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>👑 Panel de Administrador</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { icon: '🎵', label: 'Canciones', color: '#ff9900' },
          { icon: '👥', label: 'Clientes', color: '#3498db' },
          { icon: '🎤', label: 'Artistas', color: '#2ecc71' },
          { icon: '📀', label: 'Álbumes', color: '#9b59b6' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'white', borderRadius: '12px', padding: '25px',
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            borderTop: `4px solid ${item.color}`
          }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontWeight: '700', color: '#333' }}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '20px', background: 'white', borderRadius: '12px',
        padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <p style={{ color: '#666', margin: 0 }}>
          ✅ Token activo — sesión de administrador iniciada correctamente.
        </p>
      </div>
    </div>
  );
}

export default App;
