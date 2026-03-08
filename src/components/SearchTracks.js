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
    } catch (e) {
      setError('Error al buscar canciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Canciones</h2>
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'20px'}}>
        <input placeholder="Nombre de canción" value={name}
          onChange={e => setName(e.target.value)}
          style={{padding:'8px', fontSize:'16px'}} />
        <input placeholder="Artista" value={artist}
          onChange={e => setArtist(e.target.value)}
          style={{padding:'8px', fontSize:'16px'}} />
        <input placeholder="Género" value={genre}
          onChange={e => setGenre(e.target.value)}
          style={{padding:'8px', fontSize:'16px'}} />
        <button onClick={handleSearch}
          style={{padding:'8px 20px', background:'#ff9900', border:'none', cursor:'pointer', fontSize:'16px'}}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      {error && <p style={{color:'red'}}>{error}</p>}
      {tracks.length > 0 && (
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#232f3e', color:'white'}}>
              <th style={{padding:'10px'}}>ID</th>
              <th style={{padding:'10px'}}>Canción</th>
              <th style={{padding:'10px'}}>Precio</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(t => (
              <tr key={t.TrackId} style={{borderBottom:'1px solid #ddd'}}>
                <td style={{padding:'10px'}}>{t.TrackId}</td>
                <td style={{padding:'10px'}}>{t.Name}</td>
                <td style={{padding:'10px'}}>${t.UnitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchTracks;
