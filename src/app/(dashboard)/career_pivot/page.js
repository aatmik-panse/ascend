"use client";
import React from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

const CareerPivot = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
          }}>
          Career Pivot Recommendations
        </h1>
        <p className="text-gray-400">Explore new career paths based on your skills and market trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h2 className="text-2xl font-semibold mb-6">Recommended Career Paths</h2>
            <div className="space-y-6">
              {[
                {
                  role: 'Product Manager',
                  matchScore: 92,
                  salary: '$120,000 - $180,000',
                  demand: 'High',
                },
                {
                  role: 'Data Scientist',
                  matchScore: 88,
                  salary: '$100,000 - $160,000',
                  demand: 'Very High',
                },
                {
                  role: 'UX Designer',
                  matchScore: 85,
                  salary: '$90,000 - $140,000',
                  demand: 'Medium',
                },
              ].map((career) => (
                <div key={career.role} 
                  className="p-6 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: 'rgba(20, 20, 40, 0.5)',
                    borderLeft: `3px solid ${theme.periwinkle}`
                  }}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{career.role}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium" 
                      style={{ 
                        background: `${theme.periwinkle}20`,
                        color: theme.periwinkle 
                      }}>
                      {career.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-gray-400 space-y-1">
                    <p>Salary Range: {career.salary}</p>
                    <p>Market Demand: {career.demand}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h3 className="text-xl font-semibold mb-4">Recommended Courses</h3>
            <div className="space-y-4">
              {[
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: "Product Management Fundamentals",
                  platform: "Coursera",
                  duration: "12 weeks"
                },
                {
                  icon: <TrendingUp className="h-5 w-5" />,
                  title: "Data Science Bootcamp",
                  platform: "Udemy",
                  duration: "16 weeks"
                },
                {
                  icon: <Award className="h-5 w-5" />,
                  title: "UX Design Certificate",
                  platform: "LinkedIn Learning",
                  duration: "8 weeks"
                }
              ].map((course, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg transition-all duration-300 hover:bg-gray-900">
                  <div className="p-2 rounded-lg" style={{ background: `${theme.lilac}15`, color: theme.lilac }}>
                    {course.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-gray-400">{course.platform} • {course.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPivot;
