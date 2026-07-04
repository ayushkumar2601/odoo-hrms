import { Sidebar } from "@/components/layout/Sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/signin");
  }

  // Determine role safely
  const role = session.user.role || "EMPLOYEE";

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-black">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}