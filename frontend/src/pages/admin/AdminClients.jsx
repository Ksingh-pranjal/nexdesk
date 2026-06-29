import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { Search } from 'lucide-react';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state — one object holding all form fields together
  // Simpler than 5 separate useState calls for 5 fields
  const [form, setForm] = useState({
    name: '', email: '', password: '', company: '', site: '', phone: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/users/clients');
      setClients(res.data);
    } catch (err) {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Generic change handler — works for ANY input because it reads
  // the input's "name" attribute to know which field to update
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/clients', form);
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', company: '', site: '', phone: '' });
      fetchClients(); // refresh the list to show the new client
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create client');
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-sm text-gray-400">Loading clients...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium text-nextext">
          Clients <span className="text-gray-400 font-normal">({clients.length})</span>
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-nexdark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Plus size={15} />
          Add client
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md flex items-center gap-2 px-3 py-2 mb-4 max-w-sm">
        <Search size={15} className="text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search clients..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Name</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Company</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Site</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Email</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client._id} className="border-b border-gray-100 last:border-0">
                <td className="px-3.5 py-2.5 text-nextext">{client.name}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{client.company || '—'}</td>
                <td className="px-3.5 py-2.5 text-gray-500 capitalize">{client.site || '—'}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{client.email}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    client.isActive ? 'bg-[#E6EBE6] text-[#54705A]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {client.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No clients yet</p>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add client">
        <form onSubmit={handleSubmit}>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Full name" required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="Email" required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="Temporary password" required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            name="company" value={form.company} onChange={handleChange}
            placeholder="Company"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            name="site" value={form.site} onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select site</option>
            <option value="kenya">Kenya</option>
            <option value="tanzania">Tanzania</option>
            <option value="uganda">Uganda</option>
            <option value="rwanda">Rwanda</option>
          </select>
          <input
            name="phone" value={form.phone} onChange={handleChange}
            placeholder="Phone"
            className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium"
          >
            Create client
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminClients;