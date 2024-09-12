import React, { useState } from 'react';

interface OltModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (olt: { nome: string; modelo: string; ip: string; porta: string; protocol: string; user: string; password: string; }) => void;
}

const OltModal: React.FC<OltModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [olt, setOlt] = useState({
    nome: '',
    modelo: '',
    ip: '',
    porta: '',
    protocol: '',
    user: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOlt({ ...olt, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(olt);
    onClose();
    setOlt({ nome: '', modelo: '', ip: '', porta: '', protocol: '', user: '', password: '' }); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Cadastrar OLT</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={olt.nome}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="modelo">Modelo</label>
            <input
              type="text"
              name="modelo"
              id="modelo"
              value={olt.modelo}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="ip">IP</label>
            <input
              type="text"
              name="ip"
              id="ip"
              value={olt.ip}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="porta">Porta</label>
            <input
              type="text"
              name="porta"
              id="porta"
              value={olt.porta}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="protocol">Protocolo</label>
            <input
              type="text"
              name="protocol"
              id="protocol"
              value={olt.protocol}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="user">Usuário</label>
            <input
              type="text"
              name="user"
              id="user"
              value={olt.user}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              value={olt.password}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="button" 
              className="mr-2 p-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OltModal;