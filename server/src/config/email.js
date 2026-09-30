import nodemailer from "nodemailer";
let transporter;
export default async function sendEmail(options) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)
    throw new Error("Email is not configured");
  transporter ||= nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
  return transporter.sendMail({
    from: `"ClickNCart" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
}
