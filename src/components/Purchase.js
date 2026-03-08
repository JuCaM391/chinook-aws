import { useState } from 'react';
import { getTracks, purchase } from '../api';

function Purchase() {
  const [customerId, setCustomerId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [trackInfo, setTrackInfo] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchTrack = async () => {
    if (!trackId) { setError('Ingresa un ID de canción'); return; }
    setError('');
    try {
      const res = await getTracks({ name: '' });
      const track = res.data.find(t => t.TrackId === parseInt(trackId));
      if (track) setTrackInfo(track);
      else setError('Canción no encontrada');
    } catch {
      setError('Error al buscar la canción');
    }
  };

  const handlePurchase = async () => {
    if (!customerId) { setError('Ingresa tu ID de cliente'); return; }
    if (!trackInfo) { setError('Primero busca una canción'); return; }
    setError('');
    setLoading(true);
    try {
      await purchase({
        CustomerId: parseInt(customerId),
        items: [{ TrackId: trackInfo.TrackId, Quantity: 1 }]
      });
      setSuccess(`¡Compra exitosa! "${trackInfo.Name}" por $${trackInfo.UnitPrice}`);
      setTrackInfo(null);
      setTrackId('');
    } catch {
      setError('Error al realizar la compra. Verifica tu ID de cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>🛒 Realizar Compra</h2>

      <div style={{
        background: 'white', borderRadius: '12px', padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)', maxWidth: '550px'
      }}>
        {success && (
          <div style={{
            background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px',
            padding: '14px', marginBottom: '20px', color: '#2e7d32', fontWeight: '600'
          }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{
            background: '#fee', border: '1px solid #fcc', borderRadius: '8px',
            padding: '14px', marginBottom: '20px', color: '#c00'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>👤 ID de Cliente</label>
          <input type="number" value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            placeholder="Ej: 1"
            style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>🎵 ID de Canción</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" value={trackId}
              onChange={e => setTrackId(e.target.value)}
              placeholder="Ej: 1"
              style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleSearchTrack} style={searchBtnStyle}>
              Buscar
            </button>
          </div>
        </div>

        {trackInfo && (
          <div style={{
            background: '#f0f7ff', border: '1px solid #b3d4f5', borderRadius: '8px',
            padding: '16px', marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#1a1a2e' }}>
              🎵 {trackInfo.Name}
            </p>
            <p style={{ margin: 0, color: '#ff9900', fontWeight: '700', fontSize: '18px' }}>
              ${trackInfo.UnitPrice}
            </p>
          </div>
        )}

        <button onClick={handlePurchase} disabled={loading} style={{
          width: '100%', padding: '14px', background: loading ? '#ccc' : '#ff9900',
          border: 'none', borderRadius: '8px', fontSize: '16px',
          fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', color: 'white'
        }}>
          {loading ? '⏳ Procesando...' : '🛒 Confirmar Compra'}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0',
  fontSize: '15px', width: '100%', boxSizing: 'border-box', outline: 'none'
};

const labelStyle = {
  display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333'
};

const searchBtnStyle = {
  padding: '12px 16px', background: '#1a1a2e', border: 'none',
  borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600'
};

export default Purchase;
