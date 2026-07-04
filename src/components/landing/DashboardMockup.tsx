"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share2,
  Plus,
  Copy,
  Grid,
  Search,
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Sparkles,
  TrendingUp,
  BarChart3,
  UserCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";

interface ScaledDashboardProps {
  children: React.ReactNode;
}

function ScaledDashboard({ children }: ScaledDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const designWidth = 896; // 896px fixed design width as specified

    const handleResize = () => {
      const containerWidth = container.offsetWidth;
      const newScale = Math.min(1, containerWidth / designWidth);
      setScale(newScale);
      setHeight(inner.offsetHeight * newScale);
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(container);
    if (inner) observer.observe(inner);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: height ? `${height}px` : "auto" }}
    >
      <div
        ref={innerRef}
        style={{
          width: "896px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="transition-transform duration-75 ease-out"
      >
        {children}
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <ScaledDashboard>
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left font-sans select-none">
        
        {/* Title bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Traffic Lights */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            {/* Left Chrome Icons */}
            <div className="flex items-center gap-2">
              <PanelLeft className="w-3.5 h-3.5 text-white/40 hover:text-white/70 transition-colors" />
              <ChevronLeft className="w-3.5 h-3.5 text-white/25" />
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            </div>
          </div>

          {/* Center URL bar */}
          <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[11px] text-white/60 flex items-center gap-2 border border-white/5 shadow-inner">
            <Monitor className="w-3 h-3 text-blue-400" />
            <span className="tracking-wide">zyoris.com / zindle-hrms</span>
          </div>

          {/* Right Chrome Icons */}
          <div className="flex items-center gap-3 text-white/40">
            <RotateCw className="w-3.5 h-3.5 hover:text-white/70 transition-colors" />
            <Share2 className="w-3.5 h-3.5 hover:text-white/70 transition-colors" />
            <Plus className="w-3.5 h-3.5 hover:text-white/70 transition-colors" />
            <Copy className="w-3.5 h-3.5 hover:text-white/70 transition-colors" />
          </div>
        </div>

        {/* Dashboard Shell Body */}
        <div className="flex min-h-[580px] bg-[#141416]">
          
          {/* Sidebar (22% width approx ~196px) */}
          <div className="w-[200px] border-r border-white/5 bg-[#1e1e21] px-3 py-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Workspace Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 font-bold flex items-center justify-center text-white text-xs shadow-sm">
                    Z
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">ZYORIS</span>
                </div>
                <Grid className="w-3.5 h-3.5 text-white/30" />
              </div>

              {/* Sidebar Search Bar */}
              <div className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-white/40">
                <Search className="w-3 h-3" />
                <span className="text-[11px]">Search...</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <div className="bg-blue-600/20 text-blue-400 font-semibold rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 border border-blue-500/20 shadow-2xs">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </div>
                <div className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors">
                  <Briefcase className="w-3.5 h-3.5 text-white/40" />
                  <span>Sales CRM</span>
                </div>
                <div className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors">
                  <Users className="w-3.5 h-3.5 text-white/40" />
                  <span>HR & People</span>
                </div>
                <div className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors">
                  <DollarSign className="w-3.5 h-3.5 text-white/40" />
                  <span>Finance</span>
                </div>
                <div className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors">
                  <Activity className="w-3.5 h-3.5 text-white/40" />
                  <span>Operations</span>
                </div>
                <div className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>AI Intelligence</span>
                </div>
              </div>
            </div>

            {/* Bottom Status / Recent Telemetry */}
            <div className="border-t border-white/5 pt-3 px-1 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-white/40 font-medium">
                <span>SYSTEM STATUS</span>
                <span className="flex items-center gap-1 text-[#28c840]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] animate-pulse" />
                  Online
                </span>
              </div>
              <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                <div className="text-[10px] text-white/80 font-medium truncate">Zindle AI Copilot 2.0</div>
                <div className="text-[9px] text-white/40 mt-0.5">Groq LPU • Sub-300ms</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-hidden">
            
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                  Z
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Good morning, Ayush 👋
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Here&apos;s what&apos;s happening across your business today.
                  </p>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Stats Grid (4 columns) */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] border border-white/5 my-5">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-white/40 uppercase">REVENUE</span>
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1.5">₹98.7L</div>
                <div className="text-[10px] text-[#28c840] font-medium mt-1 flex items-center gap-1">
                  <span>This month</span> • <span>+14%</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-white/40 uppercase">PIPELINE</span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1.5">73</div>
                <div className="text-[10px] text-[#28c840] font-medium mt-1 flex items-center gap-1">
                  <span>Active deals</span> • <span>+8</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-white/40 uppercase">FORECAST</span>
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1.5">94%</div>
                <div className="text-[10px] text-[#28c840] font-medium mt-1 flex items-center gap-1">
                  <span>Confidence</span> • <span>High</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-white/40 uppercase">TEAM</span>
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mt-1.5">124</div>
                <div className="text-[10px] text-[#28c840] font-medium mt-1 flex items-center gap-1">
                  <span>Members</span> • <span>+5 new</span>
                </div>
              </div>
            </div>

            {/* Middle Row: AI Recommendations + Team Activity */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Left Card: AI Recommendations (7 cols) */}
              <div className="col-span-7 rounded-xl bg-white/[0.03] border border-white/5 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-xs font-bold text-white">AI Recommendations</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-400 bg-blue-600/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-[11px] text-white/80 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Call Acme Corporation today.</strong> Win probability increased 12% in the last 48 hours.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px] text-white/80 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Revenue projected to exceed target</strong> by ₹4.2L this month based on current velocity.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px] text-white/80 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">3 invoices require immediate follow-up</strong> before quarter closing.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-end mt-4">
                  <span className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer flex items-center gap-1">
                    <span>View all recommendations</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Right Card: Team Activity (5 cols) */}
              <div className="col-span-5 rounded-xl bg-white/[0.03] border border-white/5 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-white">Team Activity</span>
                    <span className="text-[10px] text-white/40">Real-time</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white">Priya Sharma onboarded</div>
                          <div className="text-[9px] text-white/40">HR & People</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40">2h ago</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white">Interview with Raj scheduled</div>
                          <div className="text-[9px] text-white/40">Engineering</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40">4h ago</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white">Leave request approved</div>
                          <div className="text-[9px] text-white/40">Attendance Telemetry</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40">5h ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-end mt-4">
                  <span className="text-[11px] text-white/60 hover:text-white font-medium cursor-pointer">
                    Audit Logs →
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row Preview: Finance / HR Overview */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 mt-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Finance & Payroll Overview</div>
                  <div className="text-[10px] text-white/40">Outstanding invoices: ₹42,000 • 3 pending approvals</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/60 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                  Automated Dispersal Ready
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </ScaledDashboard>
  );
}
