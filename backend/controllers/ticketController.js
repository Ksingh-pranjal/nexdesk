const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
const { calculateSLADueTime, getRemainingTime } = require('../utils/slaHelper');
const { sendTicketEmail } = require('../utils/emailService');
const createTicket = async (req, res) => {
    const {
        title,
        description,
        type,
        priority,
        supportMode,
        technologyArea,
        issueType,
        team
    } = req.body;

    try {
        const slaDueTime = calculateSLADueTime(type, priority);
        const ticket = await Ticket.create({
            title,
            description,
            type,
            priority: priority || null,
            supportMode: supportMode || 'remote',
            technologyArea,
            issueType: issueType || 'other',
            team: team || null,
            createdBy: req.user._id,
            slaDueTime
        });
        res.status(201).json(ticket);
    } catch(error){
        res.status(500).json({  message: error.message });
    }
};

const getTickets = async (req, res) => {
    try{
        let query = {};

        if(req.user.role === 'client'){
            query.createdBy = req.user._id;
        } else if (req.user.role === 'engineer') {
            query.$or = [
                { assignedTo: req.user._id },
                { createdBy: req.user._id }
            ];
        }

        if(req.query.status) query.status = req.query.status;
        if(req.query.priority) query.priority = req.query.priority;
        if(req.query.type) query.type = req.query.type;

        const tickets = await Ticket.find(query)
            .populate('createdBy', 'name email company')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getTicketById = async (req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'name email company')
            .populate('assignedTo', 'name email');

        if(!ticket){
            return res.status(404).json({ message: 'Ticket not found'});
        }

        const slaStatus = getRemainingTime(ticket);

        res.json({ ...ticket.toObject(), slaStatus });
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

const updateTicketStatus = async (req, res) => {
    const { status } = req.body;

    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.status = status;

        if(status === 'closed'){
            const { isBreached } = getRemainingTime(ticket);
            ticket.slaBreach = isBreached;
        }
        await ticket.save();
        res.json(ticket);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const updateTicket = async (req, res) => {
    const allowedFields = [
        'title',
        'description',
        'issueType',
        'team',
        'supportMode',
        'technologyArea',
        'satisfactionComment'
    ];

    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if(req.user.role === 'client'){
            const clientAllowed = ['satisfactionComment'];
            Object.keys(req.body).forEach(key => {
                if(clientAllowed.includes(key)) ticket[key] = req.body[key];
            });
        } else {
            allowedFields.forEach(key => {
                if (req.body[key] !== undefined) ticket[key] = req.body[key];
            });
        }
        await ticket.save();
        res.json(ticket);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const assignTicket = async (req, res) => {
    const { engineerId } = req.body;

    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found'});

        ticket.assignedTo = engineerId;  

        if(ticket.status === 'open'){
            ticket.status = 'in_progress';
        }

        await ticket.save();

        const updated = await Ticket.findById(ticket._id)
            .populate('assignedTo', 'name email');

        res.json(updated);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

const pauseSLA = async (req, res) => {
    const { reason } = req.body;

    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if(ticket.slapaused){
            return res.status(400).json({ message: 'SLA is already paused' });
        }

        ticket.slapaused = true;
        ticket.slaPausedAt = new Date();
        ticket.slaPauseReason = reason;

        await ticket.save();
        res.json({ message: 'SLA paused', ticket });
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

const resumeSLA = async (req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if(!ticket.slapaused){
            return res.status(400).json({ message: 'SLA is not paused' });
        }

        const pauseDuration = Date.now() - ticket.slaPausedAt.getTime();
        ticket.totalPausedTime += pauseDuration;
        ticket.slapaused = false;
        ticket.slaPausedAt = null;
        ticket.slaPauseReason = null;

        await ticket.save();
        res.json({ message: 'SLA resumed', ticket });
    }catch(error){
        res.status(500).json({ message: error.messgae });
    }
};

const addNote = async (req, res) => {
    const { content } = req.body;
    try{
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const note = await Note.create({
            ticket: ticket._id,
            createdBy: req.user._id,
            content
        });

        const populated = await Note.findById(note._id)
            .populate('createdBy','name role');
        
        res.status(201).json(populated);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getNotes = async (req, res) => {
    try{
        const notes = await Note.find({ ticket: req.params.id })
            .populate('createdBy', 'name role')
            .sort({ createdAt: 1});

        res.json(notes);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────
// @desc    Update ticket priority
// @route   PATCH /api/tickets/:id/priority
// @access  Private (admin only)
// ─────────────────────────────────────────
const updatePriority = async (req, res) => {
  const { priority } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Priority only makes sense for incident tickets — same rule as creation
    if (ticket.type !== 'incident') {
      return res.status(400).json({
        message: 'Priority can only be changed for incident tickets'
      });
    }

    ticket.priority = priority;

    // Changing priority changes the SLA deadline too!
    // Recalculate it the same way we did on creation
    const { calculateSLADueTime } = require('../utils/slaHelper');
    ticket.slaDueTime = calculateSLADueTime(ticket.type, priority);

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const emailEndUser = async (req, res) => {
  const { message } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const subject = `Update on Ticket: ${ticket.title}`;
    const result = await sendTicketEmail(
      ticket.createdBy.email,
      subject,
      message
    );

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send email', error: result.error });
    }

    res.json({ message: 'Email sent to ' + ticket.createdBy.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicketStatus,
    updateTicket,      // ── NEW
    assignTicket,
    pauseSLA,
    resumeSLA,
    addNote,
    getNotes,
    updatePriority,
    emailEndUser
};