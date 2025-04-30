"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Info,
  Sparkles,
  Award,
  LineChart,
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

  const getMatchColor = (match) => {
    if (match >= 90) return "bg-green-50 text-green-700 border-green-200";
    if (match >= 80) return "bg-blue-50 text-blue-700 border-blue-200";
    if (match >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getGrowthBadge = (growth) => {
    switch (growth) {
      case "Very High":
        return (
          <Badge className="bg-green-50 text-green-700 border border-green-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            Very High
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "Moderate":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-100">
            <TrendingUp className="h-3 w-3 mr-1" rotate={45} />
            Moderate
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
            {growth}
          </Badge>
        );
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-black rounded-2xl">
      <div className="space-y-8">
        <div className="max-w-3xl">
          <div className="flex items-center mb-3">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
              AI-Powered Recommendations
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Discover Your Next Career Move
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Explore AI-recommended career paths tailored to your unique skills
            and experience. Each path is carefully analyzed to ensure the best
            match for your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((path) => (
            <Card
              key={path.id}
              className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {path.title}
                  </CardTitle>
                  <Badge
                    className={cn("ml-2 border", getMatchColor(path.match))}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {path.match}% Match
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {path.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {path.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 border border-gray-200 font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-700">
                      <LineChart className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-medium">Growth</h4>
                    </div>
                    <div>{getGrowthBadge(path.growth)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-medium">Salary</h4>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {path.salary}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-5 border-t border-gray-100">
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300 group"
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
              </CardFooter>

              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    tabIndex="0"
                    aria-label={`More information about ${path.title}`}
                  >
                    <Info className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white border border-gray-200 p-4 shadow-lg">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-black">
                      About {path.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {path.description} This career path has a {path.match}%
                      match with your profile based on your skills and
                      experiences.
                    </p>
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <p className="text-xs text-gray-500">
                        Salary data based on national averages. Growth
                        projections based on Bureau of Labor Statistics.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CareerPivot;
