# Zindle HRMS - Technical Documentation

## 1. Overview and Current State
The Zindle HRMS is currently deployed as a **Single-Tenant Enterprise Human Resource Management System**. We have fully executed the massive architectural pivot away from a multi-tenant SaaS model, establishing a secure, rigidly structured, and robust environment for a single organization to manage its personnel.

**Current State**: The system is fully operational locally. Core functionalities such as Authentication (Better Auth), strict Role-Based Access Control (Next.js Middleware), Employee Management, Attendance Tracking, Leave Approvals, and Payroll Generation are completely wired to the PostgreSQL database via high-performance Next.js Server Actions.

---

## 2. Tech Stack
* **Framework:** Next.js 14/15 (App Router, React Server Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Premium Enterprise UI/UX Redesign - Deep Navy, Slate, Royal Blue palette with 'Inter' typography and Lucide icons)
* **Authentication:** Better Auth (Secure Email/Password, bcrypt hashing, cookie-based sessions, forced password change on first login)
* **Database:** PostgreSQL (Relational Database)
* **ORM:** Prisma (Type-safe database querying and schema migrations)
* **Email Service:** Nodemailer + SMTP (Automated welcome emails and notifications)

---

## 3. Folder Structure & Architecture
The repository relies on modern Next.js conventions, heavily separating the View layer (App Router) from the Data layer (Server Actions).

```text
/src
 ├── actions/           # (NEW) Pure Next.js Server Actions for database mutations
 │   ├── employee.ts    # Logic for registering employees & generating IDs
 │   ├── attendance.ts  # Logic for clock-in/out timestamp logging
 │   └── leave.ts       # Logic for applying & approving leave requests
 │
 ├── app/               # Next.js App Router Pages
 │   ├── api/auth/      # Better Auth endpoint handlers
 │   ├── dashboard/     # 🔒 Protected RBAC Zone (Requires login)
 │   │   ├── admin/     # Admin Command Center
 │   │   ├── hr/        # HR Operations Portal
 │   │   ├── employee/  # Standard User Portal
 │   │   ├── attendance/# Attendance UI
 │   │   ├── employees/ # Staff Directory UI
 │   │   ├── leave/     # Leave Requests UI
 │   │   ├── payroll/   # Salary Slips UI
 │   │   ├── profile/   # Personal details & Edit UI
 │   │   ├── settings/  # System config UI (Admin Only)
 │   │   └── audit-logs/# Activity timeline UI (Admin Only)
 │   │
 │   ├── signin/        # Authentication Login Portal
 │   ├── signup/        # Employee Account Linking Portal
 │   ├── change-password/# Forced security password change flow
 │   ├── globals.css    # Global Tailwind tokens & styles
 │   └── layout.tsx     # Global HTML shell
 │
 ├── components/        # Reusable React UI Components
 │   ├── layout/        # Shared Layouts
 │   │   └── Sidebar.tsx# Dynamic Navigation Menu (Changes based on User Role)
 │
 ├── lib/               # System Configurations
 │   ├── auth.ts        # Better Auth setup & Prisma adapter injection
 │   └── prisma.ts      # Global Prisma Client instance
 │
 └── middleware.ts      # 🛡️ Global Security Gateway (Intercepts and validates all requests)
```

---

## 4. Roles and Permissions (RBAC)

The system enforces strict permission boundaries at the **Middleware Level**. If a user attempts to access a restricted URL, they are instantly redirected to an Unauthorized screen.

### 👑 ADMIN
The absolute highest authority. Total control over the organization.
* **Allowed Routes:** `/dashboard/*` (Complete Access)
* **Key Capabilities:**
  * Can register new employees via `/dashboard/employees`
  * Can view the master list of all Leave Requests and click `Approve/Reject`
  * Can view every employee's generated Payroll and Salary Slips
  * Can view global Attendance logs

