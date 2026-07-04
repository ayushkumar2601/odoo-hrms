"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNotification(userId: string, title: string, message: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message
      }
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error(error);
  }
}

export async function markAllNotificationsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error(error);
  }
}
