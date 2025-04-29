import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pivotRoles = [
  {
    id: "pm-ai",
    title: "Product Manager, AI",
    match: 87,
    description:
      "Your experience in analytics and leadership matches key requirements.",
    letterBg: "bg-blue-600",
    letter: "P",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    match: 82,
    description: "Strong SQL and dashboarding skills align with this role.",
    letterBg: "bg-blue-700",
    letter: "D",
  },
];

export function PivotSnapshot({ className }) {
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

      <div className="space-y-4">
        {pivotRoles.map((role) => (
          <div
            key={role.id}
            className="bg-zinc-800/70 rounded-lg border border-zinc-800 p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`${role.letterBg} w-8 h-8 rounded-md flex items-center justify-center text-white font-semibold`}
                >
                  {role.letter}
                </div>
                <h4 className="font-semibold text-white">{role.title}</h4>
              </div>
              <div className="bg-blue-600/20 text-blue-500 px-2 py-1 rounded text-xs font-medium">
                {role.match}% Fit
              </div>
            </div>
            <p className="text-sm text-zinc-400 pl-11">{role.description}</p>
            <div className="text-right mt-2">
              <Link href="/pivot" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="bg-blue-600/10 text-blue-500 border-blue-600/30 hover:bg-blue-600/20 text-sm"
                  tabIndex="0"
                  aria-label="Explore more pivot roles"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") window.location.href = "/pivot";
                  }}
                >
                  Explore More
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
