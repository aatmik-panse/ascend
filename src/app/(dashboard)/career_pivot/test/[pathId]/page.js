"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock test questions for each career path
const pathTests = {
  "data-scientist": [
    {
      id: "ds-q1",
      question:
        "Which of the following is NOT typically a responsibility of a Data Scientist?",
      options: [
        "Designing machine learning models",
        "Interpreting data patterns",
        "Creating UI/UX designs",
        "Cleaning and preprocessing data",
      ],
      correctAnswer: 2,
    },
    {
      id: "ds-q2",
      question:
        "Which programming language is most commonly used in data science?",
      options: ["Java", "Python", "C#", "Ruby"],
      correctAnswer: 1,
    },
    {
      id: "ds-q3",
      question: "What does PCA stand for in the context of data science?",
      options: [
        "Practical Component Analysis",
        "Principal Component Analysis",
        "Primary Component Application",
        "Parallel Component Algorithm",
      ],
      correctAnswer: 1,
    },
  ],
  "product-manager": [
    {
      id: "pm-q1",
      question:
        "Which of these is NOT typically part of a Product Manager's role?",
      options: [
        "Defining product roadmap",
        "Writing code for features",
        "Gathering user requirements",
        "Prioritizing features",
      ],
      correctAnswer: 1,
    },
    {
      id: "pm-q2",
      question: "What is a key metric that AI Product Managers often focus on?",
      options: [
        "Code quality",
        "Model accuracy",
        "Server uptime",
        "Network latency",
      ],
      correctAnswer: 1,
    },
    {
      id: "pm-q3",
      question:
        "Which research methodology is most effective for understanding user needs?",
      options: [
        "A/B testing",
        "User interviews",
        "Server logs analysis",
        "Code reviews",
      ],
      correctAnswer: 1,
    },
  ],
  "data-analyst": [
    {
      id: "da-q1",
      question:
        "Which tool is most commonly used by Data Analysts for data visualization?",
      options: ["Photoshop", "Tableau", "AutoCAD", "Final Cut Pro"],
      correctAnswer: 1,
    },
    {
      id: "da-q2",
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "System Quality Level",
        "Sequential Query Lookup",
        "Standard Question Logic",
      ],
      correctAnswer: 0,
    },
    {
      id: "da-q3",
      question: "Which of these is NOT typically an analytical dashboard type?",
      options: ["Strategic", "Operational", "Developmental", "Analytical"],
      correctAnswer: 2,
    },
  ],
  "ux-researcher": [
    {
      id: "uxr-q1",
      question:
        "Which research method is best for collecting quantitative user data?",
      options: [
        "User interviews",
        "Surveys",
        "Contextual inquiry",
        "Think-aloud protocol",
      ],
      correctAnswer: 1,
    },
    {
      id: "uxr-q2",
      question:
        "What is a key difference between usability testing and user interviews?",
      options: [
        "Usability testing focuses on product usage, user interviews on opinions",
        "User interviews require prototypes, usability testing doesn't",
        "Usability testing is qualitative, user interviews are quantitative",
        "User interviews must be done in person, usability testing remotely",
      ],
      correctAnswer: 0,
    },
    {
      id: "uxr-q3",
      question: "What is a common deliverable from a UX Researcher?",
      options: [
        "Code repository",
        "Financial report",
        "User persona",
        "Marketing campaign",
      ],
      correctAnswer: 2,
    },
  ],
  "ml-engineer": [
    {
      id: "mle-q1",
      question:
        "Which of these is NOT a common responsibility of an ML Engineer?",
      options: [
        "Deploying models to production",
        "Creating user interfaces",
        "Optimizing model performance",
        "Data pipeline development",
      ],
      correctAnswer: 1,
    },
    {
      id: "mle-q2",
      question: "What does MLOps stand for?",
      options: [
        "Machine Learning Operations",
        "Multiple Learning Optimizations",
        "Model Layer Operations",
        "Multi-Level Optimization System",
      ],
      correctAnswer: 0,
    },
    {
      id: "mle-q3",
      question:
        "Which of these is most important for an ML system in production?",
      options: [
        "Using the latest algorithms",
        "Having the most parameters",
        "Monitoring and maintaining model quality",
        "Running on specialized hardware",
      ],
      correctAnswer: 2,
    },
  ],
};

