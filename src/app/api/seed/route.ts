import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const adminEmail = "admin@zindle.com";
    
    // Check if admin already exists to prevent duplicate seeding
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
      return NextResponse.json({ message: "Database is already seeded!" }, { status: 200 });
    }

    const userId = uuidv4();
    
    const user = await prisma.user.create({
      data: {
        id: userId,
        name: "System Administrator",
        email: adminEmail,
        role: "ADMIN",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        mustChangePassword: true,
      }
    });

    await prisma.employee.create({
      data: {
        id: uuidv4(),
        user: { connect: { id: user.id } },
        employeeId: "EMP0001",
        email: adminEmail,
        firstName: "System",
        lastName: "Administrator",
        department: "Management",
        designation: "CEO",
        joiningDate: new Date(),
        baseSalary: 150000,
        role: "ADMIN",
      }
    });

    // Create 55 bulk employees for demo data
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    
    for (let i = 10; i <= 65; i++) {
        const empId = `EMP${i.toString().padStart(4, '0')}`;
        const email = `bulk.employee${i}@zindle.com`;
        
        const randomDays = Math.floor(Math.random() * 30);
        const joiningDate = new Date(fourMonthsAgo);
        joiningDate.setDate(joiningDate.getDate() + randomDays);
        
        const empUserId = uuidv4();
        
        const empUser = await prisma.user.create({
            data: {
                id: empUserId,
                name: `Employee ${i}`,
                email,
                role: 'EMPLOYEE',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        await prisma.employee.create({
            data: {
                id: uuidv4(),
                user: { connect: { id: empUser.id } },
                employeeId: empId,
                email: email,
                firstName: 'Employee',
                lastName: `${i}`,
                department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Support'][Math.floor(Math.random() * 5)],
                designation: 'Staff',
                joiningDate: joiningDate,
                baseSalary: Math.floor(Math.random() * 50000) + 50000
            }
        });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully from the cloud! Includes Admin and 55 Employees.",
      adminCredentials: {
        email: adminEmail,
        password: "You will set this via the /signup portal using Employee ID: EMP0001"
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Cloud Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
