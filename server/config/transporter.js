import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config().parsed; // Load environment variables from .env file


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587, // Default to 587 if not specified
  secure: false,
  logger: true,
  debug: true,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export default transporter;