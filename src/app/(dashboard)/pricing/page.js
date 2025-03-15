"use client";
import React from 'react';
import { Check } from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
          style={{ 
            backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
          }}>
          Choose Your Plan
        </h1>
        <p className="text-gray-400">Get started with the perfect plan for your career goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Basic',
            price: 15,
            features: [
              'Basic layoff risk assessment',
              'Limited career recommendations',
              'Basic networking tools',
              'Email support',
            ],
          },
          {
            name: 'Pro',
            price: 29,
            features: [
              'Advanced risk analysis',
              'Personalized career roadmap',
              'Automated networking',
              'Priority support',
              'Resume optimization',
            ],
            popular: true,
          },
          {
            name: 'Enterprise',
            price: 49,
            features: [
              'Real-time risk monitoring',
              'AI career coaching',
              'Advanced networking automation',
              '24/7 priority support',
              'Custom analytics',
              'Team collaboration',
            ],
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-lg transition-all duration-300 relative ${
              plan.popular ? 'border border-[#8A85FF33] transform scale-105' : ''
            }`}
            style={{ background: '#0f0f1a' }}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-sm py-1 px-4 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)`,
                  }}>
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-3">
                  <div className="p-1 rounded-lg" style={{ background: `${theme.lilac}15`, color: theme.lilac }}>
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? 'text-white'
                  : 'bg-gray-800/50 hover:bg-gray-800 text-white'
              }`}
              style={plan.popular ? {
                background: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)`,
              } : {}}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
