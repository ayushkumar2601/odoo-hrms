<div align="center">

# ⚡ Zindle HRMS
### The Single-Tenant Enterprise Workforce Platform Powered by Zindle AI Copilot 2.0

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Groq AI](https://img.shields.io/badge/Groq%20LPU-F55036?style=for-the-badge&logo=probot&logoColor=white)](https://groq.com/)
[![Meta Llama 3.3](https://img.shields.io/badge/Llama%203.3%2070B-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://ai.meta.com/llama/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-111827?style=for-the-badge&logo=shield&logoColor=white)](https://better-auth.com/)

<p align="center">
  <b>An award-winning Apple & Linear CRM minimalist design system engineered for speed, high-contrast visual hierarchy, and zero-leakage role-aware artificial intelligence.</b>
</p>

[Explore Documentation](./documentation.md) • [Report Bug](https://github.com/ayushkumar2601/odoo-hrms/issues) • [Request Feature](https://github.com/ayushkumar2601/odoo-hrms/issues)

---

</div>

## 🌟 Executive Overview & The Vision

Legacy Human Resource Management Systems are plagued by clunky interfaces, fragmented data silos, and generic chatbots that either hallucinate policy or expose confidential company data. **Zindle HRMS** fundamentally reimagines enterprise workforce management by merging an **Award-Winning Apple & Linear CRM Design System** with a state-of-the-art **Deterministic Retrieval-Augmented Generation (RAG) AI Copilot**.

Built from the ground up for single-tenant enterprise deployments, Zindle guarantees that **Security is Priority #1**. Whether an employee is checking their remaining paid time off, an HR manager is auditing attendance rate telemetry, or an Executive Admin is reviewing payroll disbursements, every single interaction is governed by strict, mathematically verifiable **Role-Based Access Control (RBAC)** boundaries.

---

## 🤖 Zindle AI Copilot 2.0 — The Core Engine (AI Spotlight)

At the heart of Zindle HRMS lies **Zindle AI Copilot 2.0**, powered by Meta's landmark `llama-3.3-70b-versatile` model running on **Groq's Language Processing Unit (LPU)** inference engine. Delivering sub-300ms response latency, the Copilot transcends generic conversational chatbots by operating as an autonomous, role-aware workforce executive.

```
       [ Employee / HR / Admin ]
                  │
                  ▼
   ┌──────────────────────────────┐
   │    Copilot Chat / Portal     │  ──> Natural Language Prompt
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │     RBAC Security Shield     │  ──> Middleware Identity & Role Verification
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ Deterministic Context Engine │  ──> SQL Telemetry & Hybrid Vector Retrieval
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │     Groq LPU Inference       │  ──> Llama-3.3-70B-Versatile Synthesis
   └──────────────┬───────────────┘
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
[ Conversational NL ]   [ Autonomous Action / Report Card ]
```

### 🛡️ 1. Zero-Leakage Deterministic RAG Architecture
In enterprise HRMS, traditional prompt engineering is a critical vulnerability; a simple prompt injection could trick an LLM into leaking executive payroll data to a standard intern. Zindle eliminates this threat vector entirely through **Deterministic RAG (Retrieval-Augmented Generation)**:
* **No Direct DB Access**: The LLM never possesses direct database credentials or SQL execution capabilities.
* **Pre-Computation Identity Gating**: When a prompt hits `/api/copilot`, our security gateway intercepts the request, decrypts the session, and evaluates the user's role (`ADMIN`, `HR`, or `EMPLOYEE`).
* **Dynamic Context Injection**: The backend (`context-builder.ts`) queries PostgreSQL via Prisma for *only* the telemetry records that specific user is explicitly authorized to view. This sanitized, structured JSON payload is injected into the system prompt as immutable grounding context, rendering prompt injection attacks mathematically inert.

### 🧬 2. Hybrid Semantic Vector Database Readiness
While structured telemetry (attendance timestamps, salary slips, leave allowances) is retrieved deterministically via relational queries, Zindle Copilot is architected for **Hybrid Vector Retrieval**. By embedding enterprise policy handbooks, compliance guidelines, and insurance documentation into high-dimensional vector space (via **PgVector** or **Pinecone**), the Copilot performs cosine similarity searches to augment relational user data with semantic policy citations in real time.

### ⚡ 3. Autonomous Action Engine (Human-in-the-Loop)
Zindle upgrades AI from passive *Question → Answer* to active *Question → Action*. Using structured Intent Parsing, the Copilot identifies actionable employee requests:
* **Intent Recognition**: Requests such as *"Clock me in for today"*, *"Apply for paid leave from Oct 12 to Oct 15 due to personal reasons"*, or *"Approve leave request EMP0003"* are intercepted by the NLP classification layer.
* **Human-in-the-Loop Confirmation UI**: To guarantee zero accidental mutations, the Copilot generates an interactive **Action Proposal Card** directly inside the chat stream. The database mutation is *only* executed when the user explicitly clicks the `Confirm & Execute` button, triggering a cryptographic server action (`/api/copilot/action`).

### 📄 4. Client-Side Document Telemetry & PDF Synthesis
When an executive asks for complex reporting (e.g., *"Generate a PDF summary of our attendance telemetry"* or *"Export my salary slips"*), the AI synthesizes structured table arrays and emits a **Report Proposal Payload**. Our client-side rendering engine (`jspdf` + `jspdf-autotable`) instantly compiles and formats a branded, high-resolution PDF document for immediate download—zero server-side document rendering overhead required.

---

## 📊 Architectural & AI Workflow Diagrams

### 1. Zero-Leakage RAG & RBAC Query Pipeline
The following sequence diagram illustrates how Zindle AI Copilot prevents data leaks while serving role-tailored intelligence:

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated User
    participant UI as Copilot UI / Portal
    participant API as Copilot API (/api/copilot)
    participant RBAC as Security Layer & Auth
    participant DB as PostgreSQL / Prisma ORM
    participant Vector as Vector Store (PgVector)
    participant Groq as Groq LPU (Llama-3.3-70B)

    User->>UI: "What is my attendance rate and what is the sick leave policy?"
    UI->>API: POST /api/copilot { prompt }
    API->>RBAC: Validate Session & Extract Role (EMP / HR / ADMIN)
    RBAC-->>API: Session Validated (Role: EMPLOYEE, ID: EMP0045)
    
    par Deterministic Telemetry Retrieval
        API->>DB: Query Authorized Logs (WHERE employeeId = EMP0045)
        DB-->>API: Return Attendance & Leave Balance JSON
    and Semantic Policy Retrieval (RAG)
        API->>Vector: Cosine Similarity Search ("sick leave policy")
        Vector-->>API: Return Relevant Policy Paragraph Embeddings
    end

    API->>API: Synthesize Grounded System Prompt (No Peer Data Injected)
    API->>Groq: Stream Inference Request (Llama-3.3-70B-Versatile)
    Groq-->>API: Stream Markdown Tokens & Action/Report Proposals
    API-->>UI: Render Rich Markdown & Interactive UI Cards
    UI-->>User: Display High-Contrast Response
```

### 2. Autonomous Human-in-the-Loop Mutation Flow
How natural language transforms into secure, audited database mutations:

```mermaid
flowchart TD
    A[User Input: 'Apply for 2 days sick leave starting tomorrow'] --> B[Copilot API Route]
    B --> C{Intent Parser Classification}
    C -->|Query Intent| D[Standard RAG Synthesis]
    C -->|Action Intent| E[Extract Action Parameters: Type, Dates, Reason]
    E --> F[Generate ActionProposal JSON Payload]
    F --> G[Render Interactive Confirmation Card in Chat]
    G --> H{User Click Action}
    H -->|Click Cancel| I[Abort Mutation & Log Telemetry]
    H -->|Click Confirm| J[POST /api/copilot/action]
    J --> K[RBAC Mutation Firewall Validation]
    K --> L[Prisma DB Mutation: Create LeaveRequest]
    L --> M[Return Live Success Receipt Card to UI]
```

### 3. Role-Based Access Control (RBAC) Matrix
Zindle enforces strict perimeter boundaries across all dashboard endpoints and AI contexts:

| Module / Capability | 👑 Admin (Executive) | 👔 HR Manager | 🧑‍💻 Employee (Standard) |
| :--- | :---: | :---: | :---: |
| **Dashboard Shell & Profile** | ✅ Full Access | ✅ Full Access | ✅ Personal Only |
| **Employee Staff Directory** | ✅ Create / Edit / View All | ✅ Create / Edit / View All | ❌ Blocked (403 Redirect) |
| **Time & Attendance Telemetry** | ✅ Global Enterprise Logs | ✅ Global Enterprise Logs | ✅ Personal Timestamps Only |
| **Time-Off & Leave Approvals** | ✅ Approve / Reject All | ✅ Approve / Reject All | ✅ Submit & View Personal |
| **Payroll & Compensation Slips** | ✅ Disburse & Manage All | ❌ Blocked (No Financials) | ✅ View Personal Pay Slips |
| **AI Report Center (PDFs)** | ✅ Global Directory/Payroll PDFs | ✅ Attendance/Leave PDFs | ✅ Personal Telemetry PDFs |
| **Workforce Intelligence Analytics**| ✅ Full Department & Payroll KPIs | ✅ Headcount & Attendance KPIs | ❌ Restricted Telemetry |
| **AI Copilot Data Scope** | 🌐 Org-Wide Intelligence | 👥 Departmental Intelligence | 🔒 Strictly Personal Data |

---

## ✨ Feature Showcase (by Module)

### 🎨 Award-Winning Apple & Linear CRM UI System
Designed with obsessive attention to typographic hierarchy and visual contrast, Zindle replaces cluttered admin dashboards with sleek, monotonic CRM metric boxes.
* **Color Palette**: Deep charcoal primary accents (`#111827`), soft content shells (`#FAFAFB`), subtle structural borders (`#E5E7EB`), and semantic status badges (Emerald, Rose, Amber, Royal Blue).
* **Mac-Style Pill Navigation**: A sleek, minimal sidebar with pill-based routing and active state indicators that dynamically adapt to the user's RBAC elevation.
* **Responsive Grid Architecture**: Clean 12-column ledger tables with hover states, monospace numerical alignment, and instant client-side filtering.

### 👥 Complete Workforce & Employee Directory
An enterprise CRM-style directory for onboarding and managing company personnel.
* **Automated ID Provisioning**: New hires are automatically assigned sequential alphanumeric corporate IDs (`EMP0001`, `EMP0002`).
* **Secure Onboarding Pipeline**: Employees link their corporate ID during initial registration, establishing an immutable cryptographic link between their authentication credentials and their HR profile.
* **Role Management**: Instant elevation and demotion across `EMPLOYEE`, `HR`, and `ADMIN` roles.

### ⏱️ Telemetry-Driven Time & Attendance
Real-time shift tracking and historical timestamp auditing.
* **Interactive Clock-In / Clock-Out Box**: Visual status indicators (pulsing emerald for active shifts, slate for completed cycles) with one-click server action logging.
* **Precision Telemetry Table**: Daily chronological logs capturing exact check-in times, check-out times, and calculated shift durations.
* **AI Attendance Auditing**: Ask the Copilot *"How many days was I late this month?"* or *"Who clocked in before 8 AM today?"* for instant synthesis.

### 🏖️ Dynamic Time-Off & Leave Management
A streamlined workflow for requesting, reviewing, and approving employee absences.
* **Live Allowance Counters**: Real-time balance tracking for Paid Time Off (PTO), Medical Sick Leave, and Casual Unpaid allowances.
* **Sleek Application Form**: Modal-free, inline submission forms with instant routing to HR managers.
* **One-Click HR Approval Ledgers**: HR and Admin executives can review pending requests and execute `Approve` or `Reject` mutations directly from the overview table or via conversational AI commands.

### 💰 Bank-Grade Payroll & Salary Slips
A secure compensation ledger separated by strict financial firewalls.
* **Automated Salary Dispersal**: Generate monthly compensation slips calculating base salary, performance allowances, tax deductions, and net pay.
* **Privacy Firewall**: HR managers can manage personnel but are strictly barred from accessing executive compensation ledgers—only Admins and the individual employee can view salary figures.
* **PDF Pay Slip Export**: Download high-resolution, bank-ready salary slips with one click.

### 📈 Real-Time Executive Analytics Dashboard
Live organizational telemetry computed on demand.
* **Workforce Headcount Distribution**: Visual departmental breakdowns and active personnel tracking.
* **Attendance Rate KPI Engines**: Real-time calculation of organizational presence, absence, and leave percentages.
* **Financial Expenditure Telemetry**: Executive summaries of monthly payroll run rates and average employee compensation (Admin restricted).

---

## 🛠️ Technical Stack & Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                              │
│   Next.js 16 App Router • React 19 • Tailwind CSS • Lucide Icons          │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼─────────────────────────────────────┐
│                          SECURITY & AUTH GATEWAY                          │
│   Better Auth (Session Cookies, Bcrypt) • Next.js Middleware RBAC Router  │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼─────────────────────────────────────┐
│                       SERVER ACTIONS & API ROUTES                         │
│   Pure Next.js Server Actions (/actions/*) • RESTful Copilot API          │
└──────────────────┬──────────────────────────────────────┬─────────────────┘
                   │                                      │
┌──────────────────▼─────────────────┐  ┌─────────────────▼─────────────────┐
│       AI & RAG INFRASTRUCTURE      │  │      DATABASE & ORM LAYER         │
│  Groq LPU Engine                   │  │  PostgreSQL (Relational DB)       │
│  Meta Llama-3.3-70B-Versatile      │  │  Prisma ORM (Type-Safe Client)    │
│  Deterministic RAG Context Builder │  │  PgVector Readiness (Embeddings)  │
│  jsPDF Document Synthesizer        │  │  Nodemailer SMTP (Notifications)  │
└────────────────────────────────────┘  └───────────────────────────────────┘
```

### 💻 Technology Breakdown

| Category | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Core Framework** | [Next.js 16](https://nextjs.org/) | App Router, React Server Components (RSC), and Server Actions for zero-bundle-size mutations. |
| **UI Library** | [React 19](https://react.dev/) | Client and server rendering, concurrent features, and optimized state hydration. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Complete end-to-end type safety across database schemas, API responses, and UI props. |
| **Styling & Design**| [Tailwind CSS](https://tailwindcss.com/) | Custom Apple & Linear CRM tokens, minimalist scrollbars, and responsive flex/grid layouts. |
| **AI Inference** | [Groq API](https://groq.com/) | Ultra-low latency Tensor Streaming Processor (TSP) architecture delivering <300ms LLM tokens. |
| **LLM Model** | [Llama-3.3-70B](https://ai.meta.com/) | Meta's flagship 70-billion parameter model optimized for complex reasoning, RAG, and JSON parsing. |
| **Authentication** | [Better Auth](https://better-auth.com/) | Enterprise authentication with bcrypt hashing, HTTP-only cookies, and session management. |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | ACID-compliant relational database storing workforce profiles, attendance logs, and payroll ledgers. |
| **ORM** | [Prisma](https://www.prisma.io/) | Type-safe schema definition, automated migrations, and structured query building. |
| **PDF Synthesis** | [jsPDF & AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Client-side vector document generation for executive reports and salary slips. |
| **Markdown Engine**| [React-Markdown](https://github.com/remarkjs/react-markdown) | GitHub-flavored markdown (`remark-gfm`) rendering for rich AI chat responses. |

---

## 🚀 Getting Started & Installation

Follow these instructions to deploy and run Zindle HRMS locally on your machine.

### Prerequisites
* **Node.js**: v18.17.0 or higher (`v20+` recommended)
* **PostgreSQL**: A running local or cloud PostgreSQL instance (e.g., Docker, Supabase, Neon, or local Postgres server)
* **Groq API Key**: Get a free API key from the [Groq Cloud Console](https://console.groq.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/ayushkumar2601/odoo-hrms.git
cd odoo-hrms
```

### 2. Install Dependencies
Install all required node modules using `npm`:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and populate it with your local configuration:
```env
# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/zindle_hrms?schema=public"

# Better Auth Configuration (Generate a secret with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your_randomly_generated_secure_secret_key_here"
BETTER_AUTH_URL="http://localhost:3000"

# Groq LPU AI Copilot API Key
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Optional: SMTP Email Configuration for Notifications
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="notifications@zindle.com"
SMTP_PASS="secret_password"
```

### 4. Push Database Schema & Seed Demo Data
Push the Prisma schema to your PostgreSQL instance and populate it with comprehensive demo data (includes pre-configured Admin, HR, and Employee accounts with 1 month of realistic attendance and payroll history):
```bash
npx prisma db push
npx prisma db seed
```

> 💡 **Demo Credentials Provided by Seeder:**
> * **Admin Executive**: `admin@zyoris.com` / `password123` (ID: `EMP0001`)
> * **HR Manager**: `hr@zyoris.com` / `password123` (ID: `EMP0002`)
> * **Standard Employee**: `whokilledayush.com` / `password123` (ID: `EMP0003`)

### 5. Start the Development Server
Launch the Next.js dev server:
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to experience Zindle HRMS!

---

## 💻 Code Architecture & Key Directories

```text
odoo-hrms/
├── prisma/
│   ├── schema.prisma              # Database schema models (User, Employee, Attendance, Leave, Payroll)
│   └── seed.ts                    # Automated seeding script for realistic enterprise test data
├── src/
│   ├── actions/                   # Next.js Server Actions (Zero-API database mutations)
│   │   ├── attendance.ts          # Clock-in / Clock-out server telemetry
│   │   ├── employee.ts            # Staff onboarding and sequential ID provisioning
│   │   └── leave.ts               # Time-off submissions and HR approval ledgers
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/     # Better Auth endpoint handler
│   │   │   ├── copilot/           # 🤖 Copilot NLP prompt handler & Action Engine
│   │   │   ├── reports/           # PDF Report generation endpoints
│   │   │   └── analytics/         # Real-time workforce KPI data aggregation
│   │   ├── dashboard/             # 🔒 Protected RBAC Zone (Requires authentication)
│   │   │   ├── admin/             # Executive Command Center
│   │   │   ├── hr/                # HR Operations Portal
│   │   │   ├── employee/          # Standard Employee Workspace
│   │   │   ├── employees/         # Staff Directory & Onboarding Ledger
│   │   │   ├── attendance/        # Time & Attendance Telemetry Page
│   │   │   ├── leave/             # Leave Management & Approval Page
│   │   │   ├── payroll/           # Salary Slips & Compensation Page
│   │   │   ├── reports/           # AI Report Center & Archive
│   │   │   ├── analytics/         # Workforce Intelligence Dashboard
│   │   │   └── copilot/           # Full-Screen AI Copilot Executive Portal
│   │   ├── globals.css            # Apple & Linear minimalist design tokens & styling
│   │   └── page.tsx               # Award-winning SaaS showcase landing page
│   ├── components/
│   │   ├── copilot/
│   │   │   └── FloatingCopilot.tsx# Floating interactive AI assistant widget
│   │   └── layout/
│   │       └── Sidebar.tsx        # Dynamic RBAC pill navigation sidebar
│   ├── lib/
│   │   ├── auth.ts                # Better Auth server configuration & Prisma adapter
│   │   ├── prisma.ts              # Global singleton Prisma ORM client
│   │   └── copilot/
│   │       ├── groq.ts            # Groq LPU client initialization & LLM streaming
│   │       ├── context-builder.ts # 🛡️ Deterministic RAG telemetry query engine
│   │       ├── intent-parser.ts   # Natural Language Action classification
│   │       └── pdf-export.ts      # Client-side jsPDF document synthesis engine
│   └── middleware.ts              # 🛡️ Global RBAC perimeter security firewall
└── README.md                      # Award-winning product documentation
```

---

## 🛡️ Security Best Practices & Compliance

Zindle HRMS is built to withstand rigorous enterprise security requirements:
1. **Middleware Route Guarding**: Every request to `/dashboard/*` is intercepted by `src/middleware.ts`. Unauthorized attempts to access higher-privilege zones result in immediate HTTP 403 / redirect responses.
2. **Server-Side Action Validation**: UI hiding is never relied upon for security. Every Server Action (`/actions/*`) and API route re-verifies the user's session and role before querying or mutating the database.
3. **Password Security**: All user passwords are cryptographically hashed using industry-standard `bcrypt` via Better Auth before storage.
4. **LLM Sandbox Isolation**: The Groq AI engine is treated as an untrusted client. It receives pre-sanitized context and emits text proposals; it cannot execute raw SQL or bypass our Prisma validation layer.

---

## 📜 License & Credits

This project is open-source and licensed under the **MIT License**. Feel free to use, modify, and distribute this software for personal or commercial projects.

Designed and engineered with ❤️ by the **Zindle Team**.

<div align="center">
  <p><b>Zindle HRMS — The Future of Autonomous Workforce Telemetry</b></p>
  <a href="#-zindle-hrms">⬆ Back to Top</a>
</div>
