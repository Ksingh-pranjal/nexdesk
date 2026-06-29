import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../../api/axios';

const ClientContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      // Backend already filters contracts for logged-in clients
      const res = await api.get('/contracts');
      setContracts(res.data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-400">
        Loading contracts...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-nextext mb-5">
        Contracts{' '}
        <span className="text-gray-400 font-normal">
          ({contracts.length})
        </span>
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">
                Title
              </th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">
                File
              </th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">
                Uploaded
              </th>
            </tr>
          </thead>

          <tbody>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <tr
                  key={contract._id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-3.5 py-2.5 text-nextext">
                    {contract.title}
                  </td>

                  <td className="px-3.5 py-2.5">
                    <a
                      href={`http://localhost:5000${contract.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nexaccent hover:underline flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      {contract.originalName}
                    </a>
                  </td>

                  <td className="px-3.5 py-2.5 text-gray-500">
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-sm text-gray-400 py-8"
                >
                  No contracts uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientContracts;