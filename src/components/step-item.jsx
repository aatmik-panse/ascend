"use client";

import React from "react";
import { motion } from "framer-motion";

export function StepItem({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-md py-8 md:py-12 transition-all duration-300 hover:scale-105" // Reduced padding
      initial={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative mb-6">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/30 shadow-lg shadow-blue-500/20" />
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500/50 bg-neutral-900 backdrop-blur-sm">
          <Icon className="h-7 w-7 text-blue-400" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
