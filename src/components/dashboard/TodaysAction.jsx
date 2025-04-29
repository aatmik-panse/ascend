import React from "react";
import { cn } from "@/lib/utils";

export function TodaysAction({ className }) {
  // Current status
  const daysLeft = 3;
  const hoursLeft = 4;
  const targetHours = 5;

  return (
    <div className={cn("card-gradient p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-500">📋</span>
        <h3 className="text-xl font-bold text-white">Today's Action</h3>
      </div>
      <p className="text-sm text-zinc-400 mb-5">
        Stay on track with your roadmap
      </p>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white">
          Finish Week 2: SQL mini-lesson
        </h4>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div>Time left this week:</div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-600/20 text-blue-500 px-2 py-1 rounded text-xs font-medium">
            {daysLeft}d {hoursLeft}h
          </span>
          <span className="text-gray-500">vs. commitment:</span>
          <span className="bg-zinc-800 text-gray-400 px-2 py-1 rounded text-xs font-medium">
            {targetHours}h
          </span>
        </div>
      </div>
    </div>
  );
}
