require('dotenv').config();
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.send({
  from: process.env.EMAIL_FROM,
  to: ['harsh@techtrendgo.com'],
  subject: 'Test',
  html: 'Test'
}).then(console.log).catch(console.error);
