"use client";
import React from 'react';
import { UserPlus, MessageSquare, Briefcase } from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

const Networking = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
          }}>
          Smart Networking
        </h1>
        <p className="text-gray-400">Automate your networking and job application process.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h2 className="text-2xl font-semibold mb-6">Connection Suggestions</h2>
            <div className="space-y-6">
            {[
                {
                  name: 'Sarah Chen',
                  role: 'Engineering Manager at Google',
                  mutual: 12,
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Product Lead at Meta',
                  mutual: 8,
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
                },
                {
                  name: 'Emily Watson',
                  role: 'Tech Recruiter at Apple',
                  mutual: 15,
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                },
              ].map((person) => (
                <div key={person.name} 
                  className="flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'rgba(20, 20, 40, 0.5)' }}>
                  <img src={person.image} alt={person.name} className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-gray-400">{person.role}</p>
                    <p className="text-sm" style={{ color: theme.periwinkle }}>{person.mutual} mutual connections</p>
                  </div>
                  <button 
                    className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ 
                      background: `${theme.periwinkle}20`,
                      color: theme.periwinkle 
                    }}>
                    <UserPlus className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg" style={{ background: '#0f0f1a' }}>
            <h3 className="text-xl font-semibold mb-4">Networking Stats</h3>
            <div className="space-y-4">
              {[
                { icon: <UserPlus className="h-5 w-5" />, label: "New Connections", value: "24" },
                { icon: <MessageSquare className="h-5 w-5" />, label: "Messages Sent", value: "18" },
                { icon: <Briefcase className="h-5 w-5" />, label: "Job Applications", value: "12" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:bg-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg" style={{ background: `${theme.lilac}15`, color: theme.lilac }}>
                      {stat.icon}
                    </div>
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;