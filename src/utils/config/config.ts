// import nodemailer from 'nodemailer';

// const mailTransporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST || 'smtp.example.com',
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.SMTP_USER || 'your_email@example.com',
//         pass: process.env.SMTP_PASS || 'your_email_password',
//     },
// });

// export default mailTransporter;
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables

const config = {
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'your_email@example.com',
        pass: process.env.SMTP_PASS || 'your_email_password',
      },
    },
    from: process.env.SMTP_USER,
  },
  clientUrl: process.env.FRONTEND_URL || 'http://localhost:3000/api/v1',
};

export default config;
