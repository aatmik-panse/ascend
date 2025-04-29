"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Info,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const careerPaths = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    match: 92,
    description:
      "Analyze and interpret complex data to help organizations make better decisions.",
    skills: [
      "Python",
      "Statistics",
      "Machine Learning",
      "SQL",
      "Data Visualization",
    ],
    growth: "High",
    salary: "$105,000 - $150,000",
  },
  {
    id: "product-manager",
    title: "Product Manager, AI",
    match: 87,
    description:
      "Lead the development of AI-powered products from conception to launch.",
    skills: [
      "Product Strategy",
      "User Research",
      "AI/ML Understanding",
      "Leadership",
      "Analytics",
    ],
    growth: "Very High",
    salary: "$120,000 - $180,000",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    match: 82,
    description:
      "Transform raw data into actionable insights through analysis and visualization.",
    skills: [
      "SQL",
      "Excel",
      "Data Visualization",
      "Statistics",
      "Business Intelligence",
    ],
    growth: "Moderate",
    salary: "$75,000 - $110,000",
  },
  {
    id: "ux-researcher",
    title: "UX Researcher",
    match: 78,
    description:
      "Study user behaviors and needs to inform product design decisions.",
    skills: [
      "User Interviews",
      "Usability Testing",
      "Data Analysis",
      "Empathy",
      "Communication",
    ],
    growth: "High",
    salary: "$90,000 - $130,000",
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    match: 73,
    description:
      "Design and implement machine learning models for production environments.",
    skills: [
      "Python",
      "Deep Learning",
      "MLOps",
      "Software Engineering",
      "Data Structures",
    ],
    growth: "Very High",
    salary: "$110,000 - $170,000",
  },
];

const CareerPivot = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const router = useRouter();

  const handleExplore = (pathId) => {
    router.push(`/career_pivot/test/${pathId}`);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="space-y-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Discover Your Next Career Move
          </h1>
          <p className="text-zinc-400 mt-4 text-lg leading-relaxed">
            Explore AI-recommended career paths tailored to your unique skills
            and experience. Each path is carefully analyzed to ensure the best
            match for your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerPaths.map((path) => (
            <Card
              key={path.id}
              className="bg-zinc-900 border-zinc-800/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button
                          className="cursor-help flex items-center gap-1 focus:outline-none"
                          tabIndex="0"
                          aria-label={`Learn more about ${path.title}`}
                        >
                          {path.title}
                          <Info className="h-4 w-4 text-zinc-500" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 bg-zinc-950 border-zinc-800">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-white">
                            {path.title}
                          </h4>
                          <p className="text-sm text-zinc-400">
                            {path.description}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "bg-blue-600/20 border-blue-800",
                      path.match >= 90
                        ? "text-green-400"
                        : path.match >= 80
                        ? "text-blue-400"
                        : "text-zinc-400"
                    )}
                  >
                    {path.match}% Match
                  </Badge>
                </div>
                <CardDescription className="text-zinc-400 min-h-[3rem]">
                  {path.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-zinc-400">
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <TrendingUp className="w-4 h-4" />
                      <h4 className="text-sm font-medium">Growth</h4>
                    </div>
                    <p className="text-sm text-white">{path.growth}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <DollarSign className="w-4 h-4" />
                      <h4 className="text-sm font-medium">Salary</h4>
                    </div>
                    <p className="text-sm text-white">{path.salary}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 group"
                  onClick={() => handleExplore(path.id)}
                  tabIndex="0"
                  aria-label={`Explore ${path.title} career path`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleExplore(path.id);
                    }
                  }}
                >
                  Explore Path
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CareerPivot;
