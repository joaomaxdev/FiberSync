import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Table } from '../components/ui/table';
import OltModal from '../components/OltModal';
import oltsData from '../data/olts.json';

interface Olt {
  nome: string;
  modelo: string;
  ip: string;
  porta: string;
  protocol: string;
  user: string;
  password: string;
}

const Olts: React.FC = () => {
  const [olts, setOlts] = useState<Olt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setOlts(oltsData as Olt[]);
  }, []);

  const handleAddOlt = (newOlt: Olt) => {
    setOlts([...olts, newOlt]);
  };

  const handleDeleteOlt = (index: number) => {
    const updatedOlts = olts.filter((_, i) => i !== index);
    setOlts(updatedOlts);
  };

  const handleConfigureOlt = (olt: Olt) => {
    alert(`Configurando OLT: ${olt.nome}`);
  };

  const handleAccessOlt = (olt: Olt) => {
    alert(`Acessando OLT: ${olt.nome}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Modelos de OLTs</h1>
        <Button onClick={() => setIsModalOpen(true)}>Cadastrar OLT</Button>
      </header>

      <OltModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddOlt} 
      />

      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Modelo</th>
            <th>IP</th>
            <th>Porta</th>
            <th>Protocolo</th>
            <th>Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {olts.length > 0 ? (
            olts.map((olt, index) => (
              <tr key={index} className="hover:bg-gray-200">
                <td>{olt.nome}</td>
                <td>{olt.modelo}</td>
                <td>{olt.ip}</td>
                <td>{olt.porta}</td>
                <td>{olt.protocol}</td>
                <td>{olt.user}</td>
                <td className="flex space-x-2">
                  <Button onClick={() => handleAccessOlt(olt)} className="bg-[#22c55e] text-white" variant="link">Acessar</Button>
                  <Button onClick={() => handleConfigureOlt(olt)} variant="outline">Configurar</Button>
                  <Button onClick={() => handleDeleteOlt(index)} variant="destructive">Deletar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-500">Nenhuma OLT cadastrada.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Olts;