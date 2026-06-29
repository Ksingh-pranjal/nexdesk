const nodemailer = require('nodemailer');

//transporter = connection to the email server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS    
  }
});

const sendTicketEmail = async (toEmail, subject, message) => {
    try{
        await transporter.sendMail({
            from: `"NexDesk Support" <${process.env.Admin}>`,
            to: toEmail,
            subject,
            text: message
        });
        return { success: true };
    } catch (error){
        console.error('Email send failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendTicketEmail };