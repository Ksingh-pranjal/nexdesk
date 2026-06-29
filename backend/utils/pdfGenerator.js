const PDFDocument = require('pdfkit');

//generate a ticket summary report PDF
const generateTicketReportPDF = (tickets, res) => {
    const doc = new PDFDocument({ margin:40 });

    //Tell the browser this a a PDF file to download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; flename=ticket-report.pdf');

    //pipe() -> connects pdf doc. directly to HTTP response
    doc.pipe(res);

    // Header --------------------
    doc
     .fontSize(20)
     .fillColor('#1a73e8')
     .text('NexDesk - Ticket Report', { align: 'center' });

     doc
    .fontSize(10)
    .fillColor('#666')
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.moveDown(2);

    // ── TABLE HEADER ─────────────────────────
  const tableTop = doc.y;
  const colWidths = [40, 140, 80, 80, 80, 100]; // column widths in points
  const headers = ['#', 'Title', 'Type', 'Priority', 'Status', 'Created By'];

  let x = doc.page.margins.left;
  doc.fontSize(10).fillColor('#000');

  headers.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: colWidths[i], bold: true });
    x += colWidths[i];
  });

  doc
    .moveTo(doc.page.margins.left, tableTop + 15)
    .lineTo(doc.page.width - doc.page.margins.right, tableTop + 15)
    .stroke();

  //Table Rows 
  let y = tableTop + 25;

  tickets.forEach((ticket, index) => {
    if(y > doc.page.height - 100){
      doc.addPage();
      y = doc.page.margins.top;
    }

    x = doc.page.margins.left;
    const rowData = [
      String(index + 1),
      ticket.title,
      ticket.type,
      ticket.priority || 'N/A',
      ticket.statusx,
      ticket.createdBy?.name || 'Unknown'
    ];
    
    rowData.forEach((cell, i) => {
      doc.fontSize(9).text(cell, x, y, {width: colWidths[i] });
      x += colWidths[i];
    });

    y += 20;
  });

  //Footer
  doc.moveDown(2);
  doc.fontSize(9).fillColor('#999').text(`Total tickets: ${tickets.length}`,{
    align: 'right'
  });

  doc.end();
};

module.exports = { generateTicketReportPDF };