"use client";
import React from 'react';
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 ml-24">
        {children}
      </main>
    </div>
  );
}
