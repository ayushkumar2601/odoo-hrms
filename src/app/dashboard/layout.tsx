import { Sidebar } from "@/components/layout/Sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Search, Bell, Sparkles } from "lucide-react";
import { FloatingCopilot } from "@/components/copilot/FloatingCopilot";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role || "EMPLOYEE";

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] font-sans text-[#111827] select-none">
      <Sidebar 
        role={role} 
        userName={session.user.name} 
        userEmail={session.user.email} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Apple & Linear Style Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-3 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-1.5 w-96 focus-within:bg-white focus-within:border-slate-400 focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search customers, employees, or modules..." 
              className="bg-transparent border-none outline-none text-xs md:text-sm w-full placeholder:text-slate-400 text-[#111827]"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 rounded-full px-3 py-1 text-xs font-medium text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Zindle OS 2.0</span>
            </div>

            <button className="relative p-2 rounded-xl text-slate-500 hover:text-[#111827] hover:bg-slate-100 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#111827] leading-none">{session.user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
      <FloatingCopilot />
    </div>
  );
}