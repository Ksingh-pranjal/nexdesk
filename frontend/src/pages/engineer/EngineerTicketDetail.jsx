import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const pauseReasons = ['rma', 'waiting_for_client', 'client_dependency'];

const EngineerTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState('rma');

  useEffect(() => {
    fetchTicket();
    fetchNotes();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    const res = await api.get(`/tickets/${id}/notes`);
    setNotes(res.data);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await api.post(`/tickets/${id}/notes`, { content: noteText });
    setNoteText('');
    fetchNotes();
  };

  const handleStatusChange = async (newStatus) => {
    await api.patch(`/tickets/${id}/status`, { status: newStatus });
    fetchTicket();
  };

  const handlePauseSLA = async (e) => {
    e.preventDefault();
    await api.patch(`/tickets/${id}/sla/pause`, { reason: pauseReason });
    setPauseModalOpen(false);
    fetchTicket();
  };

  const handleResumeSLA = async () => {
    await api.patch(`/tickets/${id}/sla/resume`);
    fetchTicket();
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (!ticket) return <p className="text-sm text-gray-400">Ticket not found</p>;

  // hasSLA tells us if this ticket type even has an SLA at all
  // (project/PM/site survey tickets have slaDueTime: null)
  const hasSLA = !!ticket.slaDueTime;

  return (
    <div>
      <button onClick={() => navigate('/engineer')} className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <ArrowLeft size={15} />
        Back to my tickets
      </button>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <p className="text-xs text-gray-400 mb-1">#{ticket._id.slice(-6).toUpperCase()}</p>
            <h1 className="text-lg font-medium text-nextext mb-2">{ticket.title}</h1>
            <p className="text-sm text-gray-600">{ticket.description}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="font-medium text-nextext mb-3">Notes</p>
            <div className="flex flex-col gap-3 mb-4">
              {notes.map((note) => (
                <div key={note._id} className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-nextext">{note.createdBy?.name}</span>
                    <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-gray-400">No notes yet</p>}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button type="submit" className="bg-nexdark text-white px-4 py-2 rounded-md text-sm font-medium">
                Add
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* SLA pause/resume — only shown for ticket types that actually have an SLA */}
            {hasSLA && (
              <div className="mb-2">
                <p className="text-xs text-gray-400 mb-1">SLA</p>
                {ticket.slapaused ? (
                  <div>
                    <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md mb-2 capitalize">
                      Paused — {ticket.slaPauseReason?.replace(/_/g, ' ')}
                    </p>
                    <button
                      onClick={handleResumeSLA}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-nextext"
                    >
                      <Play size={15} />
                      Resume SLA
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPauseModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-nextext"
                  >
                    <Pause size={15} />
                    Pause SLA
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs text-gray-400 mb-1">Client</p>
            <p className="text-sm text-nextext mb-3">{ticket.createdBy?.name}</p>
            <p className="text-xs text-gray-400 mb-1">Company</p>
            <p className="text-sm text-nextext">{ticket.createdBy?.company || '—'}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={pauseModalOpen} onClose={() => setPauseModalOpen(false)} title="Pause SLA">
        <form onSubmit={handlePauseSLA}>
          <select
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
          >
            {pauseReasons.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button type="submit" className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium">
            Pause
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EngineerTicketDetail;