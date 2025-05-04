"use client";
import React, { useState, useEffect } from "react";
import { PivotSnapshot } from "@/components/dashboard/PivotSnapshot";
import { LayoffTracker } from "@/components/dashboard/LayoffTracker";
import { TodaysAction } from "@/components/dashboard/TodaysAction";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { Shortcuts } from "@/components/dashboard/Shortcuts";
import { RecommendedPivots } from "@/components/dashboard/RecommendedPivots";
import { Clock, ChartBar, Database, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  // Cache state tracking
  const [dataSource, setDataSource] = useState({
    pivots: null,
    layoffs: null,
    shortcuts: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Common card styling class to ensure consistency
  const cardStyle =
    "rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/95 to-zinc-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-zinc-700/60 transition-all duration-300 p-6 overflow-hidden";

  // Minimum height classes to prevent CLS (Cumulative Layout Shift)
  const minHeightCard = "min-h-[320px]";
  const minHeightFirstRow = "min-h-[360px]";

  // Check cache status on initial load
  useEffect(() => {
    const checkCacheStatus = () => {
      const cachedPivots = localStorage.getItem("dashboard-pivots");
      const cachedLayoffs = localStorage.getItem("dashboard-layoffs");
      const cachedShortcuts = localStorage.getItem("dashboard-shortcuts");

      const pivotTimestamp = localStorage.getItem("dashboard-pivots-timestamp");
      const layoffTimestamp = localStorage.getItem(
        "dashboard-layoffs-timestamp"
      );
      const shortcutsTimestamp = localStorage.getItem(
        "dashboard-shortcuts-timestamp"
      );

      setDataSource({
        pivots: cachedPivots && isCacheFresh(pivotTimestamp) ? "cache" : "api",
        layoffs:
          cachedLayoffs && isCacheFresh(layoffTimestamp) ? "cache" : "api",
        shortcuts:
          cachedShortcuts && isCacheFresh(shortcutsTimestamp) ? "cache" : "api",
      });
    };

    checkCacheStatus();
  }, []);

  // Check if cache is fresh (less than 24 hours old)
  const isCacheFresh = (timestamp) => {
    if (!timestamp) return false;
    const cacheTime = parseInt(timestamp, 10);
    const now = Date.now();
    return now - cacheTime < 24 * 60 * 60 * 1000; // 24 hours
  };

  // Handle manual refresh of dashboard data
  const handleRefreshDashboard = async () => {
    try {
      setIsRefreshing(true);

      // Clear specific caches to force components to reload from API
      localStorage.removeItem("dashboard-pivots");
      localStorage.removeItem("dashboard-pivots-timestamp");
      localStorage.removeItem("dashboard-layoffs");
      localStorage.removeItem("dashboard-layoffs-timestamp");
      localStorage.removeItem("dashboard-shortcuts");
      localStorage.removeItem("dashboard-shortcuts-timestamp");

      // Set data sources to API
      setDataSource({
        pivots: "api",
        layoffs: "api",
        shortcuts: "api",
      });

      // Small delay to show refreshing state
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Dashboard refreshed with latest data");
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast.error("Error refreshing dashboard data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-zinc-950 text-zinc-100 rounded-2xl animate-fade-in">
      {/* Dashboard header with refresh option */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            Your career insights at a glance
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-zinc-700 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={handleRefreshDashboard}
          disabled={isRefreshing}
          aria-label="Refresh dashboard data"
          tabIndex="0"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* First row - 2 cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="relative">
          {dataSource.pivots === "cache" && (
            <Badge className="absolute top-2 right-2 z-20 bg-green-900/40 text-green-400 border-green-800/50 px-2 py-0.5 text-xs flex items-center">
              <Database className="h-3 w-3 mr-1" /> Cached
            </Badge>
          )}
          <RecommendedPivots
            className={`${cardStyle} ${minHeightFirstRow} hover-scale`}
            dataSource={dataSource.pivots}
            onDataLoaded={(source) => {
              setDataSource((prev) => ({ ...prev, pivots: source }));
              if (source === "api") {
                localStorage.setItem(
                  "dashboard-pivots-timestamp",
                  Date.now().toString()
                );
              }
            }}
          />
        </div>

        <div className="relative">
          {dataSource.layoffs === "cache" && (
            <Badge className="absolute top-2 right-2 z-20 bg-green-900/40 text-green-400 border-green-800/50 px-2 py-0.5 text-xs flex items-center">
              <Database className="h-3 w-3 mr-1" /> Cached
            </Badge>
          )}
          <LayoffTracker
            className={`${cardStyle} ${minHeightFirstRow} hover-scale`}
            dataSource={dataSource.layoffs}
            onDataLoaded={(source) => {
              setDataSource((prev) => ({ ...prev, layoffs: source }));
              if (source === "api") {
                localStorage.setItem(
                  "dashboard-layoffs-timestamp",
                  Date.now().toString()
                );
              }
            }}
          />
        </div>
      </section>

      {/* Second row - 3 cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="relative">
          {dataSource.shortcuts === "cache" && (
            <Badge className="absolute top-2 right-2 z-20 bg-green-900/40 text-green-400 border-green-800/50 px-2 py-0.5 text-xs flex items-center">
              <Database className="h-3 w-3 mr-1" /> Cached
            </Badge>
          )}
          <Shortcuts
            className={`${cardStyle} ${minHeightCard} hover-scale`}
            dataSource={dataSource.shortcuts}
            onDataLoaded={(source) => {
              setDataSource((prev) => ({ ...prev, shortcuts: source }));
              if (source === "api") {
                localStorage.setItem(
                  "dashboard-shortcuts-timestamp",
                  Date.now().toString()
                );
              }
            }}
          />
        </div>

        {/* TodaysAction with Coming Soon overlay */}
        <div className={`relative ${minHeightCard}`}>
          <div className="absolute inset-0 z-10 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-zinc-700">
            <Clock className="h-10 w-10 text-zinc-500 mb-3" />
            <h3 className="text-xl font-bold text-zinc-300">Coming Soon</h3>
            <p className="text-zinc-500 text-sm mt-2 text-center px-4">
              Daily action plans and progress tracking
            </p>
          </div>
          <TodaysAction
            className={`${cardStyle} ${minHeightCard} filter blur-[2px] opacity-60`}
          />
        </div>

        {/* ProgressSummary with Coming Soon overlay */}
        <div className={`relative ${minHeightCard}`}>
          <div className="absolute inset-0 z-10 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-zinc-700">
            <ChartBar className="h-10 w-10 text-zinc-500 mb-3" />
            <h3 className="text-xl font-bold text-zinc-300">Coming Soon</h3>
            <p className="text-zinc-500 text-sm mt-2 text-center px-4">
              Progress metrics and achievement tracking
            </p>
          </div>
          <ProgressSummary
            className={`${cardStyle} ${minHeightCard} filter blur-[2px] opacity-60`}
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
