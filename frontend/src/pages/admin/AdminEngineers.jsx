import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const AdminEngineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const res = await api.get('/users/engineers');
      setEngineers(res.data);
    } catch (err) {
      setError('Failed to load engineers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/engineers', form);
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', phone: '' });
      fetchEngineers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create engineer');
    }
  };

  // Filter across name, email, and phone
  const filteredEngineers = engineers.filter((eng) => {
    const term = searchTerm.toLowerCase();
    return (
      eng.name.toLowerCase().includes(term) ||
      eng.email.toLowerCase().includes(term) ||
      eng.phone?.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-sm text-gray-400">Loading engineers...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium text-nextext">
          Engineers <span className="text-gray-400 font-normal">({filteredEngineers.length})</span>
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-nexdark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Plus size={15} />
          Add engineer
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md flex items-center gap-2 px-3 py-2 mb-4 max-w-sm">
        <Search size={15} className="text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search engineers..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Name</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Email</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Phone</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEngineers.map((eng) => (
              <tr key={eng._id} className="border-b border-gray-100 last:border-0">
                <td className="px-3.5 py-2.5 text-nextext">{eng.name}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{eng.email}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{eng.phone || '—'}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    eng.isActive ? 'bg-[#E6EBE6] text-[#54705A]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {eng.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEngineers.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No engineers found</p>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add engineer">
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
            name="phone" value={form.phone} onChange={handleChange}
            placeholder="Phone"
            className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium"
          >
            Create engineer
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEngineers;