"use client"
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Shield, Rocket, Brain, Target, ChevronDown, Play, MapPin, ThumbsUp, ThumbsDown, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function HoverCard({ children, className }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${className} transition-shadow duration-300 hover:shadow-lg hover:shadow-[#8A85FF]/10`}
    >
      {children}
    </motion.div>
  );
}

function TextReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 80 }}
    >
      {children}
    </motion.div>
  );
}

function BackgroundText() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const maxScrollProgress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const current = maxScrollProgress.get();
      if (latest > current) {
        maxScrollProgress.set(latest);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, maxScrollProgress]);

  // Using shorter, more impactful text
  const words = `Each career navigates the sea of possibility, carrying ambitions and dreams as its cargo.
  
The voyage encounters storms — layoffs, industry shifts, economic uncertainty. Most careers falter, but not those guided with purpose.

In turbulent times, strategic pivots create stability. When recession strikes, reinvention becomes essential. New skills strengthen resilience against market waves.

After weathering the storm, the path forward becomes clearer. Career transformation creates momentum toward greater heights.

What once seemed distant becomes reality through deliberate navigation.
certcy doesn't just help you endure — it positions you to thrive.`.split(' ');

  return (
    <div ref={containerRef} className="relative min-h-[100vh] py-20">
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {words.map((word, i) => {
            const progress = (i / words.length) * 0.75;
            const start = Math.max(0, progress - 0.05);
            
            const opacity = useTransform(
              maxScrollProgress,
              [start, progress, 0.75, 1],
              [0.1, 1, 1, 1]
            );
            
            const scale = useTransform(
              maxScrollProgress,
              [start, progress, 0.75, 1],
              [0.9, 1, 1, 1]
            );

            return (
              <motion.span
                key={i}
                style={{ opacity, scale }}
                className="inline-block mx-1 text-xl md:text-2xl font-normal text-[#8A85FF]/90"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GradientBlur({ className }) {
  return (
    <div className={`absolute blur-[80px] rounded-full opacity-50 ${className}`} />
  );
}

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#080810] text-white relative">
      {/* Subtle Background Noise for Texture */}
      <div className="fixed inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none z-[1]"></div>
      
      {/* Subtle Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <GradientBlur className="w-[900px] h-[600px] bg-[#6B66CC]/30 -top-[100px] -left-[300px]" />
        <GradientBlur className="w-[800px] h-[800px] bg-[#8E77DA]/20 bottom-[-400px] right-[-200px]" />
        <GradientBlur className="w-[600px] h-[600px] bg-[#3626A7]/20 top-[40%] left-[60%]" />
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#080810]/80 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-light tracking-tight">
                <span className="text-[#8A85FF] font-medium">cert</span>
                <span className="text-white">cy</span>
              </a>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {[
                { name: 'Features', href: '#features' },
                { name: 'About', href: '#about' },
                { name: 'Roadmap', href: '#roadmap' },
                { name: 'Team', href: '#team' }
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-[15px] text-gray-300 hover:text-white transition-colors py-1 border-b border-transparent hover:border-[#8A85FF]/30"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <a href="#" className="hidden md:block text-[15px] text-[#8A85FF] hover:text-white transition-colors">
                Log in
              </a>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#"
                className="bg-[#8A85FF] text-white font-medium py-2 px-4 rounded-md text-[15px] flex items-center"
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </motion.a>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0c14]/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {[
                { name: 'Features', href: '#features' },
                { name: 'About', href: '#about' },
                { name: 'Roadmap', href: '#roadmap' },
                { name: 'Team', href: '#team' },
                { name: 'Log in', href: '#' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-300 hover:text-white border-b border-white/[0.03]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[#0b0b15]/80 via-transparent to-transparent"
          style={{ opacity }}
        />
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 relative z-10"
          style={{ scale }}
        >
          <motion.div 
            ref={logoRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={logoInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-16 mb-20 text-center"
          >
            <div className="mx-auto flex flex-col items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8A85FF]/10 to-[#8E77DA]/10 flex items-center justify-center mb-8">
                <h1 className="text-3xl font-normal bg-gradient-to-r from-[#8A85FF] to-[#8E77DA] inline-block text-transparent bg-clip-text relative z-10">
                  <span className="font-medium">cert</span>cy
                </h1>
              </div>
              
              <TextReveal delay={0.3}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 leading-tight">
                  For careers that <span className="text-[#8A85FF]">won't settle</span>
                  <br /> for average outcomes
                </h2>
              </TextReveal>

              <TextReveal delay={0.5}>
                <p className="text-lg text-gray-400 mb-12 max-w-2xl">
                  Navigate your professional journey with AI-powered insights and strategic guidance that turns market volatility into opportunity.
                </p>
              </TextReveal>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#"
                  className="bg-[#8A85FF] text-white font-medium py-3 px-8 rounded-md inline-flex items-center"
                >
                  Begin Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </motion.a>
                
                <a href="#about" className="text-gray-400 hover:text-white transition-colors flex items-center py-3 px-8">
                  Learn more <ChevronDown className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Client Logos */}
          <div className="mt-20 border-t border-white/[0.05] pt-12">
            <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">Trusted by professionals from</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
              {['Google', 'Microsoft', 'Amazon', 'IBM', 'Apple'].map((company) => (
                <div key={company} className="text-gray-400 text-lg font-light">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="lg:max-w-md">
                <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Data-Driven Career Navigation</h4>
                <h2 className="text-3xl md:text-4xl font-light mb-6">Tools that transform volatility into advantage</h2>
                <p className="text-gray-400 mb-8">
                  Our platform's intelligent systems analyze market patterns, industry shifts, and your unique skillset to guide you toward optimal career moves.
                </p>
                
                <div className="space-y-6">
                  {[
                    { icon: Shield, title: "Risk Detection", desc: "Identify potential layoffs and industry downturns before they affect your career" },
                    { icon: Brain, title: "Skill Gap Analysis", desc: "Discover exactly what to learn to remain relevant in your evolving industry" },
                    { icon: Target, title: "Opportunity Mapping", desc: "Visualize career paths with the highest growth potential for your unique profile" }
                  ].map((feature, index) => (
                    <div key={feature.title} className="flex gap-4">
                      <div className="p-2 rounded-md bg-[#8A85FF]/10 h-fit">
                        <feature.icon className="w-5 h-5 text-[#8A85FF]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                        <p className="text-gray-400 text-[15px]">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="rounded-md overflow-hidden border border-white/[0.05] bg-[#0c0c14] shadow-xl">
                <div className="border-b border-white/[0.05] flex px-4 py-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="p-6">
                  <div className="flex gap-6 mb-6">
                    <div className="w-1/2">
                      <div className="h-4 w-32 bg-[#8A85FF]/20 rounded-full mb-2"></div>
                      <div className="h-32 bg-[#0f0f18] rounded-md border border-white/[0.05]"></div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-4 w-28 bg-[#8A85FF]/20 rounded-full mb-2"></div>
                      <div className="h-32 bg-[#0f0f18] rounded-md border border-white/[0.05]"></div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="h-4 w-40 bg-[#8A85FF]/20 rounded-full mb-2"></div>
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-[#0f0f18] rounded-md border border-white/[0.05]"></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="h-4 w-36 bg-[#8A85FF]/20 rounded-full mb-2"></div>
                    <div className="h-28 bg-[#0f0f18] rounded-md border border-white/[0.05]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Proven Methodology</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">The certcy approach</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our uniquely effective process is designed to transform career uncertainty into strategic advantage.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Data-Driven Insights", 
                desc: "Our algorithms analyze your skillset against market data to identify your optimal positioning",
                features: ["Industry trend analysis", "Skill demand forecasting", "Opportunity mapping"]
              },
              { 
                title: "Strategic Planning", 
                desc: "Transform insights into actionable career strategies with clear milestones and timeframes",
                features: ["Personalized career paths", "Risk mitigation planning", "Growth opportunity targeting"] 
              },
              { 
                title: "Expert Execution", 
                desc: "Implement your strategy with tools and mentorship that ensure successful outcomes",
                features: ["Skill acquisition guidance", "Network expansion", "Position optimization"]
              }
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#0c0c14] border border-white/[0.05] rounded-md p-6 h-full"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#8A85FF]/10 mb-5">
                  <span className="text-[#8A85FF] font-medium">{index + 1}</span>
                </div>
                <h3 className="text-xl font-medium mb-3">{method.title}</h3>
                <p className="text-gray-400 mb-5 text-[15px]">{method.desc}</p>
                <ul className="space-y-2">
                  {method.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1 w-3 h-3 rounded-full bg-[#8A85FF]/20 flex-shrink-0"></div>
                      <span className="text-[15px] text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Success Stories</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Learn from the experienced</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how professionals like you navigated career challenges with certcy's strategic guidance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "From Layoff to Leadership", 
                duration: "12:45",
                industry: "Technology",
                thumbnail: "/video1.jpg"
              },
              { 
                title: "Career Pivot After Recession", 
                duration: "18:22",
                industry: "Finance",
                thumbnail: "/video2.jpg" 
              },
              { 
                title: "Building Resilience in Uncertainty", 
                duration: "15:36",
                industry: "Healthcare",
                thumbnail: "/video3.jpg"
              }
            ].map((video, index) => (
              <HoverCard key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative aspect-video rounded-md overflow-hidden group cursor-pointer bg-[#0c0c14] border border-white/[0.05]"
                >
                  <div className="absolute inset-0 bg-[#0c0c14] opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 bg-[#8A85FF] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 text-white ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2 py-1 rounded-full bg-[#8A85FF]/10 text-xs text-[#8A85FF]">
                        {video.duration}
                      </div>
                      <div className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-400">
                        {video.industry}
                      </div>
                    </div>
                    <h3 className="text-base font-medium">{video.title}</h3>
                  </div>
                </motion.div>
              </HoverCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="#" className="text-[#8A85FF] hover:text-white transition-colors inline-flex items-center text-[15px]">
              View all case studies <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* About Section with Background Text */}
      <div id="about" className="relative">
        <BackgroundText />
      </div>

      {/* Roadmap Section */}
      <div id="roadmap" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Implementation</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Your journey to career resilience</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A structured approach that transforms uncertainty into opportunity through strategic career management.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {[
              { 
                title: "Assessment", 
                desc: "A comprehensive evaluation of your current position, skills, and career trajectory against market realities.",
                keyPoints: ["Skills inventory analysis", "Market position assessment", "Career vulnerability detection"]
              },
              { 
                title: "Strategy Development", 
                desc: "Creating your personalized roadmap to career resilience with actionable steps and clear milestones.",
                keyPoints: ["Opportunity identification", "Risk mitigation planning", "Skill development prioritization"]
              },
              { 
                title: "Implementation Support", 
                desc: "Executing your strategy with guidance, tools, and expert mentorship to ensure successful outcomes.",
                keyPoints: ["Learning resource curation", "Network expansion", "Position optimization"]
              },
              { 
                title: "Continuous Adaptation", 
                desc: "Ongoing refinement of your strategy as market conditions evolve to maintain your competitive edge.",
                keyPoints: ["Regular reassessment", "Strategy adjustment", "Preemptive risk management"]
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative pl-12 pb-16"
              >
                {index < 3 && (
                  <div className="absolute top-12 bottom-0 left-6 w-px bg-[#8A85FF]/20"></div>
                )}
                <div className="absolute top-2 left-0 w-12 h-12 rounded-full border-2 border-[#8A85FF]/20 flex items-center justify-center text-[#8A85FF] font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                  <p className="text-gray-400 mb-4 text-[15px]">{step.desc}</p>
                  <div className="bg-[#0c0c14] border border-white/[0.05] rounded-md p-4">
                    <h4 className="text-sm font-medium mb-3">Key Components:</h4>
                    <ul className="space-y-2">
                      {step.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-[14px]">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#8A85FF] flex-shrink-0"></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Leadership</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Meet our founders</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry veterans with deep expertise in career strategy, data science, and professional development.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Alexandra Chen", 
                role: "CEO & Co-founder",
                bio: "Former VP of Talent at Google with 15+ years guiding career development for thousands of professionals.",
                image: "/team1.jpg"
              },
              { 
                name: "Michael Ramirez", 
                role: "CTO & Co-founder",
                bio: "AI and data science expert who led engineering teams at Microsoft and built machine learning systems predicting industry trends.",
                image: "/team2.jpg"
              },
              { 
                name: "Sarah Johnson", 
                role: "COO & Co-founder",
                bio: "Career strategist who's guided 1000+ professionals through major transitions with a background in organizational psychology.",
                image: "/team3.jpg"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#0c0c14] border border-white/[0.05] rounded-md overflow-hidden"
              >
                <div className="h-48 bg-[#0f0f18] relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#8A85FF]/20">
                    <div className="w-full h-full bg-gradient-to-br from-[#0f0f18] to-[#161625]"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <p className="text-[#8A85FF] text-sm mb-4">{member.role}</p>
                  <p className="text-gray-400 text-[15px] mb-6">{member.bio}</p>
                  <div className="flex space-x-4">
                    {['LinkedIn', 'Twitter', 'Email'].map((platform) => (
                      <a 
                        key={platform} 
                        href="#" 
                        className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-[#8A85FF] hover:border-[#8A85FF]/20 transition-colors"
                      >
                        {platform === 'LinkedIn' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.7,3H4.3C3.6,3,3,3.6,3,4.3v15.4C3,20.4,3.6,21,4.3,21h15.4c0.7,0,1.3-0.6,1.3-1.3V4.3C21,3.6,20.4,3,19.7,3z M8.3,18.4H5.7V9.2h2.6V18.4z M7,8.1c-0.8,0-1.5-0.7-1.5-1.5C5.5,5.7,6.2,5,7,5s1.5,0.7,1.5,1.5C8.5,7.4,7.8,8.1,7,8.1z M18.3,18.4h-2.6v-4.1c0-1,0-2.2-1.3-2.2c-1.3,0-1.5,1-1.5,2.1v4.2h-2.6V9.2h2.5v1.1h0c0.4-0.7,1.2-1.3,2.5-1.3c2.7,0,3.2,1.8,3.2,4.1V18.4z" />
                          </svg>
                        )}
                        {platform === 'Twitter' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22,5.8a8.6,8.6,0,0,1-2.4.7,4.1,4.1,0,0,0,1.8-2.3,8.1,8.1,0,0,1-2.6,1A4.1,4.1,0,0,0,11.8,8,8,8,0,0,1,5,4.3a4.1,4.1,0,0,0,1.3,5.5,4,4,0,0,1-1.9-.5V9.4a4.1,4.1,0,0,0,3.3,4,4.1,4.1,0,0,1-1.9.1,4.1,4.1,0,0,0,3.9,2.8A8.3,8.3,0,0,1,3,18a11.1,11.1,0,0,0,6.5,1.9,11.7,11.7,0,0,0,11.8-12c0-.2,0-.4,0-.5A8.4,8.4,0,0,0,23,5.8Z" />
                          </svg>
                        )}
                        {platform === 'Email' && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Testimonials</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Client success stories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Read how professionals at various stages of their careers have achieved breakthrough results with certcy.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "James Wilson", 
                role: "Senior Developer",
                quote: "certcy identified a potential layoff at my company 3 months before it happened, giving me time to pivot to a more secure position with a 15% salary increase.",
                company: "Former Amazon engineer"
              },
              { 
                name: "Emily Rodriguez", 
                role: "Marketing Director",
                quote: "The skill gap analysis showed me exactly what I needed to learn to transition from traditional to digital marketing, saving me months of trial and error.",
                company: "Global CPG brand"
              },
              { 
                name: "David Chen", 
                role: "Financial Analyst",
                quote: "Having a strategic career plan allowed me to navigate the financial sector during the downturn and emerge with more responsibility and a clearer path forward.",
                company: "Investment management firm"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-[#0c0c14] border border-white/[0.05] rounded-md p-6 h-full flex flex-col"
              >
                <div className="mb-6 text-[#8A85FF]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-300 italic mb-6 text-[15px] leading-relaxed">"{testimonial.quote}"</p>
                </div>
                <div className="pt-4 border-t border-white/[0.05]">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-[#8A85FF] text-xs mt-1">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <a href="#" className="inline-flex items-center text-[15px] text-[#8A85FF] hover:text-white transition-colors">
              Read more client stories <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h4 className="text-[#8A85FF] text-sm uppercase tracking-wider mb-3">Investment</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Career plans for every stage</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the plan that aligns with your career goals and timeline, with flexible options to suit your needs.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Essentials",
                price: "$29",
                period: "per month",
                description: "Core tools for career monitoring and basic risk assessment",
                features: [
                  "Industry risk monitoring",
                  "Basic skills assessment",
                  "Career path visualization",
                  "Monthly strategy updates",
                  "Email support"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Professional",
                price: "$79",
                period: "per month",
                description: "Comprehensive career management with advanced insights and personalized guidance",
                features: [
                  "Advanced risk prediction",
                  "Detailed skill gap analysis",
                  "Personalized opportunity mapping",
                  "Weekly strategy updates",
                  "Priority support",
                  "2 mentor sessions per month",
                  "Resume and outreach optimization"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Executive",
                price: "$199",
                period: "per month",
                description: "Elite career strategy with dedicated mentorship and comprehensive support",
                features: [
                  "All Professional features",
                  "Executive risk assessment",
                  "Leadership skill development",
                  "Strategic career positioning",
                  "Unlimited mentor access",
                  "Network expansion strategy",
                  "Executive presence coaching",
                  "Board position preparation"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`bg-[#0c0c14] border ${plan.popular ? 'border-[#8A85FF]/30' : 'border-white/[0.05]'} rounded-md overflow-hidden ${plan.popular ? 'shadow-lg shadow-[#8A85FF]/5' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-[#8A85FF] text-center py-1 text-xs font-medium text-white">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-light">{plan.price}</span>
                    <span className="text-gray-400 text-sm"> {plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-[15px] mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-[15px]">
                        <svg className="w-5 h-5 text-[#8A85FF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href="#" 
                    className={`block text-center py-2 px-4 rounded-md text-[15px] font-medium transition-colors ${plan.popular ? 'bg-[#8A85FF] text-white hover:bg-[#7C78E8]' : 'bg-white/[0.05] text-white hover:bg-white/[0.1]'}`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-[#0c0c14] border border-white/[0.05] rounded-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Enterprise solutions</h3>
                <p className="text-gray-400 text-[15px]">Customized career resilience programs for organizations supporting multiple team members.</p>
              </div>
              <a 
                href="#" 
                className="whitespace-nowrap bg-white/[0.05] hover:bg-white/[0.1] text-white py-2 px-6 rounded-md text-[15px] font-medium transition-colors"
              >
                Contact our team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter/CTA Section */}
      <div className="py-24 relative">
        <GradientBlur className="w-[700px] h-[500px] bg-[#6B66CC]/20 bottom-0 left-[20%]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#0c0c14] border border-white/[0.05] rounded-md p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light mb-4">Ready to secure your career future?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join thousands of professionals who've transformed uncertainty into opportunity with certcy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <a 
                href="#" 
                className="bg-[#8A85FF] hover:bg-[#7C78E8] text-white py-3 text-center rounded-md font-medium transition-colors"
              >
                Start Free Trial
              </a>
              <a 
                href="#" 
                className="bg-white/[0.05] hover:bg-white/[0.1] text-white py-3 text-center rounded-md font-medium transition-colors"
              >
                Schedule Demo
              </a>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              No credit card required. 14-day free trial on all Professional plans.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-[#070709] border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <a href="#" className="inline-block mb-6 text-2xl font-light tracking-tight">
                <span className="text-[#8A85FF] font-medium">cert</span>
                <span className="text-white">cy</span>
              </a>
              <p className="text-gray-400 text-[15px] mb-6">
                AI-powered career navigation for professionals who want to transform uncertainty into strategic advantage.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-[#8A85FF] hover:border-[#8A85FF]/20 transition-colors"
                  >
                    {social === 'twitter' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22,5.8a8.6,8.6,0,0,1-2.4.7,4.1,4.1,0,0,0,1.8-2.3,8.1,8.1,0,0,1-2.6,1A4.1,4.1,0,0,0,11.8,8,8,8,0,0,1,5,4.3a4.1,4.1,0,0,0,1.3,5.5,4,4,0,0,1-1.9-.5V9.4a4.1,4.1,0,0,0,3.3,4,4.1,4.1,0,0,1-1.9.1,4.1,4.1,0,0,0,3.9,2.8A8.3,8.3,0,0,1,3,18a11.1,11.1,0,0,0,6.5,1.9,11.7,11.7,0,0,0,11.8-12c0-.2,0-.4,0-.5A8.4,8.4,0,0,0,23,5.8Z" />
                      </svg>
                    )}
                    {social === 'linkedin' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.7,3H4.3C3.6,3,3,3.6,3,4.3v15.4C3,20.4,3.6,21,4.3,21h15.4c0.7,0,1.3-0.6,1.3-1.3V4.3C21,3.6,20.4,3,19.7,3z M8.3,18.4H5.7V9.2h2.6V18.4z M7,8.1c-0.8,0-1.5-0.7-1.5-1.5C5.5,5.7,6.2,5,7,5s1.5,0.7,1.5,1.5C8.5,7.4,7.8,8.1,7,8.1z M18.3,18.4h-2.6v-4.1c0-1,0-2.2-1.3-2.2c-1.3,0-1.5,1-1.5,2.1v4.2h-2.6V9.2h2.5v1.1h0c0.4-0.7,1.2-1.3,2.5-1.3c2.7,0,3.2,1.8,3.2,4.1V18.4z" />
                      </svg>
                    )}
                    {social === 'instagram' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,6.8a5.2,5.2,0,1,0,5.2,5.2A5.2,5.2,0,0,0,12,6.8Zm0,8.6a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,12,15.4Zm6.6-8.8a1.2,1.2,0,1,1-1.2-1.2A1.2,1.2,0,0,1,18.6,6.6ZM22.4,7.8a6,6,0,0,0-1.6-4.2A6,6,0,0,0,16.6,2c-1.6-.1-6.6-.1-8.2,0A6,6,0,0,0,4.2,3.6,6,6,0,0,0,2.6,7.8c-.1,1.6-.1,6.6,0,8.2a6,6,0,0,0,1.6,4.2A6,6,0,0,0,8.4,22c1.6.1,6.6.1,8.2,0a6,6,0,0,0,4.2-1.6,6,6,0,0,0,1.6-4.2C22.5,14.4,22.5,9.4,22.4,7.8ZM20,17.8a3.4,3.4,0,0,1-1.9,1.9c-1.3.5-4.5.4-5.9.4s-4.6.1-5.9-.4A3.4,3.4,0,0,1,4.4,18c-.5-1.3-.4-4.5-.4-5.9s-.1-4.6.4-5.9A3.4,3.4,0,0,1,6.2,4.4c1.3-.5,4.5-.4,5.9-.4s4.6-.1,5.9.4a3.4,3.4,0,0,1,1.9,1.9c.5,1.3.4,4.5.4,5.9S20.5,16.5,20,17.8Z" />
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
                <h4 className="text-sm font-medium uppercase tracking-wider text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-[#8A85FF] text-[15px] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 certcy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-[#8A85FF] text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-[#8A85FF] text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-[#8A85FF] text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;