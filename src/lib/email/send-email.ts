import { transporter, EMAIL_FROM } from "./provider";
import { getWelcomeEmailTemplate } from "./templates/employee-created";

export async function sendWelcomeEmail(name: string, employeeId: string, role: string, email: string) {
  if (!process.env.EMAIL_PASS) {
    console.warn("EMAIL_PASS is not set in .env. Skipping welcome email delivery.");
    return { success: false, error: "App Password missing" };
  }

  try {
    const html = getWelcomeEmailTemplate(name, employeeId, role, email);
    
    const info = await transporter.sendMail({
      from: `"Zindle HRMS" <${EMAIL_FROM}>`,
      to: email,
      subject: "Welcome to Zindle HRMS",
      html: html,
    });

    console.log("Welcome email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send welcome email via Nodemailer:", error);
    return { success: false, error };
  }
}
