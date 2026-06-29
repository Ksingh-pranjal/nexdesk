const Ticket = require('../models/Ticket');
const { generateTicketReportPDF } = require('../utils/pdfGenerator');
const { generateTicketReportExcel } = require('../utils/excelGenerator');
const { generateJobCardPDF } = require('../utils/jobCardGenerator');

//get tickets filtered for report
const getReportTickets = async (req) => {
  let query = {};

  if (req.user.role === 'client') {
    query.createdBy = req.user._id;
  } else if (req.user.role === 'engineer') {
    query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
  }

  // Allow optional date range filtering: ?from=2026-01-01&to=2026-06-01
  if (req.query.from || req.query.to) {
    query.createdAt = {};
    if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
  }

  return Ticket.find(query)
    .populate('createdBy', 'name email company')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
};

//Download ticket report as PDF
const ticketReportPDF = async (req, res) => {
    try{
        const tickets = await getReportTickets(req);
        generateTicketReportPDF(tickets, res);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Download ticket report as Excel
const ticketReportExcel = async (req, res) => {
  try {
    const tickets = await getReportTickets(req);
    await generateTicketReportExcel(tickets, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//SLA Complience Report (JSON) ->only for admin
const slaComplianceReport = async (req, res) => {
    try{
        const tickets = await Ticket.find({
            type: { $in: ['incident', 'service_request', 'change_request'] }
        });

        const total = tickets.length;
        const breached = tickets.filter((t) => t.slaBreach).length;
        const onTime = total - breached;

        //breach count by priority - insight for admin
        const byPriority = { critical: 0, major: 0, minor: 0 };
        tickets.forEach((t) => {
            if(t.slaBreach && t.priority) byPriority[t.priority]++;
        });

        res.json({
            totalSupportTickets: total,
            onTime,
            breached,
            complianceRate: total > 0 ? ((onTime/ total) * 100).toFixed(1) + '%' : 'N/A',
            breachesByPriority: byPriority
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Download Job Card PDF for a specific ticket
const jobCardPDF = async(req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'name email company')
            .populate('assignedTo', 'name email');

        if(!ticket){
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const jobCardTypes = ['project_implementation', 'preventive_maintenance', 'site_survey'];
        if(!jobCardTypes.includes(ticket.type)){
            return res.status(400).json({
                message: 'Job cards are only available for Project, Preventive Maintenance, or Site Survey tickets'
            });
        }

        generateJobCardPDF(ticket, res);
    } catch( error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    ticketReportPDF,
    ticketReportExcel,
    slaComplianceReport,
    jobCardPDF
};