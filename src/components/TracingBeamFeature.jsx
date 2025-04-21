"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Radar, Rocket, ArrowRight } from "lucide-react";
import { TracingBeam } from "./tracing-beam";
import { cn } from "@/lib/utils";
import { kaushan_script } from "@/app/fonts";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { StepItem } from "./step-item";
import Link from "next/link";

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
      title: "Pivot with Precision",
      description:
        "Get instant pivot paths tailored to your profile. Whether it's a safer domain or smarter role, Certcy reveals where you can thrive next.",
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
      id="working"
      className="relative mx-auto w-full px-4 py-16 md:py-24 bg-neutral-950 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none w-[100vw] h-full">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,transparent,white)]",
            "opacity-30"
          )}
        />
      </div>

      <h2
        className="text-4xl md:text-5xl font-bold mb-10 text-center text-white"
        aria-label="How Certcy works"
      >
        How{" "}
        <span className={`text-blue-500 ${kaushan_script.className}`}>
          Certcy
        </span>{" "}
        works
      </h2>

      {isMounted && (
        <TracingBeam className="relative z-10">
          <div className="relative flex flex-col items-center gap-8 md:gap-12">
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
