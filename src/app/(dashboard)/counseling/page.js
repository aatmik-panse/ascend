"use client";
import React, { useState } from 'react';
import { MessageSquare, Video, Calendar, Bot } from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

const Counseling = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
          }}>
          Career Counseling
        </h1>
        <p className="text-gray-400">Get personalized guidance from AI and expert career counselors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg" style={{ background: `${theme.periwinkle}15`, color: theme.periwinkle }}>
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">AI Career Assistant</h2>
            </div>
            
            <div className="h-96 rounded-lg p-4 mb-4 overflow-y-auto"
              style={{ background: 'rgba(20, 20, 40, 0.5)' }}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg" style={{ background: `${theme.periwinkle}15`, color: theme.periwinkle }}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p>Hello! I&apos;m your AI career assistant. How can I help you today?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': `${theme.periwinkle}50` }}
              />
              <button 
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{ 
                  background: `${theme.periwinkle}20`,
                  color: theme.periwinkle 
                }}>
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h3 className="text-xl font-semibold mb-6">Human Counseling</h3>
            <div className="space-y-4">
              {[
                { icon: <Video className="h-5 w-5" />, label: "Video Session", price: "$99" },
                { icon: <MessageSquare className="h-5 w-5" />, label: "Chat Session", price: "$49" },
                { icon: <Calendar className="h-5 w-5" />, label: "Monthly Plan", price: "$199" }
              ].map((option, index) => (
                <button key={index} 
                  className="w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'rgba(20, 20, 40, 0.5)' }}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ background: `${theme.lilac}15`, color: theme.lilac }}>
                      {option.icon}
                    </div>
                    <span>{option.label}</span>
                  </div>
                  <span style={{ color: theme.lilac }}>{option.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h3 className="text-xl font-semibold mb-4">Why Choose Human Counseling?</h3>
            <ul className="space-y-3 text-gray-400">
              {[
                "Personalized 1-on-1 attention",
                "Expert industry insights",
                "Custom career strategy",
                "Network opportunities"
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.lilac }}></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counseling;
