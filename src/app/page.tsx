import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureSections } from "@/components/landing/FeatureSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827] font-sans selection:bg-slate-200 selection:text-slate-900 overflow-x-hidden">
      <HeroSection />
      <FeatureSections />
    </div>
  );
}