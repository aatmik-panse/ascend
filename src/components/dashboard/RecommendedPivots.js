"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecommendedPivots = ({ className }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPivots, setSelectedPivots] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Load all selected pivots from localStorage
    const loadSelectedPivots = () => {
      const pivots = {};
      
      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('roadmap-') && key.endsWith('-selectedPivot')) {
          try {
            const roadmapId = key.split('-')[1];
            const pivotData = JSON.parse(localStorage.getItem(key));
            pivots[roadmapId] = pivotData;
          } catch (e) {
            console.error('Error parsing pivot data:', e);
          }
        }
      }
      
      setSelectedPivots(pivots);
    };
    
    loadSelectedPivots();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes('-selectedPivot')) {
        loadSelectedPivots();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/career-recommendations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recommendations");
        }

        // Format the data for display
        const formattedData = data.recommendations
          .map((rec) => ({
            id: rec.id,
            title: rec.title,
            match: rec.matchPercentage,
            description: rec.description?.substring(0, 100) + "...",
            skills: rec.skills?.slice(0, 2) || [],
          }))
          // Sort by match percentage (highest first)
          .sort((a, b) => b.match - a.match)
          // Limit to top 3
          .slice(0, 3);

        setRecommendations(formattedData);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getMatchColor = (match) => {
    if (match >= 90)
      return "bg-green-900/20 text-green-400 border-green-900/30";
    if (match >= 80) return "bg-blue-900/20 text-blue-400 border-blue-900/30";
    if (match >= 70)
      return "bg-amber-900/20 text-amber-400 border-amber-900/30";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  const handleViewAll = () => {
    router.push("/career_pivot");
  };

  const handleExploreOne = (id) => {
    router.push(`/career_pivot/test/${id}`);
  };
  
  const handleViewSelectedPivot = (roadmapId) => {
    router.push(`/roadmap/${roadmapId}`);
  };

  // Check if there are any selected pivots
  const hasSelectedPivots = Object.keys(selectedPivots).length > 0;

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-[200px]",
          className
        )}
      >
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
          <p className="text-sm text-zinc-500">
            Finding your perfect pivots...
          </p>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Career Pivot Paths
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center h-[180px] border border-dashed border-zinc-700 rounded-lg">
          <p className="text-zinc-500 text-sm mb-3">
            Complete your profile to get personalized career recommendations
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/onboarding")}
            className="border-zinc-700 hover:border-zinc-600 text-zinc-300"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "card-gradient p-6 space-y-4 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold text-white">Pivot Snapshot</h3>
      </div>
      <p className="text-sm text-zinc-400 mb-4">
        Top AI-recommended roles for your pivot journey
      </p>

      {/* Display selected pivots if any */}
      {hasSelectedPivots && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-yellow-400">Your Selected Pivots</h4>
          </div>
          <div className="space-y-3">
            {Object.entries(selectedPivots).map(([roadmapId, pivotData]) => (
              <div
                key={`selected-${roadmapId}`}
                className="bg-blue-900/30 rounded-lg border border-blue-800/50 p-3 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => handleViewSelectedPivot(roadmapId)}
                tabIndex="0"
                aria-label="View your selected pivot"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleViewSelectedPivot(roadmapId);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <div className="text-sm text-white">
                      Selected Pivot (Week {pivotData.weekNumber})
                    </div>
                  </div>
                  <Badge className="bg-blue-600/30 text-blue-400 border-blue-700/50">
                    View
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-zinc-800/70 rounded-lg border border-zinc-800 p-4 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => handleExploreOne(rec.id)}
            tabIndex="0"
            aria-label={`Explore ${rec.title} career path`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleExploreOne(rec.id);
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`${
                    rec.match >= 90
                      ? "bg-blue-600"
                      : rec.match >= 80
                      ? "bg-blue-700"
                      : "bg-blue-800"
                  } 
                  w-8 h-8 rounded-md flex items-center justify-center text-white font-semibold`}
                >
                  {rec.title.charAt(0)}
                </div>
                <h4 className="font-semibold text-white">{rec.title}</h4>
              </div>
              <div className="bg-blue-600/20 text-blue-500 px-2 py-1 rounded text-xs font-medium">
                {rec.match}% Fit
              </div>
            </div>
            {rec.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3 pl-11">
                {rec.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-zinc-900/70 text-zinc-300 border border-zinc-800 font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
                {rec.skills.length > 2 && (
                  <Badge className="bg-zinc-900/70 text-zinc-400 border border-zinc-800 font-normal">
                    +{rec.skills.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-right mt-2 pt-2 border-t border-zinc-800">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAll}
          className="bg-blue-600/10 text-blue-500 border-blue-600/30 hover:bg-blue-600/20 text-sm"
          tabIndex="0"
          aria-label="View all AI-recommended career paths"
        >
          View All Paths
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
