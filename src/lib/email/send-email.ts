import { getTransporter, getEmailFrom } from "./provider";
import { getWelcomeEmailTemplate } from "./templates/employee-created";

export async function sendWelcomeEmail(name: string, employeeId: string, role: string, email: string) {
  try {
    const html = getWelcomeEmailTemplate(name, employeeId, role, email);
    const transporter = getTransporter();
    const fromEmail = getEmailFrom();
    
    const info = await transporter.sendMail({
      from: `"Zindle HRMS" <${fromEmail}>`,
      to: email,
      subject: "Welcome to Zindle HRMS - Your Account Details",
      html: html,
    });

    console.log("Welcome email sent successfully: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send welcome email via Nodemailer:", error);
    return { success: false, error };
  }
}
