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
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import RecommendationCard from "@/components/learning/RecommendationCard";

const CareerPathTest = () => {
  const params = useParams();
  const router = useRouter();
  const { pathId } = params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState("test"); // "test" or "results"
  const [test, setTest] = useState(null);
  const [careerPath, setCareerPath] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState(0);
  const [dataSource, setDataSource] = useState("api"); // 'api' or 'cache'

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);

        // First try to load data from localStorage
        const cachedCareerPath = localStorage.getItem(`career-path-${pathId}`);
        const cachedTest = localStorage.getItem(`test-${pathId}`);
        const cachedResults = localStorage.getItem(`results-${pathId}`);

        let selectedPath = null;
        let testData = null;
        let resultsData = null;

        // Check if we have valid cached data
        if (cachedCareerPath && cachedTest) {
          try {
            selectedPath = JSON.parse(cachedCareerPath);
            testData = JSON.parse(cachedTest);

            // Set data from cache
            setCareerPath(selectedPath);
            setTest(testData);
            setDataSource("cache");

            if (cachedResults) {
              resultsData = JSON.parse(cachedResults);
              setResults(resultsData);
              setCurrentStep(testData.completedAt ? "results" : "test");
            }

            console.log("Loaded test data from cache");

            // Load answers from localStorage if available
            const savedAnswers = localStorage.getItem(`answers-${pathId}`);
            if (savedAnswers) {
              setAnswers(JSON.parse(savedAnswers));
            }

            // If test is fresh or recently fetched (within last 24 hours), use cached data
            const cacheTimestamp = localStorage.getItem(
              `cache-timestamp-${pathId}`
            );
            const isCacheFresh =
              cacheTimestamp &&
              Date.now() - parseInt(cacheTimestamp) < 24 * 60 * 60 * 1000;

            if (isCacheFresh) {
              setLoading(false);
              return; // Use cached data and skip API calls
            }
            // Otherwise, continue with API calls to refresh data
          } catch (e) {
            console.error("Error parsing cached data:", e);
            // Continue with API calls if parsing fails
          }
        }

        // Fetch career path info from API
        const pathResponse = await fetch(
          `/api/career-recommendations?pathId=${pathId}`
        );
        if (!pathResponse.ok) {
          throw new Error("Failed to load career path");
        }
        const pathData = await pathResponse.json();
        selectedPath = pathData.recommendations?.find(
          (path) => path.id === pathId
        );
        if (!selectedPath) {
          throw new Error("Career path not found");
        }
        setCareerPath(selectedPath);
        localStorage.setItem(
          `career-path-${pathId}`,
          JSON.stringify(selectedPath)
        );

        // Fetch or create test from API
        const testResponse = await fetch(
          `/api/career-tests?careerPathId=${pathId}`
        );
        if (!testResponse.ok) {
          throw new Error("Failed to load test");
        }

        const apiTestData = await testResponse.json();

        // Create test if it doesn't exist
        if (!apiTestData.test) {
          const createResponse = await fetch("/api/career-tests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ careerPathId: pathId }),
          });

          if (!createResponse.ok) {
            throw new Error("Failed to create test");
          }

          const newTestData = await createResponse.json();
          testData = newTestData.test;
          setTest(testData);
        } else {
          testData = apiTestData.test;
          setTest(testData);

          // If test is already completed, show results
          if (testData.completedAt) {
            setCurrentStep("results");
            resultsData = {
              score: testData.score,
              recommendations: testData.recommendations,
            };
            setResults(resultsData);
            localStorage.setItem(
              `results-${pathId}`,
              JSON.stringify(resultsData)
            );
          }
        }

        // Save test data to localStorage
        localStorage.setItem(`test-${pathId}`, JSON.stringify(testData));
        localStorage.setItem(
          `cache-timestamp-${pathId}`,
          Date.now().toString()
        );
        setDataSource("api");
      } catch (error) {
        console.error("Error loading test data:", error);
        toast.error(error.message || "Failed to load test");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [pathId]);

  useEffect(() => {
    if (results) {
      // Fetch the selected roadmap index when results are available
      const fetchSelectedRoadmap = async () => {
        try {
          // First check localStorage
          const cachedRoadmapIndex = localStorage.getItem(
            `roadmap-index-${test.id}`
          );
          if (cachedRoadmapIndex !== null) {
            setSelectedRoadmapIndex(parseInt(cachedRoadmapIndex, 10) || 0);
            return;
          }

          // Fall back to API
          const response = await fetch(
            `/api/career-roadmaps?testId=${test.id}`
          );
          if (response.ok) {
            const data = await response.json();
            const index = data.selectedRoadmapIndex || 0;
            setSelectedRoadmapIndex(index);
            localStorage.setItem(`roadmap-index-${test.id}`, index.toString());
          }
        } catch (error) {
          console.error("Error fetching selected roadmap:", error);
        }
      };

      fetchSelectedRoadmap();
    }
  }, [results, test?.id]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0 && pathId) {
      localStorage.setItem(`answers-${pathId}`, JSON.stringify(answers));
    }
  }, [answers, pathId]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleNext = async () => {
    const questions = test?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit all answers
      try {
        setSubmitting(true);

        const answersArray = Object.entries(answers).map(
          ([questionId, userAnswer]) => ({
            questionId,
            userAnswer,
          })
        );

        const response = await fetch("/api/career-tests/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testId: test.id,
            answers: answersArray,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit answers");
        }

        const data = await response.json();
        const newResults = {
          score: data.score,
          recommendations: data.test.recommendations,
        };

        setResults(newResults);
        setCurrentStep("results");

        // Update localStorage with new results and completed test
        localStorage.setItem(`results-${pathId}`, JSON.stringify(newResults));

        const updatedTest = {
          ...test,
          completedAt: new Date().toISOString(),
          score: data.score,
        };
        localStorage.setItem(`test-${pathId}`, JSON.stringify(updatedTest));
        setTest(updatedTest);
      } catch (error) {
        console.error("Error submitting answers:", error);
        toast.error("Failed to submit your answers. Please try again.");
      } finally {
        setSubmitting(false);
      }
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

  const handleViewRoadmap = () => {
    if (!test?.id) {
      toast.error("Unable to access roadmap at this time");
      return;
    }

    // Navigate to the roadmap page with test ID, not requiring a selection
    router.push(`/roadmap/${test.id}`);
  };

  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-md">
      {dataSource === "cache" && !loading && (
        <Badge className="mb-4 bg-green-50 text-green-700 border border-green-200">
          Loaded from cache
        </Badge>
      )}

      {loading ? (
        <div className="p-8 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">
              Loading your personalized assessment...
            </p>
          </div>
        </div>
      ) : !test || !test.questions || test.questions.length === 0 ? (
        <Card className="bg-white border border-gray-200 w-full shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Test Not Available
            </CardTitle>
            <CardDescription className="text-gray-600">
              We couldn&apos;t prepare a test for this career path. Please try
              again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleBackToCareerPaths}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Career Paths
            </Button>
          </CardFooter>
        </Card>
      ) : currentStep === "test" ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
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
              {careerPath?.title} Assessment
            </CardTitle>
            <CardDescription className="text-gray-600">
              Test your knowledge and aptitude for this career path.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-4">
                {currentQuestion?.questionText}
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
              disabled={
                answers[currentQuestion?.id] === undefined || submitting
              }
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              tabIndex="0"
              aria-label="Next question or see results"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  See Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Your {careerPath?.title} Assessment Results
              </CardTitle>
              <CardDescription className="text-gray-600">
                Based on your answers, we&apos;ve prepared learning
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
                    {results?.score >= 70
                      ? "Great job! You have a strong foundation for this career path."
                      : "You're on the right track. These resources will help you build your skills."}
                  </p>
                </div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-500">
                  <span className="text-2xl font-bold text-blue-700">
                    {results?.score}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recommended Learning Resources
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {results?.recommendations &&
                    test?.recommendations &&
                    test.recommendations.map((recommendation, index) => (
                      <RecommendationCard
                        key={index}
                        recommendation={recommendation}
                        index={index}
                        testId={test.id}
                        isSelected={index === selectedRoadmapIndex}
                        onRoadmapSelect={setSelectedRoadmapIndex}
                      />
                    ))}
                </div>

                {(!results?.recommendations ||
                  !test?.recommendations ||
                  test.recommendations.length === 0) && (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p>No recommendations available for this career path.</p>
                  </div>
                )}

                {test?.recommendations && test.recommendations.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={handleViewRoadmap}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      tabIndex="0"
                      aria-label="View your personalized learning roadmap"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      View My Learning Roadmap
                    </Button>
                  </div>
                )}
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
