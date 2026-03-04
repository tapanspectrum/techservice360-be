import * as nodemailer from 'nodemailer';
import config from '../../config/config';
import { Message } from './email.interfaces';
import { createLogger } from 'src/utils/loggers/logger.config';
import * as path from 'path';
import * as ejs from 'ejs';
import fs from 'fs';

export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (process.env.ENVIRONMENT !== 'test') {
  transport
    .verify()
    .then(() => createLogger().log('Connected to email server'))
    .catch(() => createLogger().warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const msg: Message = {
    from: process.env.SMTP_USER || '',
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/auth/verify-email?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  // const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  // <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  // <p>If you did not create an account, then ignore this email.</p></div>`;
  // await sendEmail(to, subject, text, html);
  // ✅ Render EJS template
  // const templatePath = path.join(__dirname, '');
  // ✅ Correctly resolve the EJS template path
  const templatePath = path.join(process.cwd(), 'src/utils/email-templates/verify-email.ejs');
  console.log('Resolved template path:', templatePath);
  console.log('Sending verification email to:', name, verificationEmailUrl);
  // ✅ Render HTML using EJS
  const html = await ejs.renderFile(templatePath, {
    name,
    verificationEmailUrl,
  });

  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
  const subject = 'Account Created Successfully';
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `http://${config.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

// Assuming sendEmail is a pre-existing function for sending emails
export const sendContactFormdd = async (to: string, name: string, email: string, message: string): Promise<void> => {
  const subject = 'New Contact Form Submission';

  // Prepare the plain text content of the email
  const text = `Hi Admin,
  You have received a new contact form submission.

  Name: ${name}
  Email: ${email}
  Message: ${message}

  Best regards,
  Your Website Team`;

  // Prepare the HTML content of the email
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
    <h4><strong>New Contact Form Submission</strong></h4>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    <p>Best regards,</p>
    <p><strong>Your Website Team</strong></p>
  </div>`;

  // Send the email
  await sendEmail(to, subject, text, html);
};

// Assuming sendEmail is a pre-existing function for sending emails

export const sendContactForm = async (adminEmail: string, userEmail: string, userName: string, message: string, adId: string): Promise<void> => {
  const subjectForAdmin = 'New Contact Form Submission';

  // Admin Email Text Content (Plain Text)
  const textForAdmin = `Hi Admin,
  You have received a new contact form submission.

  Name: ${userName}
  Email: ${userEmail}
  Message: ${message}

  Best regards,
  FetchDial Team`;

  // Admin Email HTML Content (Using Bootstrap)
  const htmlForAdmin = `
  <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f2f9fc; padding: 20px;">
      <div class="container">
        <!-- Header Section with Flexbox -->
        <div style="background-color: #007BFF; padding: 20px; text-align: left; border-radius:  0px;"> <img src="https://fetchdial.in/assets/img/logo-img.png" alt="Logo" style="width: 150px;"> </div>
        
        <!-- Main Content -->
        <div class="bg-white p-4 rounded shadow-sm mt-4">
          <h3 class="text-primary">New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p>Best regards,</p>
          <p>
          <a href="https://fetchdial.in/" target="_blank" class="text-primary" style="font-size: 16px; text-decoration: none;"><strong class="text-primary">
          FetchDial Team</strong></a></p>
        </div>
      </div>
    </body>
  </html>`;

  // Send the admin email
  await sendEmail(adminEmail, subjectForAdmin, textForAdmin, htmlForAdmin);

  // Subject for the user confirmation email
  const subjectForUser = 'Contact Form Submitted Successfully';

  // User Email Text Content (Plain Text)
  const textForUser = `Hi ${userName},

  Thank you for reaching out! We have received your contact form submission.

  Our team will review your message and get back to you shortly.

  Here's a summary of your submission:

  Message: ${message}

  Best regards,
  FetchDial Team`;

  // User Email HTML Content (Using Bootstrap)
  const htmlForUser = `
  <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f2f9fc; padding: 20px;">
      <div class="container">
        <!-- Header Section with Flexbox -->
        <div style="background-color: #007BFF; padding: 20px; text-align: left; border-radius:  0px;"> <img src="https://fetchdial.in/assets/img/logo-img.png" alt="Logo" style="width: 150px;"> </div>
        
        <!-- Main Content -->
        <div class="bg-white p-4 rounded shadow-sm mt-4">
          <h3 class="text-primary">Thank You, ${userName}!</h3>
          <p>We have received your contact form submission. Our team will review your message and get back to you shortly.</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p>Best regards,</p>
          <p><a href="https://fetchdial.in/" target="_blank" class="text-primary" style="font-size: 16px; text-decoration: none;"><strong class="text-primary">FetchDial Team</strong></a></p>
        </div>
      </div>
    </body>
  </html>`;

  // Send the confirmation email to the user
  await sendEmail(userEmail, subjectForUser, textForUser, htmlForUser);
};
