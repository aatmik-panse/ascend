"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const LayoffTracker = ({ className }) => {
  // Tech layoff data formatted for Recharts
  const data = [
    { year: "2020", count: 119585, label: "119,585", isProjected: false },
    { year: "2021", count: 24761, label: "24,761", isProjected: false },
    { year: "2022", count: 243952, label: "243,952", isProjected: false },
    { year: "2023", count: 429608, label: "429,608", isProjected: false },
    { year: "2024", count: 238771, label: "238,771", isProjected: false },
    { year: "2025", count: 155252, label: "155,252", isProjected: true },
  ];

  // Custom colors with higher contrast using more vivid colors
  const barColors = {
    historical: "rgb(14, 165, 233)", // Bright sky blue (sky-500)
    projected: "rgb(249, 115, 22)", // Bright orange (orange-500)
  };

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

  // Enhanced custom tooltip with improved styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700/50 p-3 rounded-lg shadow-xl text-sm transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-zinc-300 font-medium">{data.year}</p>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs ${
              data.isProjected
                ? "bg-orange-500/20 text-orange-300"
                : "bg-sky-500/20 text-sky-300"
            }`}
          >
            {data.isProjected ? "Projected" : "Historical"}
          </span>
        </div>
        <p className="text-zinc-100 font-bold text-lg">
          {new Intl.NumberFormat().format(data.count)}
        </p>
        <p className="text-zinc-400 text-xs mt-1">Total employees impacted</p>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-orange-500/20">
            <TrendingDown className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold">Tech Layoff Tracker</h2>
        </div>

        {/* <div
          className="flex items-center text-xs text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer group"
          tabIndex="0"
          role="button"
          aria-label="View layoff details"
          onClick={() => {}}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              // Add action here
            }
          }}
        >
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </div> */}
      </div>

      {/* Chart section with improved visibility */}
      <div className="flex-1 min-h-[280px] relative bg-zinc-900/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
            barSize={30}
            maxBarSize={40}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-zinc-800/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-zinc-800/50"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.07)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "rgba(255, 255, 255, 0.8)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
              padding={{ left: 15, right: 15 }}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: "rgba(255, 255, 255, 0.8)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
              tickLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
              width={45}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="count"
              name="Employees Impacted"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              className="opacity-90 hover:opacity-100 transition-opacity"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isProjected
                      ? barColors.projected
                      : barColors.historical
                  }
                  stroke={
                    entry.isProjected
                      ? barColors.projected
                      : barColors.historical
                  }
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend section with improved contrast */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-5">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-sky-500 mr-1.5 shadow-sm"></div>
            <span>Historical</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-sm bg-orange-500 mr-1.5 shadow-sm"></div>
            <span>Projected</span>
          </div>
        </div>
        <a
          href="https://trueup.io/layoffs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-right text-zinc-400 hover:text-zinc-200 transition-colors"
          tabIndex="0"
          aria-label="Visit trueup.io for layoff data"
        >
          Source:{" "}
          <span className="underline underline-offset-2">
            trueup.io/layoffs
          </span>
        </a>
      </div>

      {/* Summary section */}
      <div className="mt-3 pt-3 border-t border-zinc-800 text-sm">
        <p className="text-zinc-400">
          As of May 1, 2025, over{" "}
          <span className="text-zinc-300 font-medium">155K</span> tech employees
          have been impacted by layoffs this year, on track to exceed 2021
          numbers.
        </p>
      </div>
    </div>
  );
};
