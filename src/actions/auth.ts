"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { logAudit } from "./audit";

export async function updateForcedPassword(newPassword: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: "Unauthorized" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Account
    await prisma.account.updateMany({
      where: { userId: session.user.id, providerId: "credential" },
      data: { password: hashedPassword }
    });

    // Clear mustChangePassword
    await prisma.user.update({
      where: { id: session.user.id },
      data: { mustChangePassword: false }
    });

    await logAudit(session.user.id, "PASSWORD_CHANGED", "User completed forced password reset");

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Failed to update password" };
  }
}
