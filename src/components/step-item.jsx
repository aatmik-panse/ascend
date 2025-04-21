"use client";

import React from "react";
import { motion } from "framer-motion";

export function StepItem({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-md py-8 md:py-12 transition-all duration-300 hover:scale-105" // Reduced padding
      initial={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative mb-6">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/30 shadow-lg " />
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2  bg-neutral-900 backdrop-blur-sm">
          <Icon className="h-10 w-10 text-blue-400" />
        </div>
      </div>
      <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-xl">{description}</p>
    </motion.div>
  );
}
