const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    const defaultPassword = "Password@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const users = [
        {
            email: "hr@zindle.com",
            firstName: "Jane",
            lastName: "Manager",
            role: "HR",
            employeeId: "EMP0001"
        },
        {
            email: "employee1@zindle.com",
            firstName: "John",
            lastName: "Doe",
            role: "EMPLOYEE",
            employeeId: "EMP0002"
        },
        {
            email: "employee2@zindle.com",
            firstName: "Alice",
            lastName: "Smith",
            role: "EMPLOYEE",
            employeeId: "EMP0003"
        }
    ];

    for (const u of users) {
        const userId = uuidv4();
        
        // Upsert User
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                id: userId,
                name: u.firstName + " " + u.lastName,
                email: u.email,
                emailVerified: true,
                role: u.role,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Create Account for credentials
        await prisma.account.create({
            data: {
                id: uuidv4(),
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Create Employee record
        await prisma.employee.create({
            data: {
                employeeId: u.employeeId,
                userId: user.id,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                joiningDate: new Date(),
                role: u.role,
                isActive: true
            }
        });
        
        console.log("Created " + u.role + ": " + u.email + " (" + u.employeeId + ")");
    }
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
