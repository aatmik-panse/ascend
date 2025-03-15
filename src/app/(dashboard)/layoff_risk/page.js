"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import RiskChart from '@/components/RiskChart';

const mockData = [
  { month: 'Jan', riskScore: 25 },
  { month: 'Feb', riskScore: 30 },
  { month: 'Mar', riskScore: 45 },
  { month: 'Apr', riskScore: 35 },
  { month: 'May', riskScore: 40 },
  { month: 'Jun', riskScore: 50 },
  { month: 'Jul', riskScore: 55 },
  { month: 'Aug', riskScore: 60 },
  { month: 'Sep', riskScore: 65 },
  { month: 'Oct', riskScore: 70 },
  { month: 'Nov', riskScore: 75 },
  { month: 'Dec', riskScore: 80 },
];

const LayoffRisk = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Layoff Risk Assessment</h1>
        <p className="text-gray-400">Monitor your company's health and industry trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#0f0f0f] rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Risk Trend Analysis</h2>
            <RiskChart data={mockData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">Current Risk Level</h3>
                <p className="text-3xl font-bold text-yellow-500">40%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Risk Factors</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span>Industry Layoffs</span>
                <span className="text-yellow-500">Medium</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Company Growth</span>
                <span className="text-green-500">Strong</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Market Conditions</span>
                <span className="text-red-500">Weak</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoffRisk;