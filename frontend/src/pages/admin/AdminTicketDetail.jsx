import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Mail, UserCog, Flag } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const jobCardTypes = ['project_implementation', 'preventive_maintenance', 'site_survey'];

const AdminTicketDetail = () => {
    //useParams() reads the :id part of the URL — e.g. /admin/tickets/68a3f... gives us { id: "68a3f..." }
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [notes, setNotes] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [noteText, setNoteText] = useState('');
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedEngineer, setSelectedEngineer] = useState('');
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    
    useEffect(() => {
        fetchTicket();
        fetchNotes();
        fetchEngineers();
    }, [id]);

    const fetchTicket = async () => {
        try{
            const res = await api.get(`/tickets/${id}`);
            setTicket(res.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    const fetchNotes = async () => {
        const res = await api.get(`/tickets/${id}/notes`);
        setNotes(res.data);
    };

    const fetchEngineers = async () => {
        const res = await api.get('/users/engineers');
        setEngineers(res.data);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if(!noteText.trim()) return;
        await api.post(`/tickets/${id}/notes`, { content: noteText });
        setNoteText('');
        fetchNotes();
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        await api.patch(`/tickets/${id}/assign`, { engineerId: selectedEngineer });
        setAssignModalOpen(false);
        fetchTicket();
    };
    
    const handlePriorityChange = async (newPriority) => {
        await api.patch(`/tickets/${id}/priority`, { priority: newPriority });
        fetchTicket();
    };

    const handleStatusChange = async (newStatus) => {
        await api.patch(`/tickets/${id}/status`, { status: newStatus });
        fetchTicket();
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        try{
            await api.post(`/tickets/${id}/email`, { message: emailMessage });
            setEmailModalOpen(false);
            setEmailMessage('');
            alert('Email sent to client');
        }catch(err){
            alert(err.response?.data?.message || 'Failed to send email');
        }
    };

    const downloadJobCard = async () => {
        try{
            const response = await api.get(`/tickets/${id}/jobcard`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jobcard-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }catch(err){
            alert('Failed to download job card');
        }
    };

    if(loading) return <p className="text-sm text-gray-400">Loading ticket...</p>;
    if(!ticket) return <p className="text-sm text-gray-400">Ticket not found</p>;

    return(
        <div>
            {/* Back button */}
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <ArrowLeft size={15} />
                Back to tickets
            </button>

            <div className="grid grid-cols-3 gap-5">

                {/* ── Left: Main ticket info + notes ── */}
                <div className="col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
                    <p className="text-xs text-gray-400 mb-1">#{ticket._id.slice(-6).toUpperCase()}</p>
                    <h1 className="text-lg font-medium text-nextext mb-2">{ticket.title}</h1>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                </div>

                {/* Notes thread */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <p className="font-medium text-nextext mb-3">Notes</p>

                    <div className="flex flex-col gap-3 mb-4">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-nextext">{note.createdBy?.name}</span>
                            <span className="text-[10px] text-gray-400">
                            {new Date(note.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{note.content}</p>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <p className="text-xs text-gray-400">No notes yet</p>
                    )}
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

                {/* ── Right: Sidebar with actions ── */}
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

                    {/* Priority only editable for incidents */}
                    {ticket.type === 'incident' && (
                    <>
                        <p className="text-xs text-gray-400 mb-1">Priority</p>
                        <select
                        value={ticket.priority || ''}
                        onChange={(e) => handlePriorityChange(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm capitalize"
                        >
                        <option value="critical">Critical</option>
                        <option value="major">Major</option>
                        <option value="minor">Minor</option>
                        </select>
                    </>
                    )}

                    <p className="text-xs text-gray-400 mb-1">Engineer</p>
                    <p className="text-sm text-nextext mb-4">{ticket.assignedTo?.name || 'Unassigned'}</p>

                    <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setAssignModalOpen(true)}
                        className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-nextext"
                    >
                        <UserCog size={15} />
                        Re-assign
                    </button>

                    <button
                        onClick={() => setEmailModalOpen(true)}
                        className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-nextext"
                    >
                        <Mail size={15} />
                        Email client
                    </button>

                    {/* Job card button ONLY shows for the 3 relevant ticket types */}
                    {jobCardTypes.includes(ticket.type) && (
                        <button
                        onClick={downloadJobCard}
                        className="flex items-center justify-center gap-2 bg-nexdark text-white rounded-md py-2 text-sm font-medium"
                        >
                        <Download size={15} />
                        Download job card
                        </button>
                    )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <p className="text-xs text-gray-400 mb-1">Client</p>
                    <p className="text-sm text-nextext mb-3">{ticket.createdBy?.name}</p>
                    <p className="text-xs text-gray-400 mb-1">Company</p>
                    <p className="text-sm text-nextext">{ticket.createdBy?.company || '—'}</p>
                </div>
                </div>
            </div>

            {/* Re-assign Modal */}
            <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Re-assign engineer">
                <form onSubmit={handleAssign}>
                <select
                    value={selectedEngineer}
                    onChange={(e) => setSelectedEngineer(e.target.value)}
                    required
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                    <option value="">Select engineer</option>
                    {engineers.map((eng) => (
                    <option key={eng._id} value={eng._id}>{eng.name}</option>
                    ))}
                </select>
                <button type="submit" className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium">
                    Assign
                </button>
                </form>
            </Modal>

            {/* Email Modal */}
            <Modal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Email client">
                <form onSubmit={handleSendEmail}>
                <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                    required
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button type="submit" className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium">
                    Send email
                </button>
                </form>
            </Modal>
            </div>
    );
};

export default AdminTicketDetail;