### 👔 HR (Human Resources)
Managerial authority. Can manage personnel but is strictly blocked from sensitive financial data.
* **Allowed Routes:** `/dashboard/hr`, `/dashboard/employees`, `/dashboard/attendance`, `/dashboard/leave`, `/dashboard/profile`
* **Blocked Routes:** `/dashboard/payroll`, `/dashboard/admin`
* **Key Capabilities:**
  * Can register new employees
  * Can view the master list of all Leave Requests and click `Approve/Reject`
  * Cannot view or manage Salary Slips

### 🧑‍💻 EMPLOYEE
Standard, highly restricted user. Can only view and interact with their own personal data.
* **Allowed Routes:** `/dashboard/employee`, `/dashboard/profile`, `/dashboard/attendance`, `/dashboard/leave`, `/dashboard/payroll`
* **Blocked Routes:** `/dashboard/admin`, `/dashboard/hr`, `/dashboard/employees` (Staff Directory)
* **Key Capabilities:**
  * Can securely `Clock In` and `Clock Out` to log their daily timestamps
  * Can use the Time-Off form to request `PAID`, `SICK`, or `UNPAID` leave
  * Can view their own historical attendance, leave status, and personal salary slips
  * Cannot approve leaves, cannot view other employees.

---

## 5. Security & Authentication Flow
The organization operates on a strictly controlled onboarding pipeline. Users **cannot** freely register and join the company.

**The Onboarding Flow:**
1. **Admin / HR Login**: Manager logs into the system.
2. **Employee Registration**: Manager navigates to `/dashboard/employees` and fills out the new hire's details.
3. **ID Generation**: The backend securely validates the request and automatically generates a sequential ID (e.g. `EMP0045`).
4. **Account Linking**: The new employee is told their ID. They navigate to `/signup`, enter their `EMP0045` ID, and set their secure password. 
5. **Validation**: The system verifies the ID exists in the database and links their new Login Credentials to that specific Employee Profile.

---

## 6. Zindle AI Copilot (Role-Aware Workforce Intelligence & Actions)
The system features a flagship **Zindle AI Copilot**, powered by Groq's high-speed `llama-3.3-70b-versatile` LLM. The Copilot is deeply integrated into the HRMS with strict Role-Based Access Control (RBAC) and two interactive UI interfaces: a floating bottom-right chat widget (`/components/copilot/FloatingCopilot.tsx`) and a full-screen dashboard portal (`/dashboard/copilot`).

### 🛡️ Phase A: Zero-Leakage RBAC & Context Building
- **Strict Role Boundaries**: The Copilot evaluates the authenticated user's role before processing any question.
  - **Employee**: Can only query their personal attendance timestamps, leave balance, profile data, and personal pay history.
  - **HR**: Can view company-wide attendance and leave applications but is strictly blocked from executive payroll data.
  - **Admin**: Has executive visibility across all departments and payroll summaries.
- **Dynamic Context Builder**: Before passing prompt text to Groq, the backend (`/lib/copilot/context-builder.ts`) fetches exact database records from PostgreSQL via Prisma, ensuring zero hallucination.

### 🚀 Phase B: Action Engine, Analytics & Branded PDF Reports
- **Interactive Action Confirmation Engine**: When a user asks to perform an action (e.g., *"Apply for sick leave tomorrow"* or *"Change my phone number"*), the intent parser generates an **Action Proposal Card** with `Confirm Action` / `Cancel` buttons. Mutations only execute after explicit confirmation through `/api/copilot/action`.
- **In-Chat PDF Report Generation**: Users can request downloadable reports (e.g., *"Generate an attendance report"*). The AI prepares the structured data and presents a **Generate & Download PDF** button directly inside the chat window using lightweight client-side `jspdf` and `jspdf-autotable`.
- **Report Center Page (`/dashboard/reports`)**: A dedicated hub where users can filter, view, and re-download historical PDF reports.
- **Role-Aware Workforce Analytics (`/dashboard/analytics`)**: Live computation engines providing real-time headcount distributions, attendance rates, leave approval bottlenecks, and restricted payroll summaries.
- **Rich Markdown Formatting**: All AI responses are rendered using `react-markdown` and `remark-gfm`, formatting timestamps, bulleted lists, bold badges, tables, and headers for maximum readability.
