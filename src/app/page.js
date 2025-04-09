"use client"
import React, { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { ArrowRight, Shield, Rocket, Brain, Target, ChevronDown, Play, MapPin, ThumbsUp, ThumbsDown, Menu, X, ExternalLink, Check, ArrowUpRight, Star, Globe, Users, MessageCircle } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, stagger } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { NewNavbar } from '@/components/Navbar';
import CareerHeroSection from '@/components/HeroSection';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { GridPattern } from "@/registry/magicui/grid-pattern";
import { cn } from '@/lib/utils';
import { kaushan_script } from './fonts';
import { DotPattern } from '@/components/magicui/dot-pattern';

// Container component for consistent spacing and max width
function Container({ children, className = "", maxWidth = "max-w-7xl" }) {
  return (
    <div className={`${maxWidth} mx-auto px-5 sm:px-6 lg:px-8 relative z-10 ${className}`}>
      {children}
    </div>
  );
}

// Button component with modern styling
function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  href, 
  disabled = false, 
  isLoading = false,
  ariaLabel,
  className = "",
  icon,
  iconPosition = "right"
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white"
  };
  
  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg"
  };

  const content = (
    <>
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          aria-hidden="true"
        />
      ) : (
        <span className="relative z-10 flex items-center">
          {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </span>
      )}
      {variant === "primary" && !isLoading && (
        <span className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
          <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-white to-white/40"></span>
        </span>
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: disabled || isLoading ? 1 : 1.02 },
    whileTap: { scale: disabled || isLoading ? 1 : 0.98 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  const componentClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className} group`;

  if (href && !disabled) {
    return (
      <motion.a 
        href={href}
        className={componentClass}
        {...motionProps}
        aria-label={ariaLabel}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={componentClass}
      {...motionProps}
      aria-label={ariaLabel}
    >
      {content}
    </motion.button>
  );
}

// Card component with hover effects
function Card({ children, className = "", delay = 0, hoverEffect = true }) {
  const motionProps = hoverEffect ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100, damping: 20 }}
      {...motionProps}
      className={`${className} bg-[#0a0a0a] border border-white/[0.05] rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-black/20 will-change-transform`}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation component
function TextReveal({ children, delay = 0, className = "", type = "fade" }) {
  const variants = {
    fade: {
      initial: { y: 15, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    },
    slide: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 }
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 }
    }
  };

  return (
    <motion.div
      initial={variants[type].initial}
      whileInView={variants[type].animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 80 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Background gradient blur component
function GradientBlur({ className, color = "#3B82F6", position = {}, opacity = 0.5 }) {
  return (
    <div 
      className={`absolute blur-[100px] rounded-full ${className}`} 
      style={{ 
        background: `radial-gradient(circle, ${color}33 0%, ${color}00 70%)`,
        opacity,
        ...position 
      }}
      aria-hidden="true"
    />
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <Card delay={index * 0.1} className="h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-800/10 p-3 rounded-xl w-fit mb-6">
          <Icon className="w-6 h-6 text-blue-400" aria-hidden="true" />
        </div>
        
        <h3 className="text-xl font-medium mb-3 text-white">{title}</h3>
        <p className="text-gray-400 text-base leading-relaxed flex-grow">{description}</p>
        
        <div className="mt-6">
          <motion.div
            className="inline-flex items-center text-blue-400 text-sm font-medium cursor-pointer group"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Learn more
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </Card>
  );
}

// Section heading component with modern styling
function SectionHeading({ subtitle, title, description, centered = true, className = "" }) {
  return (
    <TextReveal className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <span className="text-blue-400 text-sm uppercase tracking-wider mb-2 block font-medium">{subtitle}</span>
      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">{title}</h2>
      {description && (
        <p className="text-gray-400 max-w-2xl leading-relaxed mx-auto text-lg">
          {description}
        </p>
      )}
    </TextReveal>
  );
}

// Enhanced testimonial card component
function TestimonialCard({ name, role, quote, company, index = 0 }) {
  return (
    <Card delay={index * 0.1} className="h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6 text-blue-400" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 inline-block mr-1 fill-blue-400" />
          ))}
        </div>
        
        <div className="flex-grow">
          <p className="text-gray-300 mb-6 text-base leading-relaxed">&apos;{quote}&apos;</p>
        </div>
        
        <div className="pt-4 border-t border-white/5 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-900/30 flex items-center justify-center mr-3">
            <span className="text-blue-400 font-bold">{name.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-medium text-white">{name}</h4>
            <p className="text-gray-500 text-sm">{role}, <span className="text-blue-400">{company}</span></p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Video card component with modern design
function VideoCard({ title, duration, industry, thumbnail, index = 0 }) {
  return (
    <Card delay={index * 0.1}>
      <div className="relative aspect-video rounded-t-xl overflow-hidden group cursor-pointer bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10"></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div 
            className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-400 font-medium">
              {duration}
            </div>
            <div className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">
              {industry}
            </div>
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      </div>
    </Card>
  );
}

// Modern pricing card component
function PricingCard({ name, price, period, description, features, cta, popular = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`h-full flex flex-col ${popular ? 'relative z-10 lg:scale-105' : ''}`}
    >
      <div className={`bg-[#0a0a0a] border ${popular ? 'border-blue-500/30' : 'border-white/[0.05]'} rounded-xl overflow-hidden flex-1 flex flex-col ${popular ? 'shadow-lg shadow-blue-500/5' : ''}`}>
        {popular && (
          <div className="bg-blue-500 text-center py-1 text-xs font-medium text-white">
            MOST POPULAR
          </div>
        )}
        
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">{price}</span>
            <span className="text-gray-400 text-sm"> {period}</span>
          </div>
          
          <p className="text-gray-400 text-base mb-6">{description}</p>
          
          <ul className="space-y-3 mb-8 flex-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-base">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            variant={popular ? "primary" : "secondary"}
            size="md"
            href="#"
            className="w-full justify-center"
          >
            {cta}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Team member card with modern design
function TeamMemberCard({ name, role, bio, image, index = 0 }) {
  return (
    <Card delay={index * 0.1} className="h-full">
      <div className="p-1">
        <div className="h-56 bg-gradient-to-br from-blue-500/10 to-blue-900/5 rounded-lg relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 bg-gradient-to-br from-[#0f0f18] to-[#161625]">
            {/* This would be replaced with actual image */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-blue-600/20"></div>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
          <p className="text-blue-400 text-sm mb-4">{role}</p>
          <p className="text-gray-400 text-base mb-6 flex-grow">{bio}</p>
          
          <div className="flex space-x-3">
            {['LinkedIn', 'Twitter', 'Email'].map((platform) => (
              <a 
                key={platform} 
                href="#" 
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                aria-label={`${name}'s ${platform}`}
              >
                {platform === 'LinkedIn' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.7,3H4.3C3.6,3,3,3.6,3,4.3v15.4C3,20.4,3.6,21,4.3,21h15.4c0.7,0,1.3-0.6,1.3-1.3V4.3C21,3.6,20.4,3,19.7,3z M8.3,18.4H5.7V9.2h2.6V18.4z M7,8.1c-0.8,0-1.5-0.7-1.5-1.5C5.5,5.7,6.2,5,7,5s1.5,0.7,1.5,1.5C8.5,7.4,7.8,8.1,7,8.1z M18.3,18.4h-2.6v-4.1c0-1,0-2.2-1.3-2.2c-1.3,0-1.5,1-1.5,2.1v4.2h-2.6V9.2h2.5v1.1h0c0.4-0.7,1.2-1.3,2.5-1.3c2.7,0,3.2,1.8,3.2,4.1V18.4z" />
                  </svg>
                )}
                {platform === 'Twitter' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22,5.8a8.6,8.6,0,0,1-2.4.7,4.1,4.1,0,0,0,1.8-2.3,8.1,8.1,0,0,1-2.6,1A4.1,4.1,0,0,0,11.8,8,8,8,0,0,1,5,4.3a4.1,4.1,0,0,0,1.3,5.5,4,4,0,0,1-1.9-.5V9.4a4.1,4.1,0,0,0,3.3,4,4.1,4.1,0,0,1-1.9.1,4.1,4.1,0,0,0,3.9,2.8A8.3,8.3,0,0,1,3,18a11.1,11.1,0,0,0,6.5,1.9,11.7,11.7,0,0,0,11.8-12c0-.2,0-.4,0-.5A8.4,8.4,0,0,0,23,5.8Z" />
                  </svg>
                )}
                {platform === 'Email' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}



// Scroll progress indicator with modern style
function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-blue-500 origin-left z-50"
      style={{ scaleX, opacity: 0.8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ delay: 0.5 }}
    />
  );
}
// Main component
function Home() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scaleProgress, [0, 0.2], [1, 0.98]);

  const { ref: logoRef, inView: logoInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  
  // Features section data
  const features = [
    { 
      icon: Shield, 
      title: "Risk Detection", 
      desc: "Identify potential layoffs and industry downturns before they affect your career trajectory." 
    },
    { 
      icon: Brain, 
      title: "Skill Gap Analysis", 
      desc: "Discover exactly what to learn to remain relevant in your evolving industry and marketplace." 
    },
    { 
      icon: Target, 
      title: "Opportunity Mapping", 
      desc: "Visualize career paths with the highest growth potential specifically tailored to your unique profile." 
    }
  ];
  
  // Methodology section data
  const methodologies = [
    { 
      icon: Globe,
      title: "Data-Driven Insights", 
      desc: "Our algorithms analyze your skillset against market data to identify your optimal positioning",
      features: ["Industry trend analysis", "Skill demand forecasting", "Opportunity mapping"]
    },
    { 
      icon: Users,
      title: "Strategic Planning", 
      desc: "Transform insights into actionable career strategies with clear milestones and timeframes",
      features: ["Personalized career paths", "Risk mitigation planning", "Growth opportunity targeting"] 
    },
    { 
      icon: MessageCircle,
      title: "Expert Execution", 
      desc: "Implement your strategy with tools and mentorship that ensure successful outcomes",
      features: ["Skill acquisition guidance", "Network expansion", "Position optimization"]
    }
  ];
  
  // Company logos
  const companyLogos = [
    { name: 'Google', logo: 'google-logo.svg' },
    { name: 'Amazon', logo: 'amazon-logo.svg' },
    { name: 'Microsoft', logo: 'microsoft-logo.svg' },
    { name: 'Apple', logo: 'apple-logo.svg' },
    { name: 'Netflix', logo: 'netflix-logo.svg' },
    { name: 'Spotify', logo: 'spotify-logo.svg' }
  ];
  
  // Video section data
  const videos = [
    { 
      title: "From Layoff to Leadership",
      duration: "12:45",
      industry: "Technology",
      thumbnail: "https://startup-template-sage.vercel.app/hero-dark.png",
      videoSrc: "https://www.youtube.com/embed/your-video-id",
      description: "See how Sarah transformed an unexpected layoff into a strategic career pivot",
    },
    { 
      title: "Career Pivot After Recession",
      duration: "18:22", 
      industry: "Finance",
      thumbnail: "https://startup-template-sage.vercel.app/hero-dark.png",
      videoSrc: "https://www.youtube.com/embed/your-video-id-2",
      description: "Learn how Michael repositioned his skills for a high-growth sector",
    },
    { 
      title: "Building Resilience in Uncertainty",
      duration: "15:36",
      industry: "Healthcare",
      thumbnail: "https://startup-template-sage.vercel.app/hero-dark.png",
      videoSrc: "https://www.youtube.com/embed/your-video-id-3",
      description: "Discover Jessica's framework for maintaining career momentum in volatile markets",
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      {/* Accessibility skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-500 text-white px-4 py-2 z-50 focus:outline-none rounded-md"
      >
        Skip to main content
      </a>
      
      {/* Performance-optimized scroll indicator */}
      <ScrollProgressIndicator />
      
      {/* Subtle Background Noise for Texture */}
      <div className="fixed inset-0 opacity-[0.03]  pointer-events-none z-[1]" aria-hidden="true"></div>
      {/* /noise.png */}
      {/* Enhanced Navigation */}
      <div className="fixed top-5 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <NewNavbar />
        </div>
      </div>

      <main id="main-content">

          <CareerHeroSection />

          {/* Features Section */}
          {/* <section id="features" className="py-24 relative ">
            <Container>
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="lg:w-1/2"
                >
                  <div className="lg:max-w-md">
                    <span className="text-blue-500 text-sm uppercase tracking-wider mb-3 block font-medium">Data-Driven Career Navigation</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Tools that transform volatility into advantage</h2>
                    <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                      Our platform&apos;s intelligent systems analyze market patterns, industry shifts, and your unique skillset to guide you toward optimal career moves.
                    </p>
                    
                    <div className="space-y-8">
                      {features.map((feature, index) => (
                        <FeatureCard 
                          key={feature.title}
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.desc}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="lg:w-1/2"
                >
                  <Card hoverEffect={false}>
                    <div className="border-b border-white/5 flex px-4 py-3 gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" aria-hidden="true"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" aria-hidden="true"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" aria-hidden="true"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-6 mb-6">
                        <div className="w-1/2">
                          <div className="h-4 w-32 bg-blue-500/20 rounded-full mb-2" aria-hidden="true"></div>
                          <div className="h-32 bg-[#0f0f18] rounded-lg border border-white/5" aria-hidden="true"></div>
                        </div>
                        <div className="w-1/2">
                          <div className="h-4 w-28 bg-blue-500/20 rounded-full mb-2" aria-hidden="true"></div>
                          <div className="h-32 bg-[#0f0f18] rounded-lg border border-white/5" aria-hidden="true"></div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="h-4 w-40 bg-blue-500/20 rounded-full mb-2" aria-hidden="true"></div>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-[#0f0f18] rounded-lg border border-white/5" aria-hidden="true"></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="h-4 w-36 bg-blue-500/20 rounded-full mb-2" aria-hidden="true"></div>
                        <div className="h-28 bg-[#0f0f18] rounded-lg border border-white/5" aria-hidden="true"></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </Container>
          </section> */}

        {/* Methodology Section - outside the wrapper */}
        {/* <section className="py-24 relative">
          <GradientBlur 
            className="w-[600px] h-[600px]" 
            color="#4285F4" 
            position={{ top: '20%', right: '-10%' }} 
            opacity={0.15} 
          />
          
          <Container>
            <SectionHeading
              subtitle="Proven Methodology"
              title="The certcy approach"
              description="Our uniquely effective process is designed to transform career uncertainty into strategic advantage."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {methodologies.map((method, index) => (
                <Card key={index} delay={index * 0.1} className="h-full">
                  <div className="p-6 h-full flex flex-col">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/10 p-3 rounded-xl w-fit mb-6">
                      <method.icon className="w-6 h-6 text-blue-400" aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white">{method.title}</h3>
                    <p className="text-gray-400 mb-5 text-base leading-relaxed">{method.desc}</p>
                    
                    <ul className="space-y-3 mt-auto">
                      {method.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-base text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section> */}

        {/* Video Section - Updated */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <DotPattern
              glow={true}
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40"
              )}
            />
          </div>

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                <span className={`text-blue-500 ${kaushan_script.className}`}>Learn&nbsp;</span> from the experienced
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how professionals like you navigated career challenges with certcy&apos;s strategic guidance.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="group relative">
                    <HeroVideoDialog
                      thumbnailSrc={video.thumbnail}
                      videoSrc={video.videoSrc}
                      thumbnailAlt={video.title}
                      animationStyle="from-bottom"
                      className="w-full aspect-video mb-6"
                    />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                          {video.duration}
                        </span>
                        <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm">
                          {video.industry}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        {/* <section className="py-24 relative">
          <GradientBlur 
            className="w-[700px] h-[700px]" 
            color="#4285F4" 
            position={{ bottom: '10%', left: '-10%' }} 
            opacity={0.15} 
          />
          
          <Container>
            <SectionHeading
              subtitle="Testimonials"
              title="Client success stories"
              description="Read how professionals at various stages of their careers have achieved breakthrough results with certcy."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial.name}
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  company={testimonial.company}
                  index={index}
                />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <motion.a 
                href="#" 
                className="inline-flex items-center text-base text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md px-2 py-1 font-medium"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Read more client stories <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </motion.a>
            </div>
          </Container>
        </section> */}

        {/* Pricing Section */}
        {/* <section className="py-24 relative">
          <Container>
            <SectionHeading
              subtitle="Investment"
              title="Career plans for every stage"
              description="Select the plan that aligns with your career goals and timeline, with flexible options to suit your needs."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <PricingCard 
                  key={plan.name}
                  name={plan.name}
                  price={plan.price}
                  period={plan.period}
                  description={plan.description}
                  features={plan.features}
                  cta={plan.cta}
                  popular={plan.popular}
                  index={index}
                />
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-[#0a0a0a] border border-white/5 rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Enterprise solutions</h3>
                  <p className="text-gray-400 text-base">Customized career resilience programs for organizations supporting multiple team members.</p>
                </div>
                <Button 
                  variant="secondary"
                  href="#" 
                  ariaLabel="Contact our team about enterprise solutions"
                >
                  Contact our team
                </Button>
              </div>
            </div>
          </Container>
        </section> */}

        {/* Call to Action Section */}
        <section className="py-24 relative" aria-labelledby="cta-heading">
          <GradientBlur 
            className="w-[700px] h-[700px]" 
            color="#4285F4" 
            position={{ bottom: '10%', right: '10%' }} 
            opacity={0.15} 
          />
          
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 md:p-12 shadow-xl shadow-blue-900/5"
            >
              <div className="text-center mb-8">
                <h2 
                  id="cta-heading" 
                  className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight"
                >
                  Ready to secure your career future?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  Join thousands of professionals who&apos;ve transformed uncertainty into opportunity with certcy.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                <Button 
                  ariaLabel="Start free trial"
                  className="justify-center"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Free Trial
                </Button>
                
                <Button 
                  variant="secondary"
                  href="#schedule-demo"
                  ariaLabel="Schedule demo"
                  className="justify-center"
                  size="lg"
                >
                  Schedule Demo
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>No credit card required. 14-day free trial on all Professional plans.</p>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-[#050505] border-t border-white/5 relative z-10" role="contentinfo">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <a 
                href="#home" 
                className="inline-block mb-6 text-2xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
                aria-label="certcy - return to homepage"
              >
                <span className="text-blue-400">cert</span>
                <span className="text-white">cy</span>
              </a>
              <p className="text-gray-400 text-base mb-6 leading-relaxed">
                AI-powered career navigation for professionals who want to transform uncertainty into strategic advantage.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'instagram', 'github'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-400/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    aria-label={`Follow certcy on ${social}`}
                  >
                    {social === 'twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22,5.8a8.6,8.6,0,0,1-2.4.7,4.1,4.1,0,0,0,1.8-2.3,8.1,8.1,0,0,1-2.6,1A4.1,4.1,0,0,0,11.8,8,8,8,0,0,1,5,4.3a4.1,4.1,0,0,0,1.3,5.5,4,4,0,0,1-1.9-.5V9.4a4.1,4.1,0,0,0,3.3,4,4.1,4.1,0,0,1-1.9.1,4.1,4.1,0,0,0,3.9,2.8A8.3,8.3,0,0,1,3,18a11.1,11.1,0,0,0,6.5,1.9,11.7,11.7,0,0,0,11.8-12c0-.2,0-.4,0-.5A8.4,8.4,0,0,0,23,5.8Z" />
                      </svg>
                    )}
                    {social === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.7,3H4.3C3.6,3,3,3.6,3,4.3v15.4C3,20.4,3.6,21,4.3,21h15.4c0.7,0,1.3-0.6,1.3-1.3V4.3C21,3.6,20.4,3,19.7,3z M8.3,18.4H5.7V9.2h2.6V18.4z M7,8.1c-0.8,0-1.5-0.7-1.5-1.5C5.5,5.7,6.2,5,7,5s1.5,0.7,1.5,1.5C8.5,7.4,7.8,8.1,7,8.1z M18.3,18.4h-2.6v-4.1c0-1,0-2.2-1.3-2.2c-1.3,0-1.5,1-1.5,2.1v4.2h-2.6V9.2h2.5v1.1h0c0.4-0.7,1.2-1.3,2.5-1.3c2.7,0,3.2,1.8,3.2,4.1V18.4z" />
                      </svg>
                    )}
                    {social === 'instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12,6.8a5.2,5.2,0,1,0,5.2,5.2A5.2,5.2,0,0,0,12,6.8Zm0,8.6a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,12,15.4Zm6.6-8.8a1.2,1.2,0,1,1-1.2-1.2A1.2,1.2,0,0,1,18.6,6.6ZM22.4,7.8a6,6,0,0,0-1.6-4.2A6,6,0,0,0,16.6,2c-1.6-.1-6.6-.1-8.2,0A6,6,0,0,0,4.2,3.6,6,6,0,0,0,2.6,7.8c-.1,1.6-.1,6.6,0,8.2a6,6,0,0,0,1.6,4.2A6,6,0,0,0,8.4,22c1.6.1,6.6.1,8.2,0a6,6,0,0,0,4.2-1.6,6,6,0,0,0,1.6-4.2C22.5,14.4,22.5,9.4,22.4,7.8ZM20,17.8a3.4,3.4,0,0,1-1.9,1.9c-1.3.5-4.5.4-5.9.4s-4.6.1-5.9-.4A3.4,3.4,0,0,1,4.4,18c-.5-1.3-.4-4.5-.4-5.9s-.1-4.6.4-5.9A3.4,3.4,0,0,1,6.2,4.4c1.3-.5,4.5-.4,5.9-.4s4.6-.1,5.9.4a3.4,3.4,0,0,1,1.9,1.9c.5,1.3.4,4.5.4,5.9S20.5,16.5,20,17.8Z" />
                      </svg>
                    )}
                    {social === 'github' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
            
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Case Studies", "Testimonials", "API"]
              },
              {
                title: "Company",
                links: ["About", "Team", "Careers", "Press", "Contact"]
              },
              {
                title: "Resources",
                links: ["Blog", "Newsletter", "Events", "Help Center", "Tutorials"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-blue-400 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center"></div>
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} certcy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-400 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              ></a>
                Terms
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-400 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-400 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md"
              >
                Security
              </a>
            </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
