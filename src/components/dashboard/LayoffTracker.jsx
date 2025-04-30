"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, InfoIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const LayoffTracker = ({ className }) => {
  // Tech layoff data formatted for Recharts
  const data = [
    { year: "2020", count: 119585, label: "119,585", isProjected: false },
    { year: "2021", count: 24761, label: "24,761", isProjected: false },
    { year: "2022", count: 243952, label: "243,952", isProjected: false },
    { year: "2023", count: 429608, label: "429,608", isProjected: false },
    { year: "2024", count: 238771, label: "238,771", isProjected: false },
    { year: "2025 YTD", count: 155252, label: "155,252", isProjected: true },
  ];

  // Format large numbers with K or M suffix
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  // Custom tooltip to show formatted numbers
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded-lg text-xs">
          <p className="text-zinc-300 font-medium">{data.year}</p>
          <p className="text-zinc-100 font-semibold">
            {new Intl.NumberFormat().format(data.count)} employees
          </p>
          <p className="text-zinc-400 text-xs">
            {data.isProjected ? "Projected" : "Historical"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 rounded-md bg-red-500/20">
          <TrendingDown className="h-5 w-5 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold">Tech Layoff Tracker</h2>
      </div>

      <div className="flex-1 min-h-[240px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar
              dataKey="count"
              name="Employees Impacted"
              fill={(data) =>
                data.isProjected
                  ? "rgba(255, 99, 132, 0.5)"
                  : "rgba(75, 192, 192, 0.5)"
              }
              stroke={(data) =>
                data.isProjected ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)"
              }
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-[rgba(75,192,192,0.5)] mr-1"></div>
            <span>Historical</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-[rgba(255,99,132,0.5)] mr-1"></div>
            <span>Projected</span>
          </div>
        </div>
        <p className="text-right">Source: trueup.io/layoffs</p>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 text-sm">
        <p className="text-zinc-400">
          As of May 1, 2025, over 155K tech employees have been impacted by
          layoffs this year, on track to exceed 2021 numbers.
        </p>
      </div>
    </div>
  );
};
