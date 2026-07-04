const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@zyoris.com";
    const adminPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const userId = uuidv4();

    // Create or Update Admin User
    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            mustChangePassword: true,
            role: "ADMIN"
        },
        create: {
            id: userId,
            name: "System Administrator",
            email: adminEmail,
            emailVerified: true,
            role: "ADMIN",
            mustChangePassword: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    // Check if Account exists, if so update password, else create
    const existingAccount = await prisma.account.findFirst({
        where: { userId: user.id, providerId: "credential" }
    });

    if (existingAccount) {
        await prisma.account.update({
            where: { id: existingAccount.id },
            data: { password: hashedPassword }
        });
    } else {
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
    }

    // Create Employee record for Admin
    await prisma.employee.upsert({
        where: { email: adminEmail },
        update: {
            role: "ADMIN"
        },
        create: {
            employeeId: "EMP0000",
            userId: user.id,
            firstName: "System",
            lastName: "Admin",
            email: adminEmail,
            joiningDate: new Date(),
            role: "ADMIN",
            isActive: true
        }
    });

    console.log("Admin account seeded successfully!");
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
