"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Radar, Rocket } from "lucide-react";
import { TracingBeam } from "./tracing-beam";
import { cn } from "@/lib/utils";
import { kaushan_script } from "@/app/fonts";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { StepItem } from "./step-item";

export default function TracingBeamFeature() {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const steps = [
    {
      icon: Radar,
      title: "Detect the Storm",
      description:
        "Plug in your job role and company → we scan real-time layoff signals.",
    },
    {
      icon: Compass,
      title: "Find a New Direction",
      description:
        "Certcy reveals career pivots where you're not just safe—you'll thrive.",
    },
    {
      icon: Rocket,
      title: "Upgrade & Move Forward",
      description:
        "Certcy curates skill paths + applies for you → you stay in control, always.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-4xl px-4 py-16 md:py-24 bg-neutral-950 overflow-hidden" // Reduced vertical padding
    >
      <div className="absolute inset-0 pointer-events-none">
        <DotPattern
          // glow={true}
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "opacity-20"
          )}
        />
      </div>

      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white">
        {" "}
        {/* Reduced margin */}
        How{" "}
        <span className={`text-blue-500 ${kaushan_script.className}`}>
          Certcy
        </span>{" "}
        works
      </h2>

      {isMounted && (
        <TracingBeam className="relative z-10">
          <div className="relative flex flex-col items-center gap-8 md:gap-12">
            {" "}
            {/* Significantly reduced gap */}
            {steps.map((step, index) => (
              <StepItem
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                index={index}
              />
            ))}
          </div>
        </TracingBeam>
      )}
    </div>
  );
}
