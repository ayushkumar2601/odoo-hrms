import nodemailer from 'nodemailer';

export const EMAIL_FROM = process.env.EMAIL_FROM || "kumarayush.professional@gmail.com";

const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_FROM,
    pass: password,
  },
});
