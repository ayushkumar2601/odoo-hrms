const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname);

function write(filePath, content) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
    console.log(`Updated: ${filePath}`);
}

function remove(filePath) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Deleted: ${filePath}`);
    }
}

// 1. DELETE UNNECESSARY ROUTES
remove('src/app/(auth)/organization-register');
remove('src/app/dashboard');

// 2. PRISMA SCHEMA REWRITE (No Company)
write('prisma/schema.prisma', `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                 String    @id
  name               String
  email              String    @unique
  emailVerified      Boolean
  image              String?
  createdAt          DateTime
  updatedAt          DateTime
  role               String?
  employee           Employee?
  accounts           Account[]
  sessions           Session[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?
}

model Employee {
  id              String         @id @default(uuid())
  employeeId      String         @unique // EMP0001
  userId          String?        @unique
  user            User?          @relation(fields: [userId], references: [id])
  firstName       String
  lastName        String
  email           String         @unique
  phone           String?
  department      String?
  designation     String?
  joiningDate     DateTime
  role            String         @default("EMPLOYEE") // ADMIN, HR, EMPLOYEE
  address         String?
  baseSalary      Float?
  isActive        Boolean        @default(true)
  profilePicture  String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  leaveRequests   LeaveRequest[]
  attendances     Attendance[]
  payrolls        Payroll[]
}

model Attendance {
  id         String   @id @default(uuid())
  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id])
  date       DateTime
  checkIn    DateTime?
  checkOut   DateTime?
  status     String   // PRESENT, ABSENT, HALF_DAY, LEAVE
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model LeaveRequest {
  id          String   @id @default(uuid())
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])
  leaveType   String   // PAID, SICK, UNPAID
  startDate   DateTime
  endDate     DateTime
  status      String   @default("PENDING") // PENDING, APPROVED, REJECTED
  remarks     String?
  adminComment String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Payroll {
  id          String   @id @default(uuid())
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])
  month       Int
  year        Int
  basicSalary Float
  allowances  Float
  deductions  Float
  netSalary   Float
  status      String   @default("GENERATED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`);

// 3. LANDING PAGE
write('src/app/page.tsx', `
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
      <h1 className="text-5xl font-bold mb-4">Human Resource Management System</h1>
      <p className="text-xl text-gray-600 mb-12">Every workday, perfectly aligned.</p>
      
      <div className="flex gap-6">
        <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
          New Employee
        </Link>
        <Link href="/signin" className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg shadow border hover:bg-gray-50 transition">
          Existing Employee
        </Link>
      </div>
    </div>
  );
}
`);

// 4. SIGNUP PAGE
write('src/app/signup/page.tsx', `
"use client";
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">New Employee Registration</h2>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Employee ID (e.g. EMP0001)" className="p-3 border rounded-lg" required />
          <input type="email" placeholder="Email" className="p-3 border rounded-lg" required />
          <input type="password" placeholder="Password" className="p-3 border rounded-lg" required />
          <input type="password" placeholder="Confirm Password" className="p-3 border rounded-lg" required />
          <select className="p-3 border rounded-lg" required>
            <option value="EMPLOYEE">Employee</option>
            <option value="HR">HR</option>
          </select>
          <button type="button" className="bg-blue-600 text-white p-3 rounded-lg font-semibold mt-2 hover:bg-blue-700">Register</button>
        </form>
      </div>
    </div>
  );
}
`);

// 5. SIGNIN PAGE
write('src/app/signin/page.tsx', `
"use client";
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Existing Employee Login</h2>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="p-3 border rounded-lg" required />
          <input type="password" placeholder="Password" className="p-3 border rounded-lg" required />
          <button type="button" className="bg-black text-white p-3 rounded-lg font-semibold mt-2 hover:bg-gray-800">Sign In</button>
        </form>
      </div>
    </div>
  );
}
`);

// 6. DASHBOARDS
const adminDashboard = `
export default function AdminDashboard() {
  return <div className="p-8 text-black"><h1 className="text-3xl font-bold">Admin Dashboard</h1></div>;
}`;
const hrDashboard = `
export default function HRDashboard() {
  return <div className="p-8 text-black"><h1 className="text-3xl font-bold">HR Dashboard</h1></div>;
}`;
const employeeDashboard = `
export default function EmployeeDashboard() {
  return <div className="p-8 text-black"><h1 className="text-3xl font-bold">Employee Dashboard</h1></div>;
}`;
write('src/app/dashboard/admin/page.tsx', adminDashboard);
write('src/app/dashboard/hr/page.tsx', hrDashboard);
write('src/app/dashboard/employee/page.tsx', employeeDashboard);

// Execute Prisma Reset
console.log('Pushing new database schema...');
try {
    execSync('npx prisma db push --force-reset', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log('Database successfully reset and pushed.');
} catch (error) {
    console.error('Prisma push failed:', error.message);
}
