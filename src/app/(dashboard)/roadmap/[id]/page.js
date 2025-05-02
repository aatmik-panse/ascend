"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  Video,
  Code,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Trophy,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "motion/react";

const RoadmapPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedActivities, setCompletedActivities] = useState([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        // First try to fetch directly using ID
        let response = await fetch(`/api/learning-roadmap?id=${id}`);

        // If not found, try to fetch using testId (since our ID might be a test ID)
        if (response.status === 404) {
          response = await fetch(`/api/learning-roadmap?testId=${id}`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch roadmap");
        }

        const data = await response.json();
        setRoadmap(data.roadmap);

        // Initialize expanded state for all weeks
        const expandedState = {};
        if (data.roadmap?.weeks) {
          data.roadmap.weeks.forEach((week) => {
            expandedState[week.weekNumber] = week.weekNumber === 1; // Only expand first week by default
          });
        }
        setExpandedWeeks(expandedState);

        // Set completed activities from saved data
        if (
          data.roadmap?.completedSteps &&
          Array.isArray(data.roadmap.completedSteps)
        ) {
          setCompletedActivities(data.roadmap.completedSteps);
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        setError(error.message || "Failed to load roadmap");
        toast.error("Failed to load your roadmap");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  const handleToggleWeek = (weekNumber) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNumber]: !prev[weekNumber],
    }));
  };

  const handleToggleActivity = async (weekNumber, activityIndex) => {
    const activityId = `week${weekNumber}-activity${activityIndex}`;
    let updatedCompletedActivities;

    if (completedActivities.includes(activityId)) {
      updatedCompletedActivities = completedActivities.filter(
        (id) => id !== activityId
      );
    } else {
      updatedCompletedActivities = [...completedActivities, activityId];
    }

    setCompletedActivities(updatedCompletedActivities);

    // Save to database
    try {
      const response = await fetch("/api/learning-roadmap", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapId: id,
          completedSteps: updatedCompletedActivities,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save your progress");
    }
  };

  const calculateProgress = () => {
    if (!roadmap || !roadmap.weeks) return 0;

    let totalActivities = 0;
    roadmap.weeks.forEach((week) => {
      totalActivities += week.activities?.length || 0;
    });

    if (totalActivities === 0) return 0;
    return Math.round((completedActivities.length / totalActivities) * 100);
  };

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "reading":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "project":
        return <Code className="h-4 w-4" />;
      case "exercise":
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleRegenerateRoadmap = async () => {
    if (
      !confirm(
        "Are you sure you want to regenerate this roadmap? Your current progress will be lost."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const testId = roadmap.testId;

      // First route to the roadmap index page
      router.push("/roadmap");

      // Then regenerate the roadmap
      toast.success("Generating new roadmap...");
    } catch (error) {
      console.error("Error regenerating roadmap:", error);
      toast.error("Failed to regenerate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Roadmap
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <Button onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => router.push("/roadmap")}>
              View All Roadmaps
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Roadmap Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested roadmap could not be found.
          </p>
          <Button onClick={() => router.push("/roadmap")}>
            View All Roadmaps
          </Button>
        </Card>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="mb-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
              {roadmap.title}
            </h1>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateRoadmap}
              className="border-gray-300 text-gray-700"
              tabIndex="0"
              aria-label="Regenerate this roadmap"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{roadmap.description}</p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Overall Progress</h3>
            <Badge
              className={`${
                progress >= 75
                  ? "bg-green-100 text-green-800 border-green-200"
                  : progress >= 40
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {progress}% Complete
            </Badge>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gray-100"
            indicatorClassName={`${
              progress >= 75
                ? "bg-green-500"
                : progress >= 40
                ? "bg-blue-500"
                : "bg-amber-500"
            }`}
          />
          {progress === 100 && (
            <div className="mt-3 text-center">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <Trophy className="h-3.5 w-3.5 mr-1.5" />
                Roadmap Completed! 🎉
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {roadmap.weeks.map((week) => (
            <motion.div
              key={`week-${week.weekNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg shadow-sm border ${
                currentWeek === week.weekNumber
                  ? "border-blue-300 ring-1 ring-blue-200"
                  : "border-gray-200"
              }`}
            >
              <div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => handleToggleWeek(week.weekNumber)}
                tabIndex="0"
                aria-label={`Toggle Week ${week.weekNumber} visibility`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleWeek(week.weekNumber);
                  }
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${
                      currentWeek === week.weekNumber
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {week.weekNumber}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Week {week.weekNumber}
                    </h3>
                    <p className="text-sm text-gray-600">{week.theme}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {expandedWeeks[week.weekNumber] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {expandedWeeks[week.weekNumber] && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Goals
                    </h4>
                    <p className="text-sm text-gray-600">{week.goals}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Activities
                    </h4>
                    <div className="space-y-3">
                      {week.activities.map((activity, activityIndex) => {
                        const activityId = `week${week.weekNumber}-activity${activityIndex}`;
                        const isCompleted =
                          completedActivities.includes(activityId);
                        return (
                          <div
                            key={activityId}
                            className={`p-3 rounded-md border ${
                              isCompleted
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            } transition-colors`}
                          >
                            <div className="flex">
                              <div
                                className="mr-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleActivity(
                                    week.weekNumber,
                                    activityIndex
                                  );
                                }}
                                tabIndex="0"
                                aria-label={`Mark activity ${
                                  isCompleted ? "incomplete" : "complete"
                                }`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleToggleActivity(
                                      week.weekNumber,
                                      activityIndex
                                    );
                                  }
                                }}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <Badge className="mr-2 bg-gray-200 text-gray-800 border-gray-300">
                                      {getActivityIcon(activity.type)}
                                      <span className="ml-1 capitalize">
                                        {activity.type || "Task"}
                                      </span>
                                    </Badge>
                                    <h5 className="font-medium text-gray-100">
                                      {activity.title}
                                    </h5>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.estimatedTime}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {activity.description}
                                </p>
                                {activity.resource && (
                                  <a
                                    href={
                                      activity.resource.startsWith("http")
                                        ? activity.resource
                                        : `https://www.google.com/search?q=${encodeURIComponent(
                                            activity.resource
                                          )}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                                  >
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    Resource: {activity.resource}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Expected Outcomes
                      </h4>
                      <p className="text-sm text-gray-600">{week.outcomes}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
