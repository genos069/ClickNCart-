import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Missing email credentials in environment variables");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("Mail server connection failed:", error.message);
  } else {
    console.log("Mail server is ready to send emails");
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"SmartShop" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;