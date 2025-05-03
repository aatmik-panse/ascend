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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Enter Your Resume
              </CardTitle>
              <CardDescription className="text-gray-600">
                We'll analyze your resume with OpenAI against your target job
                description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your resume text here..."
                  className="min-h-[300px] border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
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
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    tabIndex="0"
                  >
                    <Clipboard className="h-4 w-4 mr-2" /> Paste from Clipboard
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">
                      AI-Powered Analysis
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Our integration with OpenAI's language models will analyze
                      your resume, identify key skills, and provide targeted
                      recommendations for your specific job application.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 pt-4 flex justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900"
                tabIndex="0"
                aria-label="Go back to tools page"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!resumeText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                tabIndex="0"
                aria-label="Continue to next step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (resumeText.trim()) handleContinue();
                  }
                }}
              >
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 2:
        return (
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Target Role Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Tell us about the job you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRole" className="text-gray-800">
                    Target Role/Position
                  </Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g. Data Analyst, Product Manager, UX Designer"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    tabIndex="0"
                    aria-label="Target role or position"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-gray-800">
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    className="min-h-[250px] border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    tabIndex="0"
                    aria-label="Job description"
                  />
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Why this matters
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        OpenAI's algorithms will identify specific keywords,
                        skills, and requirements from the job description to
                        tailor your resume for better matching and applicant
                        tracking system (ATS) optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-200 pt-4 flex justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900"
                tabIndex="0"
                aria-label="Go back to previous step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!targetRole || !jobDescription}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                tabIndex="0"
                aria-label="Continue to next step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (targetRole && jobDescription) handleContinue();
                  }
                }}
              >
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 3:
        return (
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Review and Confirm
              </CardTitle>
              <CardDescription className="text-gray-600">
                Please confirm the information below before analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Target Role
                  </h3>
                  <p className="text-gray-800">{targetRole}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Resume Preview
                  </h3>
                  <p className="text-gray-800 text-sm line-clamp-4">
                    {resumeText}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto mt-2"
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

                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Job Description Preview
                  </h3>
                  <p className="text-gray-800 text-sm line-clamp-4">
                    {jobDescription}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto mt-2"
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

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        What happens next?
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Our model will analyze your resume against the job
                        description to identify gaps, suggest improvements, and
                        optimize for ATS compatibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 pt-4 flex justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900"
                tabIndex="0"
                aria-label="Go back to previous step"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBack();
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
                    Analyzing <Clock className="h-4 w-4 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Start Analysis <Zap className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );

      case 4:
        return (
          <>
            <Card className={cn(cardStyle, "mb-8")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Resume analysis for {targetRole}
                    </CardDescription>
                  </div>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-500">
                    <span className="text-2xl font-bold text-blue-700">
                      {analysisResult?.score || 0}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Job Match</h3>
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                      {analysisResult?.matchPercentage || 0}%
                    </Badge>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${analysisResult?.matchPercentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    How well your resume matches the job requirements
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Key Findings</h3>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult?.missingKeywords?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            className="bg-red-100 text-red-700 border border-red-200"
                          >
                            {keyword}
                          </Badge>
                        )
                      ) || (
                        <p className="text-gray-600">
                          No missing keywords found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">
                      Present Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult?.keywords?.present?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            className="bg-green-100 text-green-700 border border-green-200"
                          >
                            {keyword}
                          </Badge>
                        )
                      ) || (
                        <p className="text-gray-600">No keywords detected</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Improvement Suggestions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Tailored recommendations to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {analysisResult?.suggestions?.length > 0 ? (
                    analysisResult.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-gray-50 p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-700 p-1.5 rounded">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {suggestion.section}
                            </h4>
                            <p className="text-gray-800 text-sm mt-1">
                              {suggestion.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                      <p className="text-gray-800">
                        No specific suggestions available.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">
                    Skills to Add or Emphasize
                  </h3>
                  <div className="space-y-2">
                    {analysisResult?.skillGaps?.length > 0 ? (
                      analysisResult.skillGaps.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border-b border-gray-200 last:border-0"
                        >
                          <span className="text-gray-800">{skill.skill}</span>
                          <Badge
                            className={cn(
                              "font-medium",
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
                      <div className="p-2">
                        <p className="text-gray-800">
                          No skill gaps identified.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Next Steps</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Update your resume with these suggestions and run the
                        analysis again to see your improved score. Focus on
                        incorporating the missing keywords and highlighted
                        skills.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 pt-4 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/tools")}
                  className="text-gray-700 hover:text-gray-900"
                  tabIndex="0"
                  aria-label="Go back to tools page"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push("/tools");
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tools
                </Button>
                <Button
                  onClick={() => setStep(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  tabIndex="0"
                  aria-label="Start a new analysis"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setStep(1);
                    }
                  }}
                >
                  New Analysis <Zap className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </>
        );

      default:
        return null;
    }
  };

  // Show a loading state when analysis is in progress
  if (step === 3 && loading) {
    return (
      <main className="p-8 max-w-3xl mx-auto animate-fade-in">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Analyzing Your Resume with OpenAI
            </CardTitle>
            <CardDescription className="text-gray-600">
              Our AI is comparing your resume against the job description
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
                <Zap className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 font-medium">{progressStage}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  This may take a few moments
                </p>
              </div>

              <div className="w-full max-w-xs space-y-2">
                <Progress
                  value={progressValue}
                  className="h-1 bg-gray-200 w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Keyword matching</span>
                  <span>Skills assessment</span>
                  <span>ATS compatibility</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto bg-white text-black rounded-2xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/tools")}
                className="text-gray-500 hover:text-gray-900 p-2"
                tabIndex="0"
                aria-label="Return to tools page"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push("/tools");
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-500">Tools</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            OpenAI Resume Enhancer
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered resume optimization with GPT-4.1-mini to improve your
            chances of getting interviews
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium">Resume</span>
            </div>

            <div
              className={`w-12 h-0.5 mx-1 ${
                step > 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="ml-2 text-sm font-medium">Target</span>
            </div>

            <div
              className={`w-12 h-0.5 mx-1 ${
                step > 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 3 ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>

            <div
              className={`w-12 h-0.5 mx-1 ${
                step > 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                step >= 4 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 4
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > 4 ? <Check className="h-4 w-4" /> : "4"}
              </div>
              <span className="ml-2 text-sm font-medium">Results</span>
            </div>
          </div>
        </div>

        {renderStepContent()}
      </motion.div>
    </main>
  );
}
