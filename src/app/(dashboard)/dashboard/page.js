"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  ClipboardList,
  Flame,
  Rocket,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

// Mock data fetching functions (replace with real data fetching as needed)
const fetchPivotSnapshot = async () => [
  {
    fitScore: 87,
    title: "Product Manager, AI",
    reason:
      "Your experience in analytics and leadership matches key requirements.",
  },
  {
    fitScore: 82,
    title: "Data Analyst",
    reason: "Strong SQL and dashboarding skills align with this role.",
  },
];

const fetchLayoffData = async () => ({
  chart: [
    {
      company: "TechCorp",
      layoffs: 1200,
      industry: "Tech",
      date: "2024-06-01",
    },
    {
      company: "RetailX",
      layoffs: 900,
      industry: "Retail",
      date: "2024-06-03",
    },
    {
      company: "FinServe",
      layoffs: 700,
      industry: "Finance",
      date: "2024-06-05",
    },
    {
      company: "EduPlus",
      layoffs: 500,
      industry: "Education",
      date: "2024-06-07",
    },
    {
      company: "HealthNow",
      layoffs: 400,
      industry: "Healthcare",
      date: "2024-06-09",
    },
  ],
  mostAffectedRoles: [
    "Customer Support",
    "Sales Associate",
    "QA Tester",
    "Operations Manager",
    "Marketing Specialist",
  ],
});

const fetchTodayAction = async () => ({
  action: "Finish Week 2: SQL mini-lesson",
  timeLeft: "3d 4h",
  weeklyCommitment: "5h",
});

const fetchProgressSummary = async () => ({
  progress: 40,
  skills: ["SQL", "Product Thinking", "User Research"],
  streak: 7,
});

const shortcuts = [
  {
    label: "Resume Booster",
    icon: Rocket,
    href: "/resume-booster",
    aria: "Open Resume Booster",
  },
  {
    label: "Chat with Coach",
    icon: MessageCircle,
    href: "/coach-chat",
    aria: "Chat with your career coach",
  },
  {
    label: "Explore Pivots",
    icon: Briefcase,
    href: "/pivots",
    aria: "Explore pivot roles",
  },
];

const Dashboard = () => {
  const [pivotSnapshot, setPivotSnapshot] = useState([]);
  const [layoffData, setLayoffData] = useState({
    chart: [],
    mostAffectedRoles: [],
  });
  const [todayAction, setTodayAction] = useState({});
  const [progressSummary, setProgressSummary] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setPivotSnapshot(await fetchPivotSnapshot());
      setLayoffData(await fetchLayoffData());
      setTodayAction(await fetchTodayAction());
      setProgressSummary(await fetchProgressSummary());
    };
    fetchData();
  }, []);

  return (
    <main className="flex flex-col gap-6 p-6 max-w-6xl mx-auto bg-zinc-950 text-zinc-100 rounded-2xl">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pivot Snapshot */}
        <Card
          className="col-span-1 md:col-span-2 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-md"
          aria-label="Pivot Snapshot"
        >
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle>
              <Sparkles
                className="inline mr-2 text-yellow-500"
                aria-hidden="true"
              />
              Pivot Snapshot
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Top AI-recommended roles for your pivot journey
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4">
              {pivotSnapshot.map((role, idx) => (
                <div
                  key={role.title}
                  className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/70 text-zinc-200"
                >
                  <Avatar className="border border-blue-500/20">
                    <AvatarFallback className="bg-blue-600/20 text-blue-400">
                      {role.title[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-white">
                        {role.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-900/20 border-blue-500/30 text-blue-300"
                      >
                        {role.fitScore}% Fit
                      </Badge>
                    </div>
                    <div className="text-sm text-zinc-400">{role.reason}</div>
                  </div>
                  {idx === 0 && (
                    <Link href="/pivot" passHref legacyBehavior>
                      <Button
                        tabIndex="0"
                        aria-label="Explore more pivot roles"
                        className="ml-4 bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30"
                        variant="secondary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            window.location.href = "/pivot";
                        }}
                      >
                        Explore More
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Layoff Tracker */}
        <Card
          className="col-span-1 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-md"
          aria-label="Layoff Tracker"
        >
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle>
              <TrendingUp
                className="inline mr-2 text-red-500"
                aria-hidden="true"
              />
              Layoff Tracker
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Recent layoffs (last 7–30 days)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={layoffData.chart}>
                  <XAxis
                    dataKey="company"
                    stroke="#71717a"
                    className="text-xs"
                  />
                  <YAxis stroke="#71717a" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      color: "#fafafa",
                      borderRadius: "0.375rem",
                    }}
                    labelStyle={{
                      color: "#d4d4d8",
                    }}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Bar dataKey="layoffs" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-1 text-zinc-100">
                Most affected roles:
              </div>
              <ul className="list-disc list-inside text-sm text-zinc-400">
                {layoffData.mostAffectedRoles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
            <Button
              tabIndex="0"
              aria-label="Explore stable pivot roles"
              className="mt-4 w-full bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700"
              variant="outline"
              onClick={() => (window.location.href = "/pivots")}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.location.href = "/pivots";
              }}
            >
              Explore stable pivot roles
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Action */}
        <Card
          className="col-span-1 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-md"
          aria-label="Today's Action"
        >
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle>
              <ClipboardList
                className="inline mr-2 text-blue-500"
                aria-hidden="true"
              />
              Today&apos;s Action
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Stay on track with your roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
              <div className="font-medium text-zinc-100">
                {todayAction.action}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>Time left this week:</span>
                <Badge
                  variant="secondary"
                  className="bg-indigo-900/30 text-indigo-300 border border-indigo-500/20"
                >
                  {todayAction.timeLeft}
                </Badge>
                <span>vs. commitment:</span>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-zinc-300"
                >
                  {todayAction.weeklyCommitment}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card
          className="col-span-1 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-md"
          aria-label="Progress Summary"
        >
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle>
              <Flame
                className="inline mr-2 text-orange-500"
                aria-hidden="true"
              />
              Progress Summary
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your Pivot Path progress
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-100">
                  Roadmap Progress
                </span>
                <span className="text-xs text-zinc-400">
                  {progressSummary.progress}%
                </span>
              </div>
              <Progress
                value={progressSummary.progress || 0}
                className="bg-zinc-800"
              />
            </div>
            <div className="mb-3">
              <div className="text-sm font-medium mb-1 text-zinc-100">
                Skills Learned
              </div>
              <div className="flex flex-wrap gap-2">
                {(progressSummary.skills || []).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-blue-500/20 bg-blue-900/10 text-blue-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100">Streak:</span>
              <Badge
                variant="secondary"
                className="bg-indigo-900/30 text-indigo-300 border border-indigo-500/20"
              >
                {progressSummary.streak || 0} days
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Shortcuts Panel */}
        <Card
          className="col-span-1 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-md"
          aria-label="Shortcuts Panel"
        >
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle>
              <Rocket
                className="inline mr-2 text-green-500"
                aria-hidden="true"
              />
              Shortcuts
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Quick access to tools
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3">
              {shortcuts.map(({ label, icon: Icon, href, aria }) => (
                <Link href={href} passHref legacyBehavior key={label}>
                  <Button
                    tabIndex="0"
                    aria-label={aria}
                    variant="ghost"
                    className="justify-start gap-2 w-full text-zinc-300 hover:bg-zinc-800 hover:text-blue-300"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") window.location.href = href;
                    }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
