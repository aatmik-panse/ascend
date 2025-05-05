"use client";
import React, { useState } from "react";
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
import {
  ArrowLeft,
  FileText,
  Zap,
  Check,
  Clock,
  ChevronRight,
  AlertCircle,
  Clipboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ResumeEnhancer() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [progressStage, setProgressStage] = useState(
    "Initializing analysis..."
  );

  // Updated styling for consistency with other pages
  const cardStyle =
    "bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden";

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/tools");
    }
  };

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setResumeText(text);
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
        toast.error("Failed to access clipboard");
      });
  };

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setProgressValue(10);
      setProgressStage("Preparing documents...");

      // Simulate progress for better UX
      const simulateProgress = () => {
        setProgressValue((prev) => {
          if (prev < 90) {
            const increment = Math.floor(Math.random() * 15) + 5;
            return Math.min(prev + increment, 90);
          }
          return prev;
        });

        const stages = [
          "Extracting keywords...",
          "Analyzing skills match...",
          "Evaluating ATS compatibility...",
          "Generating recommendations...",
        ];

        const stageIndex = Math.floor((progressValue / 90) * stages.length);
        setProgressStage(stages[Math.min(stageIndex, stages.length - 1)]);
      };

      const progressInterval = setInterval(simulateProgress, 800);

      // Call OpenAI API to analyze the resume
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to analyze resume");
      }

      const data = await response.json();
      setProgressValue(100);
      setProgressStage("Analysis complete!");
      setAnalysisResult(data);
      setStep(4);
    } catch (error) {
      console.error("Resume analysis error:", error);
      toast.error(
        error.message || "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (step === 3) {
      analyzeResume();
    } else {
      setStep(step + 1);
    }
  };

  // Show a loading state when analysis is in progress
  if (step === 3 && loading) {
    return (
      <main className="p-3 sm:p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-xl text-gray-900">
              Analyzing Your Resume with Advance AI
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs sm:text-base">
              Our AI is comparing your resume against the job description
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-6">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 font-medium text-sm sm:text-base">
                  {progressStage}
                </h3>
                <p className="text-gray-600 text-xs mt-1 sm:mt-2">
                  This may take a few moments
                </p>
              </div>

              <div className="w-full max-w-full sm:max-w-xs space-y-2">
                <Progress
                  value={progressValue}
                  className="h-1 bg-gray-200 w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="text-[8px] sm:text-xs">
                    Keyword matching
                  </span>
                  <span className="text-[8px] sm:text-xs">
                    Skills assessment
                  </span>
                  <span className="text-[8px] sm:text-xs">
                    ATS compatibility
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-3 sm:p-6 md:p-8 max-w-3xl mx-auto bg-white text-black rounded-lg sm:rounded-2xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-1 sm:gap-2 mb-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/tools")}
                className="text-gray-500 hover:text-gray-900 p-0.5 sm:p-2"
                tabIndex="0"
                aria-label="Return to tools page"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push("/tools");
                  }
                }}
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-gray-500 mx-1 sm:mx-2">/</span>
              <span className="text-gray-500 text-xs sm:text-sm">Tools</span>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
            Advance AI Resume Enhancer
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">
            AI-powered resume optimization to improve your chances of getting
            interviews
          </p>
        </div>

        <div className="mb-4 sm:mb-8 overflow-x-auto pb-2">
          <div className="flex items-center min-w-max">
            <div
              className={`flex items-center ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 1 ? (
                  <Check className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium">
                Resume
              </span>
            </div>

            <div
              className={`w-5 sm:w-12 h-0.5 mx-0.5 sm:mx-1 ${
                step > 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 2 ? (
                  <Check className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                ) : (
                  "2"
                )}
              </div>
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium">
                Target
              </span>
            </div>

            <div
              className={`w-5 sm:w-12 h-0.5 mx-0.5 sm:mx-1 ${
                step > 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 3 ? (
                  <Check className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                ) : (
                  "3"
                )}
              </div>
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium">
                Review
              </span>
            </div>

            <div
              className={`w-5 sm:w-12 h-0.5 mx-0.5 sm:mx-1 ${
                step > 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 4 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step >= 4
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 4 ? (
                  <Check className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                ) : (
                  "4"
                )}
              </div>
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium">
                Results
              </span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className={cardStyle}>
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-base sm:text-xl text-gray-900">
                Enter Your Resume
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs sm:text-base">
                We&apos;ll analyze your resume with Our AI against your target
                job description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <Textarea
                  placeholder="Paste your resume text here..."
                  className="min-h-[150px] sm:min-h-[300px] border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 text-xs sm:text-base"
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                  }}
                  tabIndex="0"
                  aria-label="Paste your resume text"
                />
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handlePaste}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-[10px] sm:text-sm py-1 h-7 sm:h-auto"
                    tabIndex="0"
                  >
                    <Clipboard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                    Paste from Clipboard
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 sm:p-4">
                <div className="flex items-start gap-1.5 sm:gap-3">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 text-xs sm:text-base">
                      AI-Powered Analysis
                    </h4>
                    <p className="text-[10px] sm:text-sm text-blue-700 mt-0.5 sm:mt-1">
                      Our advanced language models will analyze your resume,
                      identify key skills, and provide targeted recommendations
                      for your specific job application.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between px-3 sm:px-6 flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900 text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Go back to tools page"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-2.5 w-2.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!resumeText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Continue to next step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (resumeText.trim()) handleContinue();
                  }
                }}
              >
                Continue{" "}
                <ChevronRight className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className={cardStyle}>
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-base sm:text-xl text-gray-900">
                Target Role Information
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs sm:text-base">
                Tell us about the job you&apos;re applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="targetRole"
                    className="text-gray-800 text-xs sm:text-base"
                  >
                    Target Role/Position
                  </Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g. Data Analyst, Product Manager, UX Designer"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 text-xs sm:text-base h-8 sm:h-10"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    tabIndex="0"
                    aria-label="Target role or position"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="jobDescription"
                    className="text-gray-800 text-xs sm:text-base"
                  >
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    className="min-h-[120px] sm:min-h-[250px] border-gray-300 text-gray-900 placeholder:text-gray-500 text-xs sm:text-base"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    tabIndex="0"
                    aria-label="Job description"
                  />
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 sm:p-4">
                  <div className="flex items-start gap-1.5 sm:gap-3">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-xs sm:text-base">
                        Why this matters
                      </h4>
                      <p className="text-[10px] sm:text-sm text-blue-700 mt-0.5 sm:mt-1">
                        Our state-of-the-art language algorithms will identify
                        specific keywords, skills, and requirements from the job
                        description to tailor your resume for better matching
                        and applicant tracking system (ATS) optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between px-3 sm:px-6 flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900 text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Go back to previous step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-2.5 w-2.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!targetRole || !jobDescription}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Continue to next step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (targetRole && jobDescription) handleContinue();
                  }
                }}
              >
                Continue{" "}
                <ChevronRight className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && !loading && (
          <Card className={cardStyle}>
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-base sm:text-xl text-gray-900">
                Review and Confirm
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs sm:text-base">
                Please confirm the information below before analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 text-xs sm:text-base">
                    Target Role
                  </h3>
                  <p className="text-gray-800 text-[10px] sm:text-sm">
                    {targetRole}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 text-xs sm:text-base">
                    Resume Preview
                  </h3>
                  <p className="text-gray-800 text-[10px] sm:text-sm line-clamp-3 sm:line-clamp-4">
                    {resumeText}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto mt-1 sm:mt-2 text-[10px] sm:text-sm"
                    onClick={() => setStep(1)}
                    tabIndex="0"
                    aria-label="Edit resume"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setStep(1);
                      }
                    }}
                  >
                    Edit
                  </Button>
                </div>

                <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 text-xs sm:text-base">
                    Job Description Preview
                  </h3>
                  <p className="text-gray-800 text-[10px] sm:text-sm line-clamp-3 sm:line-clamp-4">
                    {jobDescription}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto mt-1 sm:mt-2 text-[10px] sm:text-sm"
                    onClick={() => setStep(2)}
                    tabIndex="0"
                    aria-label="Edit job description"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setStep(2);
                      }
                    }}
                  >
                    Edit
                  </Button>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 sm:p-4">
                  <div className="flex items-start gap-1.5 sm:gap-3">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-xs sm:text-base">
                        What happens next?
                      </h4>
                      <p className="text-[10px] sm:text-sm text-blue-700 mt-0.5 sm:mt-1">
                        Our model will analyze your resume against the job
                        description to identify gaps, suggest improvements, and
                        optimize for ATS compatibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between px-3 sm:px-6 flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900 text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Go back to previous step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-2.5 w-2.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                Back
              </Button>
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-sm h-7 sm:h-10"
                tabIndex="0"
                aria-label="Start analysis"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleContinue();
                  }
                }}
              >
                {loading ? (
                  <>
                    Analyzing{" "}
                    <Clock className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Start Analysis{" "}
                    <Zap className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <>
            <Card className={cn(cardStyle, "mb-4 sm:mb-8")}>
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-xl text-gray-900">
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-xs">
                      Resume analysis for {targetRole}
                    </CardDescription>
                  </div>
                  <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-blue-100 border-3 sm:border-4 border-blue-500 mx-auto sm:mx-0">
                    <span className="text-lg sm:text-2xl font-bold text-blue-700">
                      {analysisResult?.score || 0}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6">
                <div>
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <h3 className="font-medium text-gray-900 text-xs sm:text-base">
                      Job Match
                    </h3>
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-[8px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5">
                      {analysisResult?.matchPercentage || 0}%
                    </Badge>
                  </div>
                  <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${analysisResult?.matchPercentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[8px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    How well your resume matches the job requirements
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  <h3 className="font-medium text-gray-900 text-xs sm:text-base">
                    Key Findings
                  </h3>

                  <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 text-xs sm:text-base">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {analysisResult?.missingKeywords?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            className="bg-red-100 text-red-700 border border-red-200 text-[8px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5"
                          >
                            {keyword}
                          </Badge>
                        )
                      ) || (
                        <p className="text-gray-600 text-[10px] sm:text-sm">
                          No missing keywords found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 text-xs sm:text-base">
                      Present Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {analysisResult?.keywords?.present?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            className="bg-green-100 text-green-700 border border-green-200 text-[8px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5"
                          >
                            {keyword}
                          </Badge>
                        )
                      ) || (
                        <p className="text-gray-600 text-[10px] sm:text-sm">
                          No keywords detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="text-base sm:text-xl text-gray-900">
                  Improvement Suggestions
                </CardTitle>
                <CardDescription className="text-gray-600 text-xs">
                  Tailored recommendations to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6">
                <div className="space-y-2 sm:space-y-4">
                  {analysisResult?.suggestions?.length > 0 ? (
                    analysisResult.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-1.5 sm:gap-3">
                          <div className="bg-blue-100 text-blue-700 p-1 sm:p-1.5 rounded flex-shrink-0">
                            <FileText className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-xs sm:text-base">
                              {suggestion.section}
                            </h4>
                            <p className="text-gray-800 text-[10px] sm:text-sm mt-0.5 sm:mt-1">
                              {suggestion.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-2 sm:p-4 border border-gray-200">
                      <p className="text-gray-800 text-[10px] sm:text-sm">
                        No specific suggestions available.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-3">
                  <h3 className="font-medium text-gray-900 text-xs sm:text-base">
                    Skills to Add or Emphasize
                  </h3>
                  <div className="space-y-0.5 sm:space-y-2">
                    {analysisResult?.skillGaps?.length > 0 ? (
                      analysisResult.skillGaps.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-1.5 sm:p-2 border-b border-gray-200 last:border-0"
                        >
                          <span className="text-gray-800 text-[10px] sm:text-sm">
                            {skill.skill}
                          </span>
                          <Badge
                            className={cn(
                              "font-medium text-[8px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5",
                              skill.importance === "High"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : skill.importance === "Medium"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            )}
                          >
                            {skill.importance}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-1.5 sm:p-2">
                        <p className="text-gray-800 text-[10px] sm:text-sm">
                          No skill gaps identified.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 sm:p-4">
                  <div className="flex items-start gap-1.5 sm:gap-3">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-xs sm:text-base">
                        Next Steps
                      </h4>
                      <p className="text-[10px] sm:text-sm text-blue-700 mt-0.5 sm:mt-1">
                        Update your resume with these suggestions and run the
                        analysis again to see your improved score. Focus on
                        incorporating the missing keywords and highlighted
                        skills.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between px-3 sm:px-6 flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/tools")}
                  className="text-gray-700 hover:text-gray-900 text-[10px] sm:text-sm h-7 sm:h-10"
                  tabIndex="0"
                  aria-label="Go back to tools page"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push("/tools");
                    }
                  }}
                >
                  <ArrowLeft className="h-2.5 w-2.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />{" "}
                  Back to Tools
                </Button>
                <Button
                  onClick={() => setStep(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-sm h-7 sm:h-10"
                  tabIndex="0"
                  aria-label="Start a new analysis"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setStep(1);
                    }
                  }}
                >
                  New Analysis{" "}
                  <Zap className="h-2.5 w-2.5 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </motion.div>
    </main>
  );
}
