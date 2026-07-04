import Link from "next/link";
import { 
  ArrowRight, Users, Calendar, Banknote, ShieldCheck, 
  Sparkles, Layers, CheckCircle2, Bot, FileText, BarChart3, ChevronRight 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-[#111827] font-sans selection:bg-slate-200 selection:text-slate-900 overflow-x-hidden">
      
      {/* Apple & Linear Style Navigation Bar */}
      <nav className="w-full px-6 md:px-12 py-5 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#111827] rounded-xl flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111827]">Zindle</span>
          <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/80">
            Enterprise OS
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/signin" className="text-sm font-semibold text-slate-600 hover:text-[#111827] transition-colors">
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-semibold bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 group"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center max-w-[1400px] mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-slate-900 font-bold">New:</span> Zindle AI Copilot 2.0 with Action Confirmation Cards
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#111827] mb-8 max-w-5xl mx-auto leading-[1.04]">
          The award-winning <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">
            workforce CRM.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
          An ultra-refined, monotonic employee intelligence system. Precision-engineered for attendance tracking, leave workflows, automated payroll, and AI-driven analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-20">
          <Link 
            href="/signin" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] hover:bg-black text-white font-semibold rounded-2xl shadow-sm transition-all active:scale-95 text-base group"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/signup" 
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-[#111827] font-semibold rounded-2xl shadow-sm border border-slate-200/80 transition-all active:scale-95 text-base"
          >
            <span>Request Employee ID</span>
          </Link>
        </div>

        {/* Apple & Linear Style Interactive CRM Showcase */}
        <div className="w-full max-w-6xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-left mb-28">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-[#111827]">Workforce Overview</h3>
              <p className="text-xs text-slate-500">Real-time telemetry and employee status</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#F4F5F7] text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/60">Overview</span>
              <span className="text-slate-400 text-xs font-medium px-3 py-1 hover:text-slate-700 cursor-pointer">Directory</span>
              <span className="text-slate-400 text-xs font-medium px-3 py-1 hover:text-slate-700 cursor-pointer">Analytics</span>
            </div>
          </div>

          {/* CRM Metric Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Total Personnel</span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">↑ 14%</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#111827]">1,483</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Active Clock-Ins</span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">↑ 98%</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#111827]">1,210</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">AI Copilot Actions</span>
                <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">Automated</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#111827]">316</p>
            </div>
          </div>

          {/* Mini CRM Table Preview */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-[#FAFAFB]">
            <div className="grid grid-cols-12 bg-slate-100/60 px-4 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
              <div className="col-span-4">Employee & Role</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Current Module</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-200/60 bg-white text-xs">
              <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="col-span-4 flex items-center gap-2.5 font-semibold text-[#111827]">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">A</div>
                  <span>Admin User</span>
                </div>
                <div className="col-span-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-semibold">Active Now</span>
                </div>
                <div className="col-span-3 text-slate-500">Executive Overview</div>
                <div className="col-span-2 text-right text-slate-400">•••</div>
              </div>
              <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="col-span-4 flex items-center gap-2.5 font-semibold text-[#111827]">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">H</div>
                  <span>HR Manager</span>
                </div>
                <div className="col-span-3">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-semibold">In Progress</span>
                </div>
                <div className="col-span-3 text-slate-500">Leave Approvals</div>
                <div className="col-span-2 text-right text-slate-400">•••</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-4 text-center">
            Engineered for perfection.
          </h2>
          <p className="text-slate-500 text-center mb-16 max-w-xl mx-auto text-sm sm:text-base">
            Every feature is designed with zero clutter, maximum visual contrast, and instant responsiveness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-[#F4F5F7] border border-slate-200/80 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                <Users className="w-6 h-6 text-[#111827] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#111827] mb-2.5">Apple-Like Directory</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Clean table views with avatar stacks, department badges, and instant status filtering that feel as responsive as desktop native apps.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-[#F4F5F7] border border-slate-200/80 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                <Bot className="w-6 h-6 text-[#111827] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#111827] mb-2.5">AI Copilot Actions</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Role-aware natural language processing with interactive confirmation cards that execute secure database mutations without leaving chat.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 bg-[#F4F5F7] border border-slate-200/80 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                <FileText className="w-6 h-6 text-[#111827] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#111827] mb-2.5">Instant PDF Telemetry</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate branded executive PDF reports and workforce telemetry on demand with lightweight, lightning-fast client-side formatting.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E5E7EB] bg-white py-12 px-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Zindle HRMS. Designed with tasteful minimalism and precision.</p>
      </footer>
    </div>
  );
}