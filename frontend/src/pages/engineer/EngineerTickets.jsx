import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const priorityStyles = {
  critical: 'bg-[#F1E4DF] text-[#7A4A38]',
  major: 'bg-[#FAEEDA] text-[#633806]',
  minor: 'bg-gray-100 text-gray-600',
};

const statusStyles = {
  open: 'bg-[#E7ECEF] text-[#45576A]',
  in_progress: 'bg-[#FAEEDA] text-[#633806]',
  resolved: 'bg-[#E6EBE6] text-[#54705A]',
  closed: 'bg-gray-100 text-gray-500',
};

const ticketTypes = [
  'incident', 'service_request', 'change_request', 'project_implementation',
  'preventive_maintenance', 'site_survey', 'sdm_activity'
];

const EngineerTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', type: 'incident', priority: 'minor',
    supportMode: 'remote'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.type !== 'incident') delete payload.priority;

      await api.post('/tickets', payload);
      setModalOpen(false);
      setForm({ title: '', description: '', type: 'incident', priority: 'minor', supportMode: 'remote' });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  // Same search pattern as Admin Tickets — filters across title, client, type
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.createdBy?.name?.toLowerCase().includes(term) ||
      t.createdBy?.company?.toLowerCase().includes(term) ||
      t.type.toLowerCase().includes(term)
    );
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const breachedCount = tickets.filter((t) => t.slaBreach).length;

  if (loading) return <p className="text-sm text-gray-400">Loading tickets...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium text-nextext">
          My tickets <span className="text-gray-400 font-normal">({filteredTickets.length})</span>
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-nexdark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1.5"
        >
          <Plus size={15} />
          New ticket
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md flex items-center gap-2 px-3 py-2 mb-4 max-w-sm">
        <Search size={15} className="text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, client or type..."
          className="text-sm outline-none flex-1"
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-lg px-3.5 py-3">
          <p className="text-xs text-gray-400 mb-1">Open</p>
          <p className="text-lg font-medium text-nextext">{openCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3.5 py-3">
          <p className="text-xs text-gray-400 mb-1">In progress</p>
          <p className="text-lg font-medium text-nextext">{inProgressCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3.5 py-3">
          <p className="text-xs text-gray-400 mb-1">SLA breached</p>
          <p className="text-lg font-medium text-[#A4654E]">{breachedCount}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Title</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Client</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Type</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Priority</th>
              <th className="text-left px-3.5 py-2.5 text-xs text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket._id}
                onClick={() => navigate(`/engineer/tickets/${ticket._id}`)}
                className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <td className="px-3.5 py-2.5 text-nextext">{ticket.title}</td>
                <td className="px-3.5 py-2.5 text-gray-500">{ticket.createdBy?.company || ticket.createdBy?.name}</td>
                <td className="px-3.5 py-2.5 text-gray-500 capitalize">{ticket.type.replace(/_/g, ' ')}</td>
                <td className="px-3.5 py-2.5">
                  {ticket.priority ? (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${priorityStyles[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-3.5 py-2.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTickets.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No tickets found</p>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New ticket">
        <form onSubmit={handleSubmit}>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="Title" required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Description" required rows={3}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            name="type" value={form.type} onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
          >
            {ticketTypes.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>

          {form.type === 'incident' && (
            <select
              name="priority" value={form.priority} onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
            >
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          )}

          <select
            name="supportMode" value={form.supportMode} onChange={handleChange}
            className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
          >
            <option value="remote">Remote</option>
            <option value="physical">Physical</option>
          </select>

          <button type="submit" className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium">
            Create ticket
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EngineerTickets;