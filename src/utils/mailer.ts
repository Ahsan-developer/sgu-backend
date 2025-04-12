// mailer.ts
import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Replace with the email service you're using (e.g., Gmail, SendGrid, etc.)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });
};

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: subject,
    text: text,
    html: html, // Optional HTML body (useful for HTML emails)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipient}`);
  } catch (error) {
    console.error(`Error sending email to ${recipient}:`, error);
  }
};
