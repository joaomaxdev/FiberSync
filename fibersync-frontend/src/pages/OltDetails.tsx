import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UnauthorizedOnusResponse {
  "onus nao autorizadas": string[];
}

const OltDetails: React.FC = () => {
  const [unauthorizedOnus, setUnauthorizedOnus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUnauthorizedOnus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<UnauthorizedOnusResponse>('http://127.0.0.1:5000/api/onus-nao-autorizadas');
      console.log(response.data);
      setUnauthorizedOnus(response.data["onus nao autorizadas"] || []);
    } catch (err) {
      setError('Erro ao buscar ONUs não autorizadas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnauthorizedOnus();
  }, []);

  const parseDetails = (details: string) => {
    // Remove espaços em branco e divide a string
    const parts = details.trim().split(/\s+/);
    if (parts.length === 4) {
      const gpon = parts[0].replace('gpon_olt-1/', '');
      const [slot, pon] = gpon.split('/');
      const vendor = parts[1];
      const serialNumber = parts[2];
      const password = parts[3];
      return { slot, pon, vendor, serialNumber, password };
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Detalhes da OLT</h1>
      {loading && <p className="italic text-gray-600 text-center">Carregando ONUs não autorizadas...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {unauthorizedOnus.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-700">ONUs Não Autorizadas:</h2>
          <table className="min-w-full mt-2 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Slot</th>
                <th className="px-4 py-2 border">PON</th>
                <th className="px-4 py-2 border">Fornecedor</th>
                <th className="px-4 py-2 border">Número de Série</th>
                <th className="px-4 py-2 border">Senha</th>
              </tr>
            </thead>
            <tbody>
              {unauthorizedOnus.map((onu, index) => {
                const details = parseDetails(onu);
                return details ? (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 border">{details.slot}</td>
                    <td className="px-4 py-2 border">{details.pon}</td>
                    <td className="px-4 py-2 border">{details.vendor}</td>
                    <td className="px-4 py-2 border">{details.serialNumber}</td>
                    <td className="px-4 py-2 border">{details.password}</td>
                  </tr>
                ) : (
                  <tr key={index} className="border-b">
                    <td colSpan={5} className="px-4 py-2 text-center">Dados inválidos</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OltDetails;