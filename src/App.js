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
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://52.90.133.140:8000/invoices/');
      const data = await res.json();
      setInvoices(data);
    } catch {
      setError('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>👑 Panel de Administrador</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
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

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#1a1a2e' }}>🧾 Compras realizadas</h3>
          <button onClick={loadInvoices} disabled={loading} style={{
            padding: '8px 20px', background: '#ff9900', border: 'none',
            borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer'
          }}>
            {loading ? 'Cargando...' : 'Cargar compras'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {invoices.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.InvoiceId} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '12px' }}>{inv.InvoiceId}</td>
                  <td style={{ padding: '12px' }}>{inv.CustomerId}</td>
                  <td style={{ padding: '12px' }}>{new Date(inv.InvoiceDate).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#ff9900', fontWeight: '700' }}>${inv.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {invoices.length === 0 && !loading && (
          <p style={{ color: '#666', textAlign: 'center' }}>Haz clic en "Cargar compras" para ver las facturas</p>
        )}
      </div>
    </div>
  );
}

export default App;
