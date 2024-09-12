import React, { useState } from 'react';
import axios from 'axios';

const OltDetails: React.FC = () => {
  const [sn, setSn] = useState('');

  const handleOnuNaoAutorizadas = async () => {
    const response = await axios.get('/onus-nao-autorizadas');
    console.log(response.data.output);
  };

  const handlePesquisarOnu = async () => {
    const response = await axios.post('/pesquisar-onu', { sn });
    console.log(response.data.output);
  };

  return (
    <div>
      <h1>Detalhes da OLT</h1>
      
      <button onClick={handleOnuNaoAutorizadas}>
        ONUs Não Autorizadas
      </button>

      <div>
        <input
          type="text"
          value={sn}
          onChange={(e) => setSn(e.target.value)}
          placeholder="Digite o SN da ONU"
        />
        <button onClick={handlePesquisarOnu}>
          Pesquisar ONU por SN
        </button>
      </div>

      {/* Adicione outros botões ou opções conforme necessário */}
    </div>
  );
};

export default OltDetails;