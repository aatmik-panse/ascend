"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Brain, TrendingUp, Network, Shield, ArrowRight, Trophy, Star, Target, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { checkBackendHealth } from '@/utils/api';
import Footer from '@/components/Footer';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

// Define shimmer animation keyframes
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [careerScore, setCareerScore] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [healthStatus, setHealthStatus] = useState(null);
  const featuresRef = useRef(null);
  const achievementsRef = useRef(null);
  const ctaRef = useRef(null);

  // Effect to check health status
  useEffect(() => {
    const checkHealth = async () => {
      const status = await checkBackendHealth();
      setHealthStatus(status);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Effect to add shimmer animation styles to the document
  useEffect(() => {
    // Only add the styles on the client side
    const styleSheet = document.createElement("style");
    styleSheet.textContent = shimmerKeyframes;
    document.head.appendChild(styleSheet);

    // Clean up when component unmounts
    return () => {
      if (styleSheet && document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);
      
      if (progress > 60 && !achievementUnlocked) {
        setAchievementUnlocked(true);
      }

      [featuresRef, achievementsRef, ctaRef].forEach(ref => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          setIsVisible(prev => ({ ...prev, [ref.current.id]: isInView }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [achievementUnlocked]);

  // Effect for career score animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCareerScore(prev => (prev < 850 ? prev + 1 : prev));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(138,133,255,0.1)_0%,transparent_70%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(200,162,255,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Health Status */}
      {/* {healthStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-300 ${
            healthStatus.status === 'ok' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                healthStatus.status === 'ok' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              {healthStatus.status === 'ok' ? 'Systems Operational' : 'Service Disruption'}
            </div>
          </div>
        </div>
      )} */}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-800/50">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-periwinkle/20 to-lilac/20" />
            <h1 className="text-8xl md:text-9xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-periwinkle to-lilac bg-clip-text text-transparent">
                certcy
              </span>
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            Level up your career with AI-powered growth strategies
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
            <StatsCard 
              value={careerScore}
              label="Career Score"
              icon={<TrendingUp className="w-6 h-6" />}
              color={theme.periwinkle}
            />
            <StatsCard 
              value="4.9"
              label="User Rating"
              icon={<Star className="w-6 h-6 text-yellow-400" />}
              color={theme.lilac}
            />
          </div>

          <Link 
            href="/layoff_risk"
            className="group inline-flex items-center px-12 py-5 text-xl font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-periwinkle/20 hover:scale-105"
            style={{ 
              background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`,
            }}
          >
            Start Your Journey 
            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button 
            onClick={scrollToFeatures} 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 p-4 hover:opacity-70 transition-all animate-bounce"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="py-32 relative">
        <div className={`max-w-7xl mx-auto px-4 transition-all duration-1000 ${
          isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-5xl font-bold text-center mb-6">Level Up Your Career</h2>
          <p className="text-gray-400 text-center text-xl max-w-2xl mx-auto mb-20">
            Unlock powerful tools and strategies to navigate your professional journey
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImprovedFeatureCard 
              icon={<Shield className="w-12 h-12" />}
              title="AI Risk Shield"
              level="Level 1"
              description="Unlock career protection with AI-powered risk assessment"
              progress={85}
              color={theme.periwinkle}
            />
            <ImprovedFeatureCard 
              icon={<Target className="w-12 h-12" />}
              title="Strategic Pivots"
              level="Level 2"
              description="Master the art of strategic career transitions"
              progress={65}
              color={theme.lilac}
            />
            <ImprovedFeatureCard 
              icon={<Network className="w-12 h-12" />}
              title="Network Boost"
              level="Level 3"
              description="Expand your professional network automatically"
              progress={45}
              color={theme.periwinkle}
            />
            <ImprovedFeatureCard 
              icon={<Brain className="w-12 h-12" />}
              title="Skill Tree"
              level="Level 4"
              description="Unlock new abilities and career paths"
              progress={25}
              color={theme.lilac}
            />
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div id="achievements" ref={achievementsRef} className="py-32 relative">
        <div className={`max-w-6xl mx-auto px-4 text-center transition-all duration-1000 ${
          isVisible['achievements'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold mb-6">Career Achievements</h2>
          <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto mb-20">
            Track your progress and celebrate your professional milestones
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ImprovedAchievementCard
              icon={<Trophy className="w-8 h-8" />}
              title="Risk Navigator"
              description="Successfully predicted and avoided career risks"
              points="500 XP"
              color={theme.periwinkle}
              unlocked={true}
            />
            <ImprovedAchievementCard
              icon={<Star className="w-8 h-8" />}
              title="Network Master"
              description="Built a powerful professional network"
              points="750 XP"
              color={theme.lilac}
              unlocked={achievementUnlocked}
            />
            <ImprovedAchievementCard
              icon={<Zap className="w-8 h-8" />}
              title="Skill Champion"
              description="Mastered 5 new high-demand skills"
              points="1000 XP"
              color={theme.periwinkle}
              unlocked={false}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" ref={ctaRef} className="py-32 relative">
        <div className={`max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${
          isVisible['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="p-16 rounded-3xl relative overflow-hidden backdrop-blur-xl border border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-b from-periwinkle/5 to-lilac/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to Level Up?</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of professionals who are turning their careers into an exciting journey of growth and achievement.
              </p>
              <Link
                href="/layoff_risk"
                className="group inline-flex items-center px-12 py-5 text-lg font-medium transition-all duration-300 hover:scale-105 rounded-full bg-white text-gray-900"
              >
                Begin Your Adventure 
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StatsCard({ value, label, icon, color }) {
  return (
    <div 
      className="stats-card p-8 rounded-2xl backdrop-blur-xl border border-gray-800/50 relative group hover:border-gray-700/50 transition-all duration-300"
      style={{ background: 'rgba(15, 15, 26, 0.5)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ color }}>{icon}</div>
          <div className="text-4xl font-bold" style={{ color }}>{value}</div>
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function ImprovedFeatureCard({ icon, title, level, description, progress, color }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/0 to-gray-800/0 group-hover:from-gray-800/20 group-hover:to-gray-800/0 rounded-2xl transition-all duration-500" />
      <div className="p-8 rounded-2xl backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group-hover:border-gray-700/50 transition-all duration-300"
        style={{ background: 'rgba(15, 15, 26, 0.5)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <div className="p-4 rounded-2xl" style={{ background: `${color}15` }}>
              <div style={{ color }}>{icon}</div>
            </div>
            <span className="text-xs font-medium tracking-wide px-4 py-1.5 rounded-full" 
              style={{ color, background: `${color}15` }}>{level}</span>
          </div>
          <h3 className="text-xl font-medium mb-3">{title}</h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
          <div className="w-full h-1 bg-gray-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(to right, ${color}, ${color}99)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImprovedAchievementCard({ icon, title, description, points, color, unlocked }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-b from-gray-800/0 to-gray-800/0 
        ${unlocked ? 'group-hover:from-gray-800/20' : ''} 
        group-hover:to-gray-800/0 rounded-2xl transition-all duration-500`} 
      />
      <div className={`p-8 rounded-2xl backdrop-blur-xl border relative overflow-hidden transition-all duration-300
        ${unlocked ? 'border-gray-800/50 group-hover:border-gray-700/50' : 'border-gray-800/30'}`}
        style={{ 
          background: 'rgba(15, 15, 26, 0.5)',
          opacity: unlocked ? 1 : 0.7
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl transition-all duration-300 ${unlocked ? '' : 'grayscale'}`} 
              style={{ background: unlocked ? `${color}15` : 'rgba(75, 75, 75, 0.15)' }}>
              <div style={{ color: unlocked ? color : 'gray' }}>
                {icon}
              </div>
            </div>
            <div className={`text-xs font-medium py-2 px-4 rounded-full transition-all duration-300
              ${unlocked ? '' : 'bg-gray-800/50'}`} 
              style={{ 
                background: unlocked ? `${color}15` : '',
                color: unlocked ? color : 'gray' 
              }}>
              {unlocked ? 'Unlocked' : 'Locked'}
            </div>
          </div>
          <h3 className="text-xl font-medium mb-3 transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full transition-all duration-300`} 
              style={{ background: unlocked ? `${color}15` : 'rgba(75, 75, 75, 0.15)' }}>
              <Trophy className="w-4 h-4" style={{ color: unlocked ? color : 'gray' }} />
            </div>
            <span className="text-sm font-medium" 
              style={{ color: unlocked ? color : 'gray' }}>
              {points}
            </span>
          </div>
        </div>
        
        {/* Achievement unlock animation */}
        {unlocked && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
              style={{ 
                '--tw-gradient-from': 'transparent',
                '--tw-gradient-via': `${color}10`,
                '--tw-gradient-to': 'transparent',
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;