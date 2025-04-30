"use client";
import React from "react";
import { PivotSnapshot } from "@/components/dashboard/PivotSnapshot";
import { LayoffTracker } from "@/components/dashboard/LayoffTracker";
import { TodaysAction } from "@/components/dashboard/TodaysAction";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { Shortcuts } from "@/components/dashboard/Shortcuts";
import { RecommendedPivots } from "@/components/dashboard/RecommendedPivots";

const Dashboard = () => {
  // Common card styling class to ensure consistency
  const cardStyle =
    "rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/95 to-zinc-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-zinc-700/60 transition-all duration-300 p-6 overflow-hidden";

  return (
    <main className="p-8 max-w-7xl mx-auto bg-zinc-950 text-zinc-100 rounded-2xl animate-fade-in">
      {/* Main sections with top row (2-column) and bottom row (3-column) layout */}
      <section className="space-y-8">
        {/* Top row - Recommended Pivots, Pivot Snapshot and Layoff tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecommendedPivots
            className={`${cardStyle} hover-scale lg:col-span-1`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:col-span-2">
            <PivotSnapshot className={`${cardStyle} hover-scale`} />
            <LayoffTracker className={`${cardStyle} hover-scale`} />
          </div>
        </div>

        {/* Bottom row - Actions, Progress and Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TodaysAction className={`${cardStyle} hover-scale`} />
          <ProgressSummary className={`${cardStyle} hover-scale`} />
          <Shortcuts className={`${cardStyle} hover-scale`} />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
