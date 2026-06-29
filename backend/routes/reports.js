const express = require('express');
const router = express.Router();
const {
  ticketReportPDF,
  ticketReportExcel,
  slaComplianceReport
} = require('../controllers/reportController');

const { protect, restrict } = require('../middleware/auth');

router.use(protect);

// Admin and client can download ticket reports (role-filtering happens inside)
router.get('/tickets/pdf', ticketReportPDF);
router.get('/tickets/excel', ticketReportExcel);

// SLA compliance is admin-only insight
router.get('/sla', restrict('admin'), slaComplianceReport);

module.exports = router;