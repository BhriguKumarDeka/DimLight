const nodemailer = require("nodemailer");
const getEmailTemplate = require("./emailTemplate");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

const sendEmail = async (options) => {
  try{
  const htmlContent = getEmailTemplate(
    options.title || options.subject, 
    options.message,                  
    options.actionUrl,                
    options.actionText                // (Optional) Button Text
  );

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(message);
  console.log("Message sent:", info.messageId);
  return info;
}catch(error){
  console.error("Welcome email failed:", error);
  throw error;
}
};

module.exports = sendEmail;