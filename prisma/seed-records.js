const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const employees = await prisma.employee.findMany();

    if (employees.length === 0) {
        console.log("No employees found. Seed users first.");
        return;
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    for (const emp of employees) {
        console.log("Seeding records for " + emp.firstName + " " + emp.lastName + " (" + emp.employeeId + ")...");

        // Seed 3 days of Attendance
        for (let i = 1; i <= 3; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const checkIn = new Date(date);
            checkIn.setHours(9, Math.floor(Math.random() * 30), 0, 0); // ~9:00 AM - 9:30 AM
            
            const checkOut = new Date(date);
            checkOut.setHours(17, Math.floor(Math.random() * 30), 0, 0); // ~5:00 PM - 5:30 PM
            
            await prisma.attendance.create({
                data: {
                    employeeId: emp.id,
                    date: date,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    status: "PRESENT"
                }
            });
        }

        // Seed 1 Leave Request
        const leaveStart = new Date(today);
        leaveStart.setDate(leaveStart.getDate() + 5);
        const leaveEnd = new Date(leaveStart);
        leaveEnd.setDate(leaveEnd.getDate() + 2);

        await prisma.leaveRequest.create({
            data: {
                employeeId: emp.id,
                leaveType: "PAID",
                startDate: leaveStart,
                endDate: leaveEnd,
                status: emp.role === "ADMIN" ? "APPROVED" : "PENDING",
                remarks: "Family vacation trip"
            }
        });

        // Seed 1 Payroll Record
        const baseSalary = emp.role === "ADMIN" ? 120000 : emp.role === "HR" ? 85000 : 60000;
        const monthlyBase = baseSalary / 12;
        const allowances = monthlyBase * 0.10; // 10% allowance
        const deductions = monthlyBase * 0.15; // 15% tax/deductions
        const netSalary = monthlyBase + allowances - deductions;

        await prisma.payroll.create({
            data: {
                employeeId: emp.id,
                month: currentMonth === 1 ? 12 : currentMonth - 1, // previous month
                year: currentMonth === 1 ? currentYear - 1 : currentYear,
                basicSalary: monthlyBase,
                allowances: allowances,
                deductions: deductions,
                netSalary: netSalary,
                status: "GENERATED"
            }
        });
    }

    console.log("Successfully seeded Attendance, Leave, and Payroll records for all employees!");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
