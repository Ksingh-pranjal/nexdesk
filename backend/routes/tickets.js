const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  updateTicket,      
  assignTicket,
  pauseSLA,
  resumeSLA,
  addNote,
  getNotes,
  updatePriority,
  emailEndUser
} = require('../controllers/ticketController');

const { jobCardPDF } = require('../controllers/reportController');

const { protect, restrict } = require('../middleware/auth');

router.use(protect);

router.post('/', createTicket);

router.get('/', getTickets);

router.get('/:id', getTicketById);

router.patch('/:id', restrict('client', 'engineer', 'admin'), updateTicket);

router.patch('/:id/status', restrict('engineer', 'admin'), updateTicketStatus);

router.patch('/:id/assign', restrict('admin'), assignTicket);

router.patch('/:id/sla/pause', restrict('engineer', 'admin'), pauseSLA);
router.patch('/:id/sla/resume', restrict('engineer', 'admin'), resumeSLA);

router.post('/:id/notes', addNote);
router.get('/:id/notes', getNotes);

router.get('/:id/jobcard', jobCardPDF);
router.patch('/:id/priority', restrict('admin'), updatePriority);
router.post('/:id/email', restrict('engineer', 'admin'), emailEndUser);

module.exports = router;
