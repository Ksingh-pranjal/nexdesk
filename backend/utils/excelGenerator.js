const ExcelJS = require('exceljs');

//Genearte a ticket summary report as excel
const generateTicketReportExcel = async (tickets, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tickets');

    sheet.columns = [
        { header: '#', key: 'index', width: 6 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Type', key: 'type', width: 18 },
        { header: 'Priority', key: 'priority', width: 12 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Created By', key: 'createdBy', width: 22 },
        { header: 'Assigned To', key: 'assignedTo', width: 22 },
        { header: 'SLA Breach', key: 'slaBreach', width: 12 },
        { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    //Header ROW 
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E8FB'}
    };

    //Add one row per ticket
    tickets.forEach((ticket, index) => {
    sheet.addRow({
      index: index + 1,
      title: ticket.title,
      type: ticket.type,
      priority: ticket.priority || 'N/A',
      status: ticket.status,
      createdBy: ticket.createdBy?.name || 'Unknown',
      assignedTo: ticket.assignedTo?.name || 'Unassigned',
      slaBreach: ticket.slaBreach ? 'Yes' : 'No',
      createdAt: new Date(ticket.createdAt).toLocaleDateString()
    });
  });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=ticket-report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
};

module.exports = { generateTicketReportExcel };