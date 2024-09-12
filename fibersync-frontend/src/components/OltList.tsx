import React, { useState, useEffect } from 'react';
import OltModal from '../components/OltModal';
import OltList from '../components/OltList';
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

  return (
    <div>
      <h1>Modelos de OLTs</h1>
      <button onClick={() => setIsModalOpen(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Cadastrar OLT
      </button>
      <OltModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddOlt} />
      <OltList olts={olts} />
    </div>
  );
};

export default Olts;