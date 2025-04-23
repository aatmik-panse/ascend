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
    <main className="flex flex-col gap-6 p-6 max-w-6xl mx-auto ">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pivot Snapshot */}
        <Card
          className="col-span-1 md:col-span-2 bg-card border border-border text-card-foreground"
          aria-label="Pivot Snapshot"
        >
          <CardHeader>
            <CardTitle>
              <Sparkles
                className="inline mr-2 text-yellow-500"
                aria-hidden="true"
              />
              Pivot Snapshot
            </CardTitle>
            <CardDescription>
              Top AI-recommended roles for your pivot journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {pivotSnapshot.map((role, idx) => (
                <div
                  key={role.title}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted text-muted-foreground dark:bg-zinc-900/70 dark:text-zinc-200"
                >
                  <Avatar>
                    <AvatarFallback>{role.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-card-foreground">
                        {role.title}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {role.fitScore}% Fit
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {role.reason}
                    </div>
                  </div>
                  {idx === 0 && (
                    <Link href="/pivot" passHref legacyBehavior>
                      <Button
                        tabIndex="0"
                        aria-label="Explore more pivot roles"
                        className="ml-4"
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
          className="col-span-1 bg-card border border-border text-card-foreground"
          aria-label="Layoff Tracker"
        >
          <CardHeader>
            <CardTitle>
              <TrendingUp
                className="inline mr-2 text-red-500"
                aria-hidden="true"
              />
              Layoff Tracker
            </CardTitle>
            <CardDescription>Recent layoffs (last 7–30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={layoffData.chart}>
                  <XAxis
                    dataKey="company"
                    stroke="#a1a1aa"
                    className="text-xs"
                  />
                  <YAxis stroke="#a1a1aa" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(24,24,27,0.95)",
                      border: "1px solid #27272a",
                      color: "#fafafa",
                    }}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Bar dataKey="layoffs" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-1">Most affected roles:</div>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {layoffData.mostAffectedRoles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
            <Button
              tabIndex="0"
              aria-label="Explore stable pivot roles"
              className="mt-4 w-full"
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
          className="col-span-1 bg-card border border-border text-card-foreground"
          aria-label="Today’s Action"
        >
          <CardHeader>
            <CardTitle>
              <ClipboardList
                className="inline mr-2 text-blue-500"
                aria-hidden="true"
              />
              Today’s Action
            </CardTitle>
            <CardDescription>Stay on track with your roadmap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="font-medium">{todayAction.action}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Time left this week:</span>
                <Badge variant="secondary">{todayAction.timeLeft}</Badge>
                <span>vs. commitment:</span>
                <Badge variant="outline">{todayAction.weeklyCommitment}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card
          className="col-span-1 bg-card border border-border text-card-foreground"
          aria-label="Progress Summary"
        >
          <CardHeader>
            <CardTitle>
              <Flame
                className="inline mr-2 text-orange-500"
                aria-hidden="true"
              />
              Progress Summary
            </CardTitle>
            <CardDescription>Your Pivot Path progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Roadmap Progress</span>
                <span className="text-xs">{progressSummary.progress}%</span>
              </div>
              <Progress value={progressSummary.progress || 0} />
            </div>
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Skills Learned</div>
              <div className="flex flex-wrap gap-2">
                {(progressSummary.skills || []).map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Streak:</span>
              <Badge variant="secondary">
                {progressSummary.streak || 0} days
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Shortcuts Panel */}
        <Card
          className="col-span-1 bg-card border border-border text-card-foreground"
          aria-label="Shortcuts Panel"
        >
          <CardHeader>
            <CardTitle>
              <Rocket
                className="inline mr-2 text-green-500"
                aria-hidden="true"
              />
              Shortcuts
            </CardTitle>
            <CardDescription>Quick access to tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {shortcuts.map(({ label, icon: Icon, href, aria }) => (
                <Link href={href} passHref legacyBehavior key={label}>
                  <Button
                    tabIndex="0"
                    aria-label={aria}
                    variant="ghost"
                    className="justify-start gap-2 w-full"
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
