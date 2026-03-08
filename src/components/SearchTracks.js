import { useState } from 'react';
import { getTracks } from '../api';

function SearchTracks() {
  const [tracks, setTracks] = useState([]);
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!name && !artist && !genre) {
      setError('Ingresa al menos un criterio de búsqueda');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await getTracks({ name, artist, genre });
      setTracks(res.data);
      if (res.data.length === 0) setError('No se encontraron canciones');
    } catch {
      setError('Error al buscar canciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>🔍 Buscar Canciones</h2>

      <div style={{
        background: 'white', borderRadius: '12px', padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <input placeholder="🎵 Nombre de canción" value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle} />
          <input placeholder="🎤 Artista" value={artist}
            onChange={e => setArtist(e.target.value)}
            style={inputStyle} />
          <input placeholder="🎸 Género" value={genre}
            onChange={e => setGenre(e.target.value)}
            style={inputStyle} />
        </div>
        <button onClick={handleSearch} disabled={loading} style={btnStyle}>
          {loading ? '⏳ Buscando...' : '🔍 Buscar'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '12px', color: '#c00', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {tracks.length > 0 && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Canción</th>
                <th style={thStyle}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t, i) => (
                <tr key={t.TrackId} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', transition: 'background 0.2s' }}>
                  <td style={tdStyle}>{t.TrackId}</td>
                  <td style={tdStyle}>{t.Name}</td>
                  <td style={{ ...tdStyle, color: '#ff9900', fontWeight: '700' }}>${t.UnitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', background: '#f5f7fa', color: '#666', fontSize: '14px' }}>
            {tracks.length} resultado(s) encontrado(s)
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0',
  fontSize: '15px', width: '100%', boxSizing: 'border-box', outline: 'none'
};

const btnStyle = {
  padding: '12px 30px', background: '#ff9900', border: 'none',
  borderRadius: '8px', fontSize: '15px', fontWeight: '700',
  cursor: 'pointer', color: 'white'
};

const thStyle = { padding: '14px 16px', textAlign: 'left', fontWeight: '600' };
const tdStyle = { padding: '12px 16px', borderBottom: '1px solid #f0f0f0' };

export default SearchTracks;
