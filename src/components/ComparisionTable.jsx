import React from "react";
import {
  AlertCircle,
  ArrowRight,
  Zap,
  Target,
  Search,
  Award,
  Users,
} from "lucide-react";
import { kaushan_script } from "@/app/fonts";

const ComparisonTable = () => {
  const comparisonData = {
    oldWay: [
      {
        title: "Blindsided by Layoffs",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      },
      {
        title: "Stuck, no direction",
        icon: <Target className="w-5 h-5 text-red-500" />,
      },
      {
        title: "Endless job hunt",
        icon: <Search className="w-5 h-5 text-red-500" />,
      },
      {
        title: "Resume panic at 2AM",
        icon: <Zap className="w-5 h-5 text-red-500" />,
      },
      {
        title: "Advice from random blogs",
        icon: <Users className="w-5 h-5 text-red-500" />,
      },
    ],
    certcyWay: [
      {
        title: "Spot risks early",
        icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
      },
      {
        title: "Discover pivots fast",
        icon: <ArrowRight className="w-5 h-5 text-emerald-500" />,
      },
      {
        title: "Get top matches instantly",
        icon: <Target className="w-5 h-5 text-emerald-500" />,
      },
      {
        title: "Use pro tools & stand out",
        icon: <Award className="w-5 h-5 text-emerald-500" />,
      },
      {
        title: "Get actionable career insights & real mentorship",
        icon: <Users className="w-5 h-5 text-emerald-500" />,
      },
    ],
  };

  const theme = {
    periwinkle: "var(--color-periwinkle, #8A85FF)",
    lilac: "var(--color-lilac, #C8A2FF)",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 ">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Career Management Comparison
        </h1>
        <p className="text-gray-400 text-center">
          Compare traditional career management approaches with the Certcy way.
        </p>
      </div>

      <div className="bg-[#0f0f1a] rounded-xl shadow-lg overflow-hidden border border-gray-800/30 max-w-max">
        {/* Table headers */}
        <div className="grid grid-cols-2">
          <div className="bg-gray-800 p-4">
            <h3 className="text-xl font-semibold text-white">The Old Way</h3>
          </div>
          <div className="p-4 bg-[#1e3a8a]">
            <h3 className="text-xl font-semibold text-white">
              The <span className={`${kaushan_script.className}`}>Certcy </span>{" "}
              Way
            </h3>
          </div>
        </div>

        {/* Table content */}
        <div className="divide-y divide-gray-800/50">
          {comparisonData.oldWay.map((oldItem, index) => {
            const certcyItem = comparisonData.certcyWay[index];
            return (
              <div key={index} className="grid grid-cols-2">
                {/* Old way item */}
                <div className="p-6 flex items-start space-x-4 border-r border-gray-800/50">
                  <div className="flex-shrink-0 mt-1">{oldItem.icon}</div>
                  <div className="text-gray-300 font-medium">
                    {oldItem.title}
                  </div>
                </div>

                {/* Certcy way item */}
                <div className="p-6 flex items-start space-x-4 bg-[rgba(20,20,40,0.3)]">
                  <div className="flex-shrink-0 mt-1">{certcyItem.icon}</div>
                  <div className="text-gray-200 font-medium">
                    {certcyItem.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
