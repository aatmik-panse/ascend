"use client";
import { kaushan_script } from "@/app/fonts";
import Aurora from "@/Backgrounds/Aurora/Aurora";
import Ballpit from "@/Backgrounds/Ballpit/Ballpit";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="w-screen h-screen bg-neutral-950">
      <Aurora />

      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <div className="absolute inset-0 z-10">
          <Ballpit
            count={100}
            gravity={0.5}
            friction={1.0}
            wallBounce={1.0}
            followCursor={false}
            lightIntensity={100}
            colors={["#8A85FF", "#C8A2FF", "#6344F5", "#3B82F6"]}
          />
        </div>

        <div className="text-center z-20 relative">
          <h1
            className={`text-6xl font-bold text-blue-500 mb-4 ${kaushan_script.className}`}
          >
            Certcy
          </h1>
          <h1 className="text-5xl font-bold text-white mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-200">
            We're working on something amazing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
