import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const layoffData = [
  { name: "TechCorp", value: 1200 },
  { name: "RetailX", value: 900 },
  { name: "FinServe", value: 700 },
  { name: "EduPlus", value: 500 },
  { name: "HealthNow", value: 400 },
];

const affectedRoles = [
  "Customer Support",
  "Sales Associate",
  "QA Tester",
  "Operations Manager",
  "Marketing Specialist",
];

export function LayoffTracker({ className }) {
  return (
    <div
      className={cn(
        "card-gradient p-6 space-y-4 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold text-white">Layoff Tracker</h3>
      </div>
      <p className="text-sm text-zinc-400 mb-4">
        Recent layoffs (last 7–30 days)
      </p>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={layoffData}
            margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0A0A0", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0A0A0", fontSize: 10 }}
              domain={[0, 1200]}
              ticks={[0, 300, 600, 900, 1200]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {layoffData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#ef4444" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="font-semibold text-white mb-2">Most affected roles:</h4>
        <ul className="space-y-1 mb-6">
          {affectedRoles.map((role, index) => (
            <li
              key={index}
              className="text-sm text-zinc-400 flex items-center gap-2"
            >
              <span className="text-red-500">•</span> {role}
            </li>
          ))}
        </ul>

        <Button
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
          tabIndex="0"
          aria-label="Explore stable pivot roles"
          onClick={() => (window.location.href = "/career_pivot")}
          onKeyDown={(e) => {
            if (e.key === "Enter") window.location.href = "/career_pivot";
          }}
        >
          Explore stable pivot roles
        </Button>
      </div>
    </div>
  );
}
