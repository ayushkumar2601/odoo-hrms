import nodemailer from 'nodemailer';

export function getEmailFrom() {
  return process.env.EMAIL_FROM || "kumarayush.professional@gmail.com";
}

export function getTransporter() {
  const fromEmail = getEmailFrom();
  const password = process.env.EMAIL_PASS || "irnizgvvgzrwijaq";

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: password,
    },
  });
}
