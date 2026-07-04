# Zindle HRMS

Welcome to the Zindle Human Resource Management System (HRMS).

This project is a clean, modern, and highly secure **Single-Tenant Enterprise HRMS** built on Next.js 14, PostgreSQL, and Prisma. It is designed to handle core organizational features such as secure onboarding, daily attendance tracking, leave request workflows, and payroll generation, all protected by a robust Role-Based Access Control (RBAC) architecture.

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
