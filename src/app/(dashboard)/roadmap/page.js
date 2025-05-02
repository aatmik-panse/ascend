"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Book,
  Calendar,
  Clock,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function RoadmapIndex() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        // This would be updated to fetch from your actual API
        const response = await fetch("/api/learning-roadmap");

        if (!response.ok) {
          throw new Error("Failed to fetch roadmaps");
        }

        const data = await response.json();
        if (Array.isArray(data.roadmaps)) {
          setRoadmaps(data.roadmaps);
        } else {
          // If not an array (might be a single roadmap), ensure we handle it correctly
          setRoadmaps(data.roadmap ? [data.roadmap] : []);
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        setError("Failed to load your roadmaps. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const navigateToRoadmap = (id) => {
    router.push(`/roadmap/${id}`);
  };

  const calculateProgress = (roadmap) => {
    if (!roadmap || !roadmap.weeks || !Array.isArray(roadmap.weeks)) return 0;

    let totalActivities = 0;
    roadmap.weeks.forEach((week) => {
      totalActivities += week.activities?.length || 0;
    });

    if (totalActivities === 0) return 0;

    const completedActivities = Array.isArray(roadmap.completedSteps)
      ? roadmap.completedSteps.length
      : 0;

    return Math.round((completedActivities / totalActivities) * 100);
  };

  const filteredRoadmaps = roadmaps
    .filter((roadmap) => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          roadmap.title.toLowerCase().includes(query) ||
          roadmap.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((roadmap) => {
      // Apply status filter
      const progress = calculateProgress(roadmap);
      if (filter === "completed") return progress === 100;
      if (filter === "active") return progress < 100;
      return true; // "all" filter
    });

  const handleCreateNewRoadmap = () => {
    // For now, just navigate to career pivot section
    // This could be extended to a dedicated roadmap creation flow
    router.push("/career_pivot");
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Learning Roadmaps
          </h1>
          <p className="text-gray-600">
            Your personalized weekly learning paths to achieve career goals
          </p>
        </div>
        <Button
          onClick={handleCreateNewRoadmap}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          tabIndex="0"
          aria-label="Create a new roadmap"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Roadmap
        </Button>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search roadmaps..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roadmaps</option>
            <option value="active">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {filteredRoadmaps.length === 0 ? (
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-8 text-center">
            <Book className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              No Roadmaps Found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || filter !== "all"
                ? "No roadmaps match your current filters. Try adjusting your search or filter criteria."
                : "You haven't created any learning roadmaps yet. Create your first roadmap by exploring career paths."}
            </p>
            <Button
              onClick={handleCreateNewRoadmap}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Explore Career Paths
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => {
            const progress = calculateProgress(roadmap);
            return (
              <Card
                key={roadmap.id}
                className="border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigateToRoadmap(roadmap.id)}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigateToRoadmap(roadmap.id);
                  }
                }}
              >
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        className={`${
                          progress === 100
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}
                      >
                        {progress === 100 ? (
                          <>
                            <Trophy className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <BarChart className="h-3 w-3 mr-1" />
                            {progress}% Complete
                          </>
                        )}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {roadmap.totalWeeks} weeks
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-1">
                      {roadmap.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>

                    <Progress
                      value={progress}
                      className="h-1.5 bg-gray-100 mb-3"
                      indicatorClassName={`${
                        progress === 100
                          ? "bg-green-500"
                          : progress >= 50
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    />

                    <div className="flex items-center text-xs text-gray-500 justify-between">
                      <span className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {roadmap.weeks?.[0]?.theme || "Weekly learning journey"}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Updated{" "}
                        {new Date(roadmap.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
