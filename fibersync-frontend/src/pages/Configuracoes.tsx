import React from 'react';

const Configuracoes: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Configurações</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Aqui você pode ajustar as configurações do aplicativo conforme suas preferências.
      </p>
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Preferências do Usuário</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="theme">
              Tema
            </label>
            <select id="theme" className="border rounded w-full p-2">
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="language">
              Idioma
            </label>
            <select id="language" className="border rounded w-full p-2">
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
            </select>
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Salvar Configurações
          </button>
        </form>
      </div>
    </div>
  );
};

export default Configuracoes;