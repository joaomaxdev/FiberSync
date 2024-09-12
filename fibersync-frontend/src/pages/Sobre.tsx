import React from 'react';

const Sobre: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Sobre o Gerenciador de OLTs</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Este aplicativo foi desenvolvido para facilitar o gerenciamento de OLTs,
        permitindo que os usuários cadastrem, visualizem e gerenciem suas OLTs de forma
        simples e eficiente. A interface é intuitiva e responsiva, garantindo uma
        ótima experiência em qualquer dispositivo.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Funcionalidades</h2>
      <ul className="list-disc pl-5 mb-6">
        <li>Cadastrar novas OLTs</li>
        <li>Visualizar lista de OLTs cadastradas</li>
        <li>Configurações personalizáveis</li>
      </ul>
      <p className="text-lg">
        Agradecemos pelo seu interesse e esperamos que você aproveite a experiência!
      </p>
    </div>
  );
};

export default Sobre;