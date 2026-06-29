import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const ClientTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');

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

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (!ticket) return <p className="text-sm text-gray-400">Ticket not found</p>;

  return (
    <div>
      <button onClick={() => navigate('/client')} className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
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
            <p className="font-medium text-nextext mb-3">Updates</p>
            <div className="flex flex-col gap-3 mb-4">
              {notes.map((note) => {
                // Distinguish client's own notes visually from engineer/admin notes
                const isClientNote = note.createdBy?.role === 'client';
                return (
                  <div
                    key={note._id}
                    className={`rounded-md p-3 ${isClientNote ? 'bg-nexaccent/5 border border-nexaccent/20' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-nextext">
                        {note.createdBy?.name} {isClientNote && '(You)'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{note.content}</p>
                  </div>
                );
              })}
              {notes.length === 0 && <p className="text-xs text-gray-400">No updates yet</p>}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button type="submit" className="bg-nexdark text-white px-4 py-2 rounded-md text-sm font-medium">
                Send
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <p className="text-sm font-medium text-nextext mb-4 capitalize">{ticket.status.replace('_', ' ')}</p>

            {ticket.priority && (
              <>
                <p className="text-xs text-gray-400 mb-1">Priority</p>
                <p className="text-sm font-medium text-nextext mb-4 capitalize">{ticket.priority}</p>
              </>
            )}

            <p className="text-xs text-gray-400 mb-1">Engineer</p>
            <p className="text-sm text-nextext">{ticket.assignedTo?.name || 'Not yet assigned'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTicketDetail;