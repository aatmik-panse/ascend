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
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [selectedPivot, setSelectedPivot] = useState(null);
  const [pivotProgress, setPivotProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    // Load selected pivot from database first, then fallback to localStorage
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
        const savedExpandedWeeks = localStorage.getItem(
          `roadmap-${id}-expandedWeeks`
        );
        let expandedState = {};

        if (savedExpandedWeeks) {
          expandedState = JSON.parse(savedExpandedWeeks);
        } else if (data.roadmap?.weeks) {
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

        // Load selected pivot from database first, then fallback to localStorage
        if (data.roadmap?.selectedPivot) {
          setSelectedPivot(data.roadmap.selectedPivot);
          // Also update localStorage to keep them in sync
          localStorage.setItem(
            `roadmap-${id}-selectedPivot`,
            JSON.stringify(data.roadmap.selectedPivot)
          );
        } else {
          // Fallback to localStorage if not in database
          const savedPivot = localStorage.getItem(
            `roadmap-${id}-selectedPivot`
          );
          if (savedPivot) {
            const pivotData = JSON.parse(savedPivot);
            setSelectedPivot(pivotData);

            // Save to database to keep them in sync
            try {
              await fetch("/api/learning-roadmap/pivot", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  roadmapId: id,
                  selectedPivot: pivotData,
                }),
              });
            } catch (error) {
              console.error("Error syncing pivot to database:", error);
            }
          }
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

  useEffect(() => {
    // Save expanded weeks to localStorage
    if (Object.keys(expandedWeeks).length > 0) {
      localStorage.setItem(
        `roadmap-${id}-expandedWeeks`,
        JSON.stringify(expandedWeeks)
      );
    }
  }, [expandedWeeks, id]);

  useEffect(() => {
    // Load focus mode preference from localStorage
    const savedFocusMode = localStorage.getItem(`roadmap-${id}-focusMode`);
    if (savedFocusMode) {
      setFocusMode(JSON.parse(savedFocusMode));
    }
  }, [id]);

  useEffect(() => {
    // Save focus mode preference to localStorage
    if (selectedPivot) {
      localStorage.setItem(
        `roadmap-${id}-focusMode`,
        JSON.stringify(focusMode)
      );
    } else if (focusMode) {
      // If no pivot is selected, turn off focus mode
      setFocusMode(false);
      localStorage.removeItem(`roadmap-${id}-focusMode`);
    }
  }, [focusMode, selectedPivot, id]);

  useEffect(() => {
    if (selectedPivot && roadmap) {
      // Find the selected activity
      const week = roadmap.weeks.find(
        (w) => w.weekNumber === selectedPivot.weekNumber
      );
      if (week) {
        const activityId = `week${selectedPivot.weekNumber}-activity${selectedPivot.activityIndex}`;
        const isCompleted = completedActivities.includes(activityId);
        setPivotProgress(isCompleted ? 100 : 0);
      }
    } else {
      setPivotProgress(0);
    }
  }, [selectedPivot, completedActivities, roadmap]);

  const handleToggleWeek = (weekNumber) => {
    setExpandedWeeks((prev) => {
      const updated = {
        ...prev,
        [weekNumber]: !prev[weekNumber],
      };
      localStorage.setItem(
        `roadmap-${id}-expandedWeeks`,
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const handleSelectPivot = async (weekNumber, activityIndex) => {
    const pivotInfo = {
      weekNumber,
      activityIndex,
    };

    // If the same pivot is selected again, clear the selection
    if (
      selectedPivot &&
      selectedPivot.weekNumber === weekNumber &&
      selectedPivot.activityIndex === activityIndex
    ) {
      setSelectedPivot(null);
      localStorage.removeItem(`roadmap-${id}-selectedPivot`);

      // Save to database - clear the selected pivot
      try {
        const response = await fetch("/api/learning-roadmap/pivot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roadmapId: id,
            selectedPivot: null,
          }),
        });

        if (!response.ok) {
          console.error("Failed to clear pivot in database");
        }
      } catch (error) {
        console.error("Error saving pivot to database:", error);
      }
    } else {
      setSelectedPivot(pivotInfo);
      localStorage.setItem(
        `roadmap-${id}-selectedPivot`,
        JSON.stringify(pivotInfo)
      );

      // Expand the week containing the selected pivot
      setExpandedWeeks((prev) => {
        const updated = { ...prev, [weekNumber]: true };
        localStorage.setItem(
          `roadmap-${id}-expandedWeeks`,
          JSON.stringify(updated)
        );
        return updated;
      });

      // Save to database
      try {
        const response = await fetch("/api/learning-roadmap/pivot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roadmapId: id,
            selectedPivot: pivotInfo,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save pivot to database");
        }
      } catch (error) {
        console.error("Error saving pivot to database:", error);
      }
    }
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
      console.log(`Updating roadmap progress for roadmap ID: ${id}`);
      console.log(`Updated completed activities:`, updatedCompletedActivities);

      // Make sure we're using the roadmap's actual ID, not the test ID
      const actualRoadmapId = roadmap?.id || id;

      const response = await fetch("/api/learning-roadmap", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapId: actualRoadmapId,
          completedSteps: updatedCompletedActivities,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to update progress");
      }

      // Success notification
      toast.success("Progress updated");
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
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {focusMode && selectedPivot && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-blue-800">Focus Mode Active</h2>
              <p className="text-sm text-blue-600">
                You&apos;re focusing on your selected pivot activity
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFocusMode(false)}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Exit Focus Mode
          </Button>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
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
          {roadmap.weeks
            .filter(
              (week) =>
                !selectedPivot || week.weekNumber === selectedPivot.weekNumber
            )
            .map((week) => (
              <motion.div
                key={`week-${week.weekNumber}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-lg shadow-sm border ${
                  currentWeek === week.weekNumber
                    ? "border-blue-300 ring-1 ring-blue-200"
                    : selectedPivot &&
                      selectedPivot.weekNumber === week.weekNumber
                    ? "border-blue-500 ring-1 ring-blue-300"
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
                          : selectedPivot &&
                            selectedPivot.weekNumber === week.weekNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {week.weekNumber}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center">
                        Week {week.weekNumber}
                        {selectedPivot &&
                          selectedPivot.weekNumber === week.weekNumber && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Contains Pivot
                            </span>
                          )}
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
                        {week.activities
                          .filter(
                            (_, activityIndex) =>
                              !selectedPivot ||
                              (selectedPivot.weekNumber === week.weekNumber &&
                                selectedPivot.activityIndex === activityIndex)
                          )
                          .map((activity, activityIndex) => {
                            const activityId = `week${week.weekNumber}-activity${activityIndex}`;
                            const isCompleted =
                              completedActivities.includes(activityId);
                            const isPivot =
                              selectedPivot &&
                              selectedPivot.weekNumber === week.weekNumber &&
                              selectedPivot.activityIndex === activityIndex;
                            return (
                              <div
                                key={activityId}
                                className={`p-3 rounded-md border ${
                                  isCompleted
                                    ? "bg-green-50 border-green-200"
                                    : isPivot
                                    ? "bg-blue-50 border-blue-200"
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
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="bg-gray-200 text-gray-800 border-gray-300">
                                          {getActivityIcon(activity.type)}
                                          <span className="ml-1 capitalize">
                                            {activity.type || "Task"}
                                          </span>
                                        </Badge>
                                        <h5 className="font-medium text-gray-100">
                                          {activity.title}
                                        </h5>
                                      </div>
                                      <div className="flex items-center mt-2 sm:mt-0">
                                        <div className="flex items-center text-xs text-gray-500 mr-2">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {activity.estimatedTime}
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectPivot(
                                              week.weekNumber,
                                              activityIndex
                                            );
                                          }}
                                          className={`text-xs px-2 py-1 h-auto ${
                                            isPivot
                                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                          }`}
                                        >
                                          {isPivot
                                            ? "Unselect Pivot"
                                            : "Select as Pivot"}
                                        </Button>
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
                                        className="text-xs text-blue-600 hover:text-blue-800 underline inline-flex items-center break-words"
                                      >
                                        <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="break-all">
                                          Resource: {activity.resource}
                                        </span>
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

      {selectedPivot && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4 w-64 border border-blue-200">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              Pivot Focus
            </h4>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-blue-600">
                  {pivotProgress}%
                </span>
              </div>
              <Progress
                value={pivotProgress}
                className="h-2 bg-gray-100"
                indicatorClassName={
                  pivotProgress === 100 ? "bg-green-500" : "bg-blue-500"
                }
              />
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {pivotProgress === 100 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed! Great job!
                </div>
              ) : (
                <div>Mark the activity as complete to track your progress</div>
              )}
            </div>
            <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
              <Switch
                id="focus-mode"
                checked={focusMode}
                onCheckedChange={setFocusMode}
              />
              <Label
                htmlFor="focus-mode"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                Focus Mode
              </Label>
            </div>
          </div>
          <Button
            onClick={async () => {
              setSelectedPivot(null);
              localStorage.removeItem(`roadmap-${id}-selectedPivot`);

              // Clear from database
              try {
                const response = await fetch("/api/learning-roadmap/pivot", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    roadmapId: id,
                    selectedPivot: null,
                  }),
                });

                if (!response.ok) {
                  console.error("Failed to clear pivot in database");
                }
              } catch (error) {
                console.error("Error clearing pivot from database:", error);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Clear Pivot Focus
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
