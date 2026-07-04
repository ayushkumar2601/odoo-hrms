import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markAllNotificationsRead } from "@/actions/notification";
import { Bell, CheckCircle2 } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const handleMarkAllRead = async () => {
    "use server";
    await markAllNotificationsRead(session.user.id);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your latest alerts.</p>
        </div>
        <form action={handleMarkAllRead}>
          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map(notif => (
              <li key={notif.id} className={`p-6 hover:bg-gray-50 transition ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold text-gray-900 ${!notif.read ? 'text-blue-900' : ''}`}>
                      {notif.title}
                      {!notif.read && <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-blue-600"></span>}
                    </h3>
                    <p className="text-gray-600 mt-1">{notif.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
