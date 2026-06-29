import { useState, useEffect } from 'react';
import { Plus, FileText, Search } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const AdminContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchContracts();
    fetchClients();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await api.get('/contracts');
      setContracts(res.data);
    } catch (err) {
      setError('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/users/clients');
      setClients(res.data);
    } catch (err) {
      setError('Failed to load clients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('clientId', clientId);
    formData.append('file', file);

    try {
      await api.post('/contracts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setModalOpen(false);
      setTitle('');
      setClientId('');
      setFile(null);
      setError('');

      // Refresh contracts list
      fetchContracts();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  // Filter contracts by title, client name, or file name
  const filteredContracts = contracts.filter((c) => {
    const term = searchTerm.toLowerCase();

    return (
      c.title?.toLowerCase().includes(term) ||
      c.client?.name?.toLowerCase().includes(term) ||
      c.originalName?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <p className="text-sm text-gray-400">
        Loading contracts...
      </p>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium text-nextext">
          Contracts{' '}
          <span className="text-gray-400 font-normal">
            ({filteredContracts.length})
          </span>
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-nexdark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Plus size={15} />
          Upload Contract
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-md flex items-center gap-2 px-3 py-2 mb-4 max-w-sm">
        <Search size={15} className="text-gray-400" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contracts..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mb-4">
          {error}
        </p>
      )}

      {/* Contracts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">
                Title
              </th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">
                Client
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
            {filteredContracts.map((contract) => (
              <tr
                key={contract._id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-3.5 py-2.5 text-nextext">
                  {contract.title}
                </td>

                <td className="px-3.5 py-2.5 text-gray-500">
                  {contract.client?.name || '—'}
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
            ))}
          </tbody>
        </table>

        {filteredContracts.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No contracts found
          </p>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Contract"
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contract title"
            required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />

          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select client</option>

            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} — {client.company}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full mb-5 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium"
          >
            Upload
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminContracts;