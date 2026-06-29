const PDFDocument = require('pdfkit');

//Generate a job card for project/ PM / Site Survey tcikets
const generateJobCardPDF = (ticket, res) => { 
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `attachemnt; filename=jobcard-${ticket._id}.pdf`
    );

    doc.pipe(res);

    //Company-header
    doc
     .fontSize(18)
     .fillColor('#000')
     .text('COPY CAT GROUP', { align: 'center' });

    doc
     .fontSize(14)
     .fillColor('#444')
     .text('Service Jobsheet', { align: 'center' });

    doc.moveDown(1);

    doc
     .fontSize(10)
     .fillColor('#000')
     .text(`Ticket ID: ${ticket._id}`, { align: 'right' });

    doc.moveDown(1);

    const printField = (label, value) => {
        doc.fontSize(10).fillColor('#666').text(label, { continued: true });
        doc.fillColor('#000').text(`  ${value || '-'}`);
    };

    // ── JOB DETAILS ───────────────────────────
    printField('Job Type:', ticket.type);
    printField('Date Logged:', new Date(ticket.createdAt).toLocaleDateString());
    printField('Engineer:', ticket.assignedTo?.name);
    doc.moveDown(0.5);

    // ── CUSTOMER DETAILS ──────────────────────
    printField('Customer Name:', ticket.createdBy?.company);
    printField('Contact:', ticket.createdBy?.name);
    printField('Email:', ticket.createdBy?.email);
    doc.moveDown(0.5);

    // ── ITEM DETAILS (from jobCard sub-object) ──
    printField('Item:', ticket.jobCard?.item);
    printField('Make & Model:', ticket.jobCard?.makeModel);
    printField('Serial Number:', ticket.jobCard?.serialNumber);
    printField('Asset Number:', ticket.jobCard?.assetNumber);
    doc.moveDown(0.5);

    // ── SUMMARY ────────────────────────────────
    doc.fontSize(10).fillColor('#666').text('Summary / Details:');
    doc.fontSize(10).fillColor('#000').text(ticket.description, {
        width: 500
    });
    doc.moveDown(0.5);

    // ── TECHNICIAN FINDINGS ───────────────────
    doc.fontSize(10).fillColor('#666').text("Technician's Findings:");
    doc
        .fontSize(10)
        .fillColor('#000')
        .text(ticket.jobCard?.technicianFindings || 'Pending', { width: 500 });
    doc.moveDown(0.5);

     // ── WORK TIMING ────────────────────────────
    printField('Work Date:', ticket.jobCard?.workDate
        ? new Date(ticket.jobCard.workDate).toLocaleDateString()
        : null);
    printField('Arrival Time:', ticket.jobCard?.arrivalTime);
    printField('Finish Time:', ticket.jobCard?.finishTime);
    printField('Travel Time:', ticket.jobCard?.travelTime);

    doc.moveDown(2);

    // ── SIGNATURE LINES (blank — for printed signing) ──
    doc.fontSize(9).fillColor('#999');
    doc.text('Engineer Signature: ____________________', { continued: false });
    doc.moveDown(1);
    doc.text('Customer Signature: ____________________');

    doc.end();
};

module.exports = { generateJobCardPDF };