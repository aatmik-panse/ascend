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
import { AnimatePresence, motion } from "motion/react";

export default function Tools() {
  const router = useRouter();

  // Common card styling to ensure consistency
  const cardStyle =
    "bg-gradient-to-b from-zinc-900/95 to-zinc-900/90 border-zinc-800/60 text-white overflow-hidden hover:shadow-lg hover:border-zinc-700/60 transition-all duration-300";

  const handleResumeEnhancer = () => {
    router.push("/tools/resume-enhancer");
  };

  return (
    <main className="p-8 max-w-7xl mx-auto animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-4">Career Tools</h1>
          <p className="text-zinc-400 text-lg">
            Tools to help you succeed in your career transition journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className={cardStyle}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg backdrop-blur-sm">
                    <FileEdit className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Resume Enhancer
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      AI-powered resume optimization for your target role
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  <li className="text-zinc-300 flex items-center gap-3">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>
                      AI analysis of your resume against target job descriptions
                    </span>
                  </li>
                  <li className="text-zinc-300 flex items-center gap-3">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>Keyword optimization suggestions</span>
                  </li>
                  <li className="text-zinc-300 flex items-center gap-3">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>Skill gap identification and recommendations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-zinc-800/50">
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
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className={cardStyle}>
              <div className="relative left-4 top-4 right-4">
                <Badge className="bg-yellow-500 text-black border-none font-medium px-3">
                  Coming Soon
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-800/80 p-3 rounded-lg backdrop-blur-sm">
                    <Users className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Personal Branding Tips
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                      Build a strong personal brand to stand out in your
                      industry
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  <li className="text-zinc-400 flex items-center gap-3">
                    <span className="text-zinc-500 flex-shrink-0">•</span>
                    <span>LinkedIn profile optimization</span>
                  </li>
                  <li className="text-zinc-400 flex items-center gap-3">
                    <span className="text-zinc-500 flex-shrink-0">•</span>
                    <span>Content strategy for thought leadership</span>
                  </li>
                  <li className="text-zinc-400 flex items-center gap-3">
                    <span className="text-zinc-500 flex-shrink-0">•</span>
                    <span>Networking strategy playbook</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-zinc-800/50">
                <Button
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  disabled
                  tabIndex="-1"
                  aria-label="Join Waitlist - Coming Soon"
                >
                  <Lock className="h-4 w-4 mr-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Additional cards can go here in the future */}
        </div>
      </motion.div>
    </main>
  );
}
