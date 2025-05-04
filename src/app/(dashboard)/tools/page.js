"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Users, Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Tools() {
  const router = useRouter();

  // Common card styling to ensure consistency
  const cardStyle =
    "bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden hover:shadow-md transition-all duration-300";

  const handleResumeEnhancer = () => {
    router.push("/tools/resume-enhancer");
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="space-y-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-medium text-gray-100 mb-2">
            Career Tools
          </h1>
          <p className="text-gray-200">
            Tools to help you succeed in your career transition journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-blue-50">
                  <FileEdit className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-800">
                    Resume Enhancer
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    AI-powered resume optimization for your target role
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="text-gray-600 flex items-center gap-3 text-sm">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>
                    AI analysis of your resume against target job descriptions
                  </span>
                </li>
                <li className="text-gray-600 flex items-center gap-3 text-sm">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>Keyword optimization suggestions</span>
                </li>
                <li className="text-gray-600 flex items-center gap-3 text-sm">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>Skill gap identification and recommendations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white group"
                onClick={handleResumeEnhancer}
                tabIndex="0"
                aria-label="Go to Resume Enhancer tool"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleResumeEnhancer();
                  }
                }}
              >
                Enhance My Resume
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-gray-100">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-800">
                    Personal Branding Tips
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Build a strong personal brand to stand out in your industry
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="text-gray-500 flex items-center gap-3 text-sm">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span>LinkedIn profile optimization</span>
                </li>
                <li className="text-gray-500 flex items-center gap-3 text-sm">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span>Content strategy for thought leadership</span>
                </li>
                <li className="text-gray-500 flex items-center gap-3 text-sm">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span>Networking strategy playbook</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100">
              <Button
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                disabled
                tabIndex="-1"
                aria-label="Join Waitlist - Coming Soon"
              >
                <Lock className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* Additional cards can go here in the future */}
        </div>
      </div>
    </main>
  );
}
