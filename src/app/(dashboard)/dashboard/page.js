"use client";
import React from "react";
import { PivotSnapshot } from "@/components/dashboard/PivotSnapshot";
import { LayoffTracker } from "@/components/dashboard/LayoffTracker";
import { TodaysAction } from "@/components/dashboard/TodaysAction";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { Shortcuts } from "@/components/dashboard/Shortcuts";
import { RecommendedPivots } from "@/components/dashboard/RecommendedPivots";
import { Clock, ChartBar } from "lucide-react";

const Dashboard = () => {
  // Common card styling class to ensure consistency
  const cardStyle =
    "rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/95 to-zinc-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-zinc-700/60 transition-all duration-300 p-6 overflow-hidden";

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-zinc-950 text-zinc-100 rounded-2xl animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* First Row */}
        <RecommendedPivots className={`${cardStyle} hover-scale`} />
        <LayoffTracker
          className={`${cardStyle} hover-scale md:col-span-1 lg:col-span-2`}
        />

        {/* Second Row */}
        <Shortcuts className={`${cardStyle} hover-scale`} />

        {/* TodaysAction with Coming Soon overlay */}
        <div className="relative">
          <div className="absolute inset-0 z-10 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-zinc-700">
            <Clock className="h-10 w-10 text-zinc-500 mb-3" />
            <h3 className="text-xl font-bold text-zinc-300">Coming Soon</h3>
            <p className="text-zinc-500 text-sm mt-2 text-center px-4">
              Daily action plans and progress tracking
            </p>
          </div>
          <TodaysAction
            className={`${cardStyle} filter blur-[2px] opacity-60`}
          />
        </div>

        {/* ProgressSummary with Coming Soon overlay */}
        <div className="relative">
          <div className="absolute inset-0 z-10 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-zinc-700">
            <ChartBar className="h-10 w-10 text-zinc-500 mb-3" />
            <h3 className="text-xl font-bold text-zinc-300">Coming Soon</h3>
            <p className="text-zinc-500 text-sm mt-2 text-center px-4">
              Progress metrics and achievement tracking
            </p>
          </div>
          <ProgressSummary
            className={`${cardStyle} filter blur-[2px] opacity-60`}
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
