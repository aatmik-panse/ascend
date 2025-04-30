"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecommendedPivots = ({ className }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          AI-Recommended Pivots
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAll}
          className="text-zinc-400 hover:text-zinc-100"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group"
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
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-zinc-100 group-hover:text-white transition-colors">
                {rec.title}
              </h3>
              <Badge className={cn("border", getMatchColor(rec.match))}>
                <Award className="h-3 w-3 mr-1" />
                {rec.match}% Match
              </Badge>
            </div>
            {rec.skills.length > 0 && (
              <div className="flex gap-1 my-1">
                {rec.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-zinc-900/50 text-zinc-400 border-zinc-800 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
                {rec.skills.length > 2 && (
                  <span className="text-xs text-zinc-500">
                    +{rec.skills.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
