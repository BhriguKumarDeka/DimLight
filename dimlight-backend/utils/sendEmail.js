const nodemailer = require("nodemailer");
const getEmailTemplate = require("./emailTemplate");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true, // Use SSL/TLS
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const htmlContent = getEmailTemplate(
    options.title || options.subject, // Title inside the card
    options.message,                  // The main text
    options.actionUrl,                // (Optional) Button Link
    options.actionText                // (Optional) Button Text
  );

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: htmlContent,
    // Optional: Add HTML for prettier emails later
    // html: options.html 
  };

  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;