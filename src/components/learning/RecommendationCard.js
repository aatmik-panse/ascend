"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Add router import
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Check,
  ExternalLink,
  Map,
  ArrowRight,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";

const RecommendationCard = ({
  recommendation,
  index,
  testId,
  isSelected = false,
  onRoadmapSelect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const router = useRouter();

  const handleRedirect = () => {
    if (recommendation.courseUrl && recommendation.courseUrl !== "#") {
      window.open(recommendation.courseUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Course URL is not available for this recommendation");
    }
  };

  const handleRoadmapClick = () => {
    setShowRoadmap(!showRoadmap);
  };

  const handleSelectRoadmap = async () => {
    if (isSelected) {
      // If already selected, navigate directly to roadmap
      router.push(`/roadmap/${testId}`);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/career-roadmaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          recommendationIndex: index,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to select roadmap");
      }

      toast.success("Roadmap selected successfully!");
      onRoadmapSelect(index);

      // Navigate to roadmap page after successful selection
      router.push(`/roadmap/${testId}`);
    } catch (error) {
      console.error("Error selecting roadmap:", error);
      toast.error("Could not select this roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("beginner"))
      return "bg-green-100 text-green-800 border-green-200";
    if (levelLower.includes("intermediate"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (levelLower.includes("advanced"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card
      className={`bg-white border ${
        isSelected ? "border-blue-500 shadow-md" : "border-gray-200"
      } rounded-lg overflow-hidden hover:shadow-md transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
          <Badge className={getDifficultyColor(recommendation.level)}>
            {recommendation.level}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-3">{recommendation.provider}</p>

        {recommendation.description && (
          <p className="text-gray-700 text-sm mb-4 border-l-2 border-gray-300 pl-3">
            {recommendation.description}
          </p>
        )}

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <BookOpen className="h-3.5 w-3.5 mr-1" />
          <span>{recommendation.duration}</span>
        </div>

        {showRoadmap && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
              <Map className="h-3.5 w-3.5 mr-1.5" /> Learning Roadmap
            </h5>
            <ol className="pl-5 list-decimal text-sm space-y-1 text-gray-700">
              {Array.isArray(recommendation.roadmapSteps) ? (
                recommendation.roadmapSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))
              ) : (
                <li>Roadmap not available</li>
              )}
            </ol>
          </div>
        )}

        {/* Updated button layout for better mobile visibility */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white py-2 text-sm md:text-base flex-1"
            onClick={handleRedirect}
            tabIndex="0"
            aria-label={`Go to ${recommendation.title} course`}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" /> Course
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-300 py-2 text-sm md:text-base flex-1"
            onClick={handleRoadmapClick}
            tabIndex="0"
            aria-label={showRoadmap ? "Hide roadmap" : "Show roadmap"}
          >
            <Map className="h-4 w-4 mr-1.5" />
            <span>{showRoadmap ? "Hide" : "Roadmap"}</span>
          </Button>

          {isSelected ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-sm md:text-base flex-1"
              onClick={handleSelectRoadmap}
              tabIndex="0"
              aria-label="View selected roadmap"
            >
              <BookOpen className="h-4 w-4 mr-1.5" /> View
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm md:text-base flex-1"
              onClick={handleSelectRoadmap}
              disabled={isLoading}
              tabIndex="0"
              aria-label={`Select ${recommendation.title} roadmap`}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-1.5"></div>
              ) : (
                <BarChart className="h-4 w-4 mr-1.5" />
              )}
              Select
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard;
