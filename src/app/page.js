"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Brain, TrendingUp, Network, Shield, ArrowRight, Trophy, Star, Target, Zap, ChevronDown } from 'lucide-react';

// Theme colors based on provided values
const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [careerScore, setCareerScore] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const featuresRef = useRef(null);
  const achievementsRef = useRef(null);
  const ctaRef = useRef(null);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);
      
      if (progress > 60 && !achievementUnlocked) {
        setAchievementUnlocked(true);
      }

      // Check if sections are visible
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

  // Career score animation
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full" 
          style={{ 
            width: `${scrollProgress}%`,
            background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center" 
        style={{ 
          background: `linear-gradient(to bottom, #0f0f1a 0%, #1a1a2e 100%)` 
        }}>
        <div className="container mx-auto px-4 py-32 text-center z-10">
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
              }}>
              ascend.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Level up your career with AI-powered growth strategies
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mb-16">
            <div className="stats-card p-8 text-center rounded-2xl"
              style={{ 
                background: '#0f0f1a',
              }}>
              <div className="text-4xl font-bold mb-2" style={{ color: theme.periwinkle }}>{careerScore}</div>
              <div className="text-sm text-gray-400">Career Score</div>
            </div>
            <div className="stats-card p-8 text-center rounded-2xl"
              style={{ 
                background: '#0f0f1a',
              }}>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Star className="inline-block text-yellow-400" />
                <span className="ml-2">4.9</span>
              </div>
              <div className="text-sm text-gray-400">User Rating</div>
            </div>
          </div>
          <a 
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/layoff_risk`}
            className="inline-flex items-center px-10 py-4 text-xl font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]"
            style={{ 
              background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`,
            }}
          >
            Start Your Journey <ArrowRight className="ml-2" />
          </a>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <button onClick={scrollToFeatures} className="p-3 hover:opacity-70 transition-all">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="py-24 bg-gray-950">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center mb-6">Level Up Your Career</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Unlock powerful tools and strategies to navigate your professional journey</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="w-12 h-12" />}
              title="AI Risk Shield"
              level="Level 1"
              description="Unlock career protection with AI-powered risk assessment"
              progress={85}
              color={theme.periwinkle}
            />
            <FeatureCard 
              icon={<Target className="w-12 h-12" />}
              title="Strategic Pivots"
              level="Level 2"
              description="Master the art of strategic career transitions"
              progress={65}
              color={theme.lilac}
            />
            <FeatureCard 
              icon={<Network className="w-12 h-12" />}
              title="Network Boost"
              level="Level 3"
              description="Expand your professional network automatically"
              progress={45}
              color={theme.periwinkle}
            />
            <FeatureCard 
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
      <div id="achievements" ref={achievementsRef} className="py-24" style={{ 
        backgroundImage: `linear-gradient(to bottom, #0f0f1a, #1a1a2e)` 
      }}>
        <div className={`container mx-auto px-4 text-center transition-all duration-1000 ${isVisible['achievements'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold mb-6">Career Achievements</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Track your progress and celebrate your professional milestones</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AchievementCard
              icon={<Trophy className="w-8 h-8" />}
              title="Risk Navigator"
              description="Successfully predicted and avoided career risks"
              points="500 XP"
              color={theme.periwinkle}
              unlocked={true}
            />
            <AchievementCard
              icon={<Star className="w-8 h-8" />}
              title="Network Master"
              description="Built a powerful professional network"
              points="750 XP"
              color={theme.lilac}
              unlocked={achievementUnlocked}
            />
            <AchievementCard
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
      <div id="cta" ref={ctaRef} className="py-20" style={{ background: '#0f0f1a' }}>
        <div className={`container mx-auto px-4 text-center transition-all duration-700 ${isVisible['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-3xl mx-auto p-12 relative">
            <h2 className="text-3xl font-bold mb-6">Ready to Level Up?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are turning their careers into an exciting journey of growth and achievement.
            </p>
            <a 
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/layoff_risk`}
              className="inline-flex items-center px-10 py-4 text-base font-medium transition-all duration-300 hover:opacity-90 rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`,
              }}
            >
              Begin Your Adventure <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* Add this CSS for the stars background */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, level, description, progress, color }) {
  return (
    <div className="p-8 group hover:bg-gray-900 transition-all duration-300 relative rounded-2xl"
      style={{ 
        background: '#0f0f1a',
      }}>
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full rounded-tl-2xl rounded-bl-2xl transition-all duration-300" 
        style={{ background: color }}></div>
      <div className="flex justify-between items-center mb-5">
        <div className="p-4 rounded-2xl" style={{ background: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <span className="text-xs font-medium tracking-wide px-3 py-1 rounded-full" 
          style={{ color, background: `${color}15` }}>{level}</span>
      </div>
      <h3 className="text-lg font-medium mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-gray-400 mb-6 text-sm">{description}</p>
      <div className="w-full h-[3px] bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ width: `${progress}%`, background: color }}
        ></div>
      </div>
    </div>
  );
}

function AchievementCard({ icon, title, description, points, color, unlocked }) {
  return (
    <div className={`p-8 group transition-all duration-300 relative rounded-2xl ${unlocked ? 'hover:bg-gray-900' : 'opacity-70'}`}
      style={{ 
        background: '#0f0f1a',
      }}>
      {unlocked && (
        <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full rounded-tl-2xl rounded-bl-2xl transition-all duration-300" 
          style={{ background: color }}></div>
      )}
      <div className="flex items-center justify-between mb-5">
        <div className={`p-4 rounded-2xl ${unlocked ? '' : 'grayscale'}`} 
          style={{ background: unlocked ? `${color}15` : 'rgba(75, 75, 75, 0.15)' }}>
          <div style={{ color: unlocked ? color : 'gray' }}>
            {icon}
          </div>
        </div>
        <div className={`text-xs font-medium py-1 px-4 rounded-full ${unlocked ? '' : 'bg-gray-800'}`} 
          style={{ background: unlocked ? `${color}15` : '', color: unlocked ? color : 'gray' }}>
          {unlocked ? 'Unlocked' : 'Locked'}
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-gray-400 mb-5 text-sm">{description}</p>
      <div className="text-sm font-medium flex items-center gap-2">
        <div className="p-1 rounded-full" style={{ background: unlocked ? `${color}15` : 'rgba(75, 75, 75, 0.15)' }}>
          <Trophy className="w-3 h-3" style={{ color: unlocked ? color : 'gray' }} />
        </div>
        <span style={{ color: unlocked ? color : 'gray' }}>{points}</span>
      </div>
    </div>
  );
}

export default Home;