// Mock course recommendations for each career path
const courseRecommendations = {
  "data-scientist": [
    {
      title: "Python for Data Science and Machine Learning Bootcamp",
      provider: "Udemy",
      duration: "12 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Applied Data Science with Python Specialization",
      provider: "Coursera",
      duration: "16 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Machine Learning A-Z: Hands-On Python & R",
      provider: "Udemy",
      duration: "10 weeks",
      level: "Beginner to Intermediate",
      url: "#",
    },
  ],
  "product-manager": [
    {
      title: "AI Product Management Specialization",
      provider: "Coursera",
      duration: "14 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Product Management: Building AI Products",
      provider: "Udacity",
      duration: "8 weeks",
      level: "Advanced",
      url: "#",
    },
    {
      title: "Strategic Product Management",
      provider: "edX",
      duration: "6 weeks",
      level: "Intermediate",
      url: "#",
    },
  ],
  "data-analyst": [
    {
      title: "Data Analyst with SQL Nanodegree",
      provider: "Udacity",
      duration: "12 weeks",
      level: "Beginner",
      url: "#",
    },
    {
      title: "Microsoft Power BI Data Analyst",
      provider: "Microsoft Learn",
      duration: "8 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Data Analysis and Visualization Foundations",
      provider: "IBM Skills Network",
      duration: "6 weeks",
      level: "Beginner",
      url: "#",
    },
  ],
  "ux-researcher": [
    {
      title: "UX Research & Strategy Certification",
      provider: "Interaction Design Foundation",
      duration: "10 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Google UX Design Professional Certificate",
      provider: "Coursera",
      duration: "16 weeks",
      level: "Beginner to Intermediate",
      url: "#",
    },
    {
      title: "User Research Methods",
      provider: "Nielsen Norman Group",
      duration: "4 weeks",
      level: "Advanced",
      url: "#",
    },
  ],
  "ml-engineer": [
    {
      title: "Machine Learning Engineering for Production",
      provider: "deeplearning.ai",
      duration: "16 weeks",
      level: "Advanced",
      url: "#",
    },
    {
      title: "MLOps Engineering on AWS",
      provider: "Amazon",
      duration: "8 weeks",
      level: "Intermediate",
      url: "#",
    },
    {
      title: "Deploying Machine Learning Models in Production",
      provider: "Coursera",
      duration: "10 weeks",
      level: "Intermediate to Advanced",
      url: "#",
    },
  ],
};

// Career path names lookup
const careerPathNames = {
  "data-scientist": "Data Scientist",
  "product-manager": "Product Manager, AI",
  "data-analyst": "Data Analyst",
  "ux-researcher": "UX Researcher",
  "ml-engineer": "Machine Learning Engineer",
};

const CareerPathTest = () => {
  const params = useParams();
  const router = useRouter();
  const { pathId } = params;

  const [currentStep, setCurrentStep] = useState("test"); // "test" or "recommendations"
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const questions = pathTests[pathId] || [];
  const recommendations = courseRecommendations[pathId] || [];
  const pathName = careerPathNames[pathId] || "Career Path";

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setCurrentStep("recommendations");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push("/career_pivot");
    }
  };

  const handleBackToCareerPaths = () => {
    router.push("/career_pivot");
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  if (!currentQuestion && currentStep === "test") {
    return (
      <div className="p-8 flex justify-center items-center">
        <Card className="bg-white border border-gray-200 w-full max-w-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Path Not Found</CardTitle>
            <CardDescription className="text-gray-600">
              The requested career path test is not available.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleBackToCareerPaths}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Career Paths
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white text-black rounded-lg shadow-lg">
      {currentStep === "test" ? (
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                tabIndex="0"
                aria-label="Previous question or go back"
                className="text-gray-700 hover:text-black"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentQuestionIndex === 0 ? "Back" : "Previous"}
              </Button>
              <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
            <CardTitle className="text-xl mt-4 text-gray-900">
              {pathName} Assessment
            </CardTitle>
            <CardDescription className="text-gray-600">
              Test your knowledge and aptitude for this career path.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-4">
                {currentQuestion?.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, index)
                    }
                    tabIndex="0"
                    aria-label={`Select answer: ${option}`}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion.id] === index
                        ? "bg-blue-100 border border-blue-300"
                        : "bg-white border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                        answers[currentQuestion.id] === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {answers[currentQuestion.id] === index ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div></div>
            <Button
              disabled={answers[currentQuestion?.id] === undefined}
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              tabIndex="0"
              aria-label="Next question or see results"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next"
                : "See Results"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Your {pathName} Assessment Results
              </CardTitle>
              <CardDescription className="text-gray-600">
                Based on your answers, we&apos;ve tailored these course
                recommendations for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Your Score
                  </h3>
                  <p className="text-sm text-gray-600">
                    {score >= 70
                      ? "Great job! You have a strong foundation for this career path."
                      : "You're on the right track. These courses will help you build your skills."}
                  </p>
                </div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-500">
                  <span className="text-2xl font-bold text-blue-700">
                    {score}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recommended Courses
                </h3>
                <div className="space-y-4">
                  {recommendations.map((course, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">
                          {course.title}
                        </h4>
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <span>{course.provider}</span>
                        <span className="mx-2">•</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-300 hover:bg-blue-100"
                          onClick={() => window.open(course.url, "_blank")}
                          tabIndex="0"
                          aria-label={`View course: ${course.title}`}
                        >
                          View Course
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleBackToCareerPaths}
                className="bg-gray-800 hover:bg-gray-700 text-white"
                tabIndex="0"
                aria-label="Explore more career paths"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Explore More Career Paths
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
};

export default CareerPathTest;
