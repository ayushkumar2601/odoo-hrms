export function getWelcomeEmailTemplate(name: string, employeeId: string, role: string, email: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to Zyoris HRMS</h2>
      <p>Hello ${name},</p>
      <p>Your employee profile has been created in the system.</p>
      
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Employee ID:</strong> ${employeeId}</p>
        <p style="margin: 0 0 8px 0;"><strong>Role:</strong> ${role}</p>
        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
      </div>

      <p>You can now create your account using your Employee ID.</p>
      
      <a href="${appUrl}/signup" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 10px;">
        Sign Up Here
      </a>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Thank you,<br/>Zyoris HRMS Administration
      </p>
    </div>
  `;
}
