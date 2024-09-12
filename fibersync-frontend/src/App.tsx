import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Olts from './pages/Olts'; 
import Home from './pages/Home';
import Configuracoes from './pages/Configuracoes';
import Sobre from './pages/Sobre';
import OltDetails from './pages/OltDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Menu Lateral */}
        <aside className="w-64 bg-gray-800 text-white p-5">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li className="mb-4">
                <Link to="/olts" className="hover:underline">OLTs</Link>
              </li>
              <li className="mb-4">
                <Link to="/configuracoes" className="hover:underline">Configurações</Link>
              </li>
              <li className="mb-4">
                <Link to="/sobre" className="hover:underline">Sobre</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/olts" element={<Olts />} />
            <Route path="/olt-details" element={<OltDetails />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;