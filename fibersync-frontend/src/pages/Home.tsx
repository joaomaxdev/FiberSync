import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-gray-900">Bem-vindo ao FiberSync</h1>
        <p className="mt-2 text-lg text-gray-600">
          Gerencie suas OLTs de forma eficiente e intuitiva.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <Link to="/olts" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-800">OLTs</h2>
          <p className="mt-2 text-gray-600">Visualize e gerencie suas OLTs cadastradas.</p>
        </Link>
        <Link to="/configuracoes" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-800">Configurações</h2>
          <p className="mt-2 text-gray-600">Ajuste suas preferências do sistema.</p>
        </Link>
        <Link to="/sobre" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-800">Sobre</h2>
          <p className="mt-2 text-gray-600">Saiba mais sobre o FiberSync e sua finalidade.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;