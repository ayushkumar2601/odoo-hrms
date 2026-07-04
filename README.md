# Zindle HRMS — Powered by Zindle AI Copilot

Welcome to the Zindle Human Resource Management System (HRMS).

This project is a clean, modern, and highly secure **Single-Tenant Enterprise HRMS** built on Next.js 16, PostgreSQL, Prisma, and Better Auth. It features **Zindle AI Copilot**, a role-aware workforce intelligence assistant powered by Groq (`llama-3.3-70b-versatile`) that can securely answer attendance/leave/payroll queries, automate workflow actions via confirmation cards, and generate instant branded PDF reports!

## Key Features
- **🤖 Role-Aware AI Copilot**: Ask conversational questions, apply for leaves, and generate analytics without ever leaking sensitive peer data across Employee, HR, and Admin boundaries.
- **⚡ Interactive AI Actions**: Perform secure database mutations via interactive confirmation cards in the chat.
- **📄 Instant PDF Reports & Analytics**: Generate client-side branded PDF reports (`jspdf`) and explore real-time workforce metrics in dedicated dashboards.
- **🔒 Robust RBAC Security**: Strict middleware and server-side permission validation protecting every endpoint.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup the Database:**
   Ensure you have a PostgreSQL database running and update your `.env` file with the connection URL.
   ```bash
   npx prisma db push
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the application.

## Documentation

For a comprehensive guide on the system architecture, tech stack, folder structure, and precise details regarding the Admin, HR, and Employee roles and their permissions, please refer to the detailed [Technical Documentation](./documentation.md).
