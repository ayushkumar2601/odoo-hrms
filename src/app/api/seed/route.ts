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

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully from the cloud!",
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
