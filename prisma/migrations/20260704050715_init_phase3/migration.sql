-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "basicSalary" DECIMAL(65,30) NOT NULL,
    "hra" DECIMAL(65,30) NOT NULL,
    "allowances" DECIMAL(65,30) NOT NULL,
    "bonus" DECIMAL(65,30) NOT NULL,
    "deductions" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRecord" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "grossSalary" DECIMAL(65,30) NOT NULL,
    "totalDeductions" DECIMAL(65,30) NOT NULL,
    "netSalary" DECIMAL(65,30) NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDocument" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSettings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogoUrl" TEXT,
    "companyCode" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeavePolicy" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "paidLeaves" INTEGER NOT NULL DEFAULT 12,
    "sickLeaves" INTEGER NOT NULL DEFAULT 12,
    "casualLeaves" INTEGER NOT NULL DEFAULT 6,
    "unpaidLeaves" INTEGER NOT NULL DEFAULT 9999,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeavePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendancePolicy" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "officeStartTime" TEXT NOT NULL DEFAULT '09:00',
    "officeEndTime" TEXT NOT NULL DEFAULT '17:00',
    "gracePeriodMinutes" INTEGER NOT NULL DEFAULT 15,
    "halfDayThresholdHrs" DECIMAL(65,30) NOT NULL DEFAULT 4.0,
    "fullDayThresholdHrs" DECIMAL(65,30) NOT NULL DEFAULT 8.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendancePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalaryStructure_employeeId_key" ON "SalaryStructure"("employeeId");

-- CreateIndex
CREATE INDEX "PayrollRecord_employeeId_idx" ON "PayrollRecord"("employeeId");

-- CreateIndex
CREATE INDEX "PayrollRecord_month_year_idx" ON "PayrollRecord"("month", "year");

-- CreateIndex
CREATE INDEX "EmployeeDocument_employeeId_idx" ON "EmployeeDocument"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSettings_companyId_key" ON "OrganizationSettings"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "LeavePolicy_companyId_key" ON "LeavePolicy"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendancePolicy_companyId_key" ON "AttendancePolicy"("companyId");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRecord" ADD CONSTRAINT "PayrollRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDocument" ADD CONSTRAINT "EmployeeDocument_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
