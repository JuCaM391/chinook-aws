import { useState } from 'react';
import SearchTracks from './components/SearchTracks';
import Purchase from './components/Purchase';

function App() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div>
      <header style={{background:'#232f3e', color:'white', padding:'20px'}}>
        <h1>🎵 Chinook Music Store</h1>
        <nav>
          <button onClick={() => setActiveTab('search')}
            style={{margin:'5px', padding:'10px 20px', cursor:'pointer',
              background: activeTab==='search' ? '#ff9900' : '#fff'}}>
            Buscar Canciones
          </button>
          <button onClick={() => setActiveTab('purchase')}
            style={{margin:'5px', padding:'10px 20px', cursor:'pointer',
              background: activeTab==='purchase' ? '#ff9900' : '#fff'}}>
            Realizar Compra
          </button>
        </nav>
      </header>
      <main style={{padding:'20px'}}>
        {activeTab === 'search' && <SearchTracks />}
        {activeTab === 'purchase' && <Purchase />}
      </main>
    </div>
  );
}

export default App;
