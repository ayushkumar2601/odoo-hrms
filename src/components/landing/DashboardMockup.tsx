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

    const designWidth = 896;

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
      <div className="rounded-t-2xl overflow-hidden bg-white shadow-[0_-20px_80px_rgba(0,0,0,0.12)] ring-1 ring-gray-200/80 text-left font-sans select-none">
        
        {/* Title bar */}
        <div className="bg-[#F8FAFC] border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Monochromatic Traffic Lights */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
            </div>
            {/* Left Chrome Icons */}
            <div className="flex items-center gap-2">
              <PanelLeft className="w-3.5 h-3.5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" />
              <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            </div>
          </div>

          {/* Center URL bar */}
          <div className="bg-white rounded-md px-6 py-1 text-[11px] text-gray-700 font-medium flex items-center gap-2 border border-gray-200 shadow-inner">
            <Monitor className="w-3 h-3 text-black" />
            <span className="tracking-wide font-mono">zindle.ai / dashboard</span>
          </div>

          {/* Right Chrome Icons */}
          <div className="flex items-center gap-3 text-gray-400">
            <RotateCw className="w-3.5 h-3.5 hover:text-gray-800 transition-colors cursor-pointer" />
            <Share2 className="w-3.5 h-3.5 hover:text-gray-800 transition-colors cursor-pointer" />
            <Plus className="w-3.5 h-3.5 hover:text-gray-800 transition-colors cursor-pointer" />
            <Copy className="w-3.5 h-3.5 hover:text-gray-800 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Dashboard Shell Body */}
        <div className="flex min-h-[580px] bg-white">
          
          {/* Sidebar (22% width approx ~200px) */}
          <div className="w-[200px] border-r border-gray-200 bg-[#FAFAFB] px-3 py-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Workspace Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-black font-bold flex items-center justify-center text-white text-xs shadow-xs">
                    Z
                  </div>
                  <span className="text-xs font-bold text-gray-900 tracking-wide">ZINDLE</span>
                </div>
                <Grid className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* Sidebar Search Bar */}
              <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-gray-400 shadow-2xs hover:border-gray-400 transition-colors cursor-pointer">
                <Search className="w-3 h-3 text-gray-500" />
                <span className="text-[11px]">Search...</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <div className="bg-black text-white font-semibold rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 shadow-xs">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </div>
                <div className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span>Sales CRM</span>
                </div>
                <div className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>HR & People</span>
                </div>
                <div className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors cursor-pointer">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  <span>Finance</span>
                </div>
                <div className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Activity className="w-3.5 h-3.5 text-gray-400" />
                  <span>Operations</span>
                </div>
                <div className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 text-[11px] flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                  <span>AI Intelligence</span>
                </div>
              </div>
            </div>

            {/* Bottom Status / Recent Telemetry */}
            <div className="border-t border-gray-200 pt-3 px-1 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold tracking-wider">
                <span>SYSTEM STATUS</span>
                <span className="flex items-center gap-1 text-black font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  Online
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-2xs">
                <div className="text-[10px] text-gray-900 font-semibold truncate">Zindle AI Copilot 2.0</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Groq LPU • Sub-300ms</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-hidden bg-white">
            
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center font-bold text-white text-base shadow-sm">
                  Z
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    Good morning, Ayush 👋
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Here&apos;s what&apos;s happening across your workforce today.
                  </p>
                </div>
              </div>

              <button className="bg-black hover:bg-gray-800 text-white text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Stats Grid (4 columns) */}
            <div className="grid grid-cols-4 divide-x divide-gray-200 rounded-xl bg-[#FAFAFB] border border-gray-200 my-5 shadow-2xs">
              <div className="p-4 hover:bg-white transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">REVENUE</span>
                  <DollarSign className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="text-xl font-bold text-gray-900 mt-1.5">₹98.7L</div>
                <div className="text-[10px] text-gray-600 font-medium mt-1 flex items-center gap-1">
                  <span className="font-semibold text-black">+14%</span> • <span>This month</span>
                </div>
              </div>

              <div className="p-4 hover:bg-white transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">PIPELINE</span>
                  <TrendingUp className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="text-xl font-bold text-gray-900 mt-1.5">73</div>
                <div className="text-[10px] text-gray-600 font-medium mt-1 flex items-center gap-1">
                  <span className="font-semibold text-black">+8</span> • <span>Active deals</span>
                </div>
              </div>

              <div className="p-4 hover:bg-white transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">FORECAST</span>
                  <BarChart3 className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="text-xl font-bold text-gray-900 mt-1.5">94%</div>
                <div className="text-[10px] text-gray-600 font-medium mt-1 flex items-center gap-1">
                  <span className="font-semibold text-black">High</span> • <span>Confidence</span>
                </div>
              </div>

              <div className="p-4 hover:bg-white transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">TEAM</span>
                  <UserCheck className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="text-xl font-bold text-gray-900 mt-1.5">124</div>
                <div className="text-[10px] text-gray-600 font-medium mt-1 flex items-center gap-1">
                  <span className="font-semibold text-black">+5 new</span> • <span>Members</span>
                </div>
              </div>
            </div>

            {/* Middle Row: AI Recommendations + Team Activity */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Left Card: AI Recommendations (7 cols) */}
              <div className="col-span-7 rounded-xl bg-[#FAFAFB] border border-gray-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-gray-400 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900">AI Recommendations</span>
                    </div>
                    <span className="text-[10px] font-bold text-black bg-gray-200/80 border border-gray-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-[11px] text-gray-700 leading-relaxed group hover:translate-x-1 transition-transform duration-200 cursor-pointer">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-gray-900">Call Acme Corporation today.</strong> Win probability increased 12% in the last 48 hours.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px] text-gray-700 leading-relaxed group hover:translate-x-1 transition-transform duration-200 cursor-pointer">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-gray-900">Revenue projected to exceed target</strong> by ₹4.2L this month based on current velocity.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[11px] text-gray-700 leading-relaxed group hover:translate-x-1 transition-transform duration-200 cursor-pointer">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-gray-900">3 invoices require immediate follow-up</strong> before quarter closing.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end mt-4">
                  <span className="text-[11px] text-black hover:text-gray-600 font-bold cursor-pointer flex items-center gap-1 group">
                    <span>View all recommendations</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Right Card: Team Activity (5 cols) */}
              <div className="col-span-5 rounded-xl bg-[#FAFAFB] border border-gray-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-gray-400 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-900">Team Activity</span>
                    <span className="text-[10px] font-semibold text-gray-500">Real-time</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between group hover:translate-x-1 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-black">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-900">Priya Sharma onboarded</div>
                          <div className="text-[9px] text-gray-500">HR & People</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">2h ago</span>
                    </div>

                    <div className="flex items-center justify-between group hover:translate-x-1 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-black">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-900">Interview with Raj scheduled</div>
                          <div className="text-[9px] text-gray-500">Engineering</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">4h ago</span>
                    </div>

                    <div className="flex items-center justify-between group hover:translate-x-1 transition-transform duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-black">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-900">Leave request approved</div>
                          <div className="text-[9px] text-gray-500">Attendance Telemetry</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">5h ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end mt-4">
                  <span className="text-[11px] text-gray-600 hover:text-black font-bold cursor-pointer transition-colors">
                    Audit Logs →
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row Preview: Finance / HR Overview */}
            <div className="rounded-xl bg-[#FAFAFB] border border-gray-200 p-4 mt-5 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-gray-400 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-black">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Finance & Payroll Overview</div>
                  <div className="text-[10px] text-gray-500 font-medium">Outstanding invoices: ₹42,000 • 3 pending approvals</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-black bg-white px-3 py-1 rounded-md border border-gray-200 shadow-2xs">
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
