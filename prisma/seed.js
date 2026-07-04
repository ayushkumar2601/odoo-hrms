const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    const email = "admin@zyoris.com";
    const password = "Admin@123";
    
    // Better Auth using bcrypt via our auth.ts override expects a bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            id: userId,
            name: "System Admin",
            email: email,
            emailVerified: true,
            role: "ADMIN",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    await prisma.account.create({
        data: {
            id: uuidv4(),
            accountId: userId,
            providerId: "credential",
            userId: user.id,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    await prisma.employee.create({
        data: {
            employeeId: "EMP0000",
            userId: user.id,
            firstName: "System",
            lastName: "Admin",
            email: email,
            joiningDate: new Date(),
            role: "ADMIN",
            isActive: true
        }
    });

    console.log("Admin seeded successfully.");
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
