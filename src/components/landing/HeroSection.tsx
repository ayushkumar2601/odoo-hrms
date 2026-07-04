"use client";

import React, { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { Navbar } from "./Navbar";
import { DashboardMockup } from "./DashboardMockup";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/signin`);
    }
  };

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col font-sans"
      style={{
        backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85")`,
      }}
    >
      {/* Grass Overlay */}
      <img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
        alt="Grass bottom overlay"
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none object-cover"
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Spacer 1 */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Hero Content */}
      <div className="relative z-20 px-5 sm:px-8 text-center max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Staggered Two-Line Headline */}
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] flex flex-col items-center">
          <span className="animate-fade-up block">
            India&apos;s Intelligent
          </span>
          <span className="animate-fade-up block [animation-delay:100ms] font-medium">
            Workforce OS
          </span>
        </h1>

        {/* Pill Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="animate-fade-up [animation-delay:220ms] mt-5 sm:mt-6 w-full max-w-xl mx-auto"
        >
          <div className="flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5 shadow-sm hover:ring-gray-400 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Which employees need attendance or leave follow-up?"
              className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-2"
            />
            <button
              type="submit"
              aria-label="Submit query"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center shadow-xs"
            >
              <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </form>

        {/* Description */}
        <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto font-medium">
          One platform for HR, Attendance, Payroll and Operations.<br />
          <span className="inline-flex items-center gap-1.5 mt-1">
            <Sparkles className="w-4 h-4 text-black inline -mt-0.5 animate-pulse" />
            With AI that tells you what to do next, not just what already happened.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up [animation-delay:460ms] mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer"
          >
            Get Early Access
          </button>
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="text-gray-900 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:ring-black hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300 bg-white/50 backdrop-blur-xs cursor-pointer"
          >
            Book a Demo
          </button>
        </div>
      </div>

      {/* Spacer 2 */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup Chrome */}
      <div className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32">
        <DashboardMockup />
      </div>
    </section>
  );
}
