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
      setSuccess(`✅ Compra exitosa! "${trackInfo.Name}" por $${trackInfo.UnitPrice}`);
      setTrackInfo(null);
      setTrackId('');
    } catch {
      setError('❌ Error al realizar la compra. Verifica tu ID de cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:'500px'}}>
      <h2>Realizar Compra</h2>
      {success && <p style={{color:'green', fontWeight:'bold'}}>{success}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div style={{marginBottom:'15px'}}>
        <label>ID de Cliente:</label><br/>
        <input type="number" value={customerId}
          onChange={e => setCustomerId(e.target.value)}
          placeholder="Ej: 1"
          style={{padding:'8px', fontSize:'16px', width:'100%'}} />
      </div>
      <div style={{marginBottom:'15px'}}>
        <label>ID de Canción:</label><br/>
        <div style={{display:'flex', gap:'10px'}}>
          <input type="number" value={trackId}
            onChange={e => setTrackId(e.target.value)}
            placeholder="Ej: 1"
            style={{padding:'8px', fontSize:'16px', flex:1}} />
          <button onClick={handleSearchTrack}
            style={{padding:'8px 15px', background:'#232f3e', color:'white', border:'none', cursor:'pointer'}}>
            Buscar
          </button>
        </div>
      </div>
      {trackInfo && (
        <div style={{background:'#f0f0f0', padding:'15px', borderRadius:'5px', marginBottom:'15px'}}>
          <p><strong>Canción:</strong> {trackInfo.Name}</p>
          <p><strong>Precio:</strong> ${trackInfo.UnitPrice}</p>
        </div>
      )}
      <button onClick={handlePurchase} disabled={loading}
        style={{padding:'10px 30px', background:'#ff9900', border:'none',
          cursor:'pointer', fontSize:'16px', width:'100%'}}>
        {loading ? 'Procesando...' : 'Comprar'}
      </button>
    </div>
  );
}

export default Purchase;
