"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Brain, RouteOff, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { GridPattern } from "@/registry/magicui/grid-pattern";
import { kaushan_script } from "@/app/fonts";
import { MagicCard } from './magicui/magic-card';

const CareerHeroSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportHeight, setViewportHeight] = useState(800); // Default viewport height
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  
  // Initialize window-dependent values after mount
  useEffect(() => {
    // Set initial viewport dimensions
    setViewportHeight(window.innerHeight);
    
    // Handle resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    
    // Handle mouse movement for interactive elements
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    
    // Handle scroll for parallax and transitions
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate scroll progress for animations
  const calculateProgress = (startPosition, endPosition) => {
    if (scrollPosition < startPosition) return 0;
    if (scrollPosition > endPosition) return 1;
    return (scrollPosition - startPosition) / (endPosition - startPosition);
  };
  
  // Section transition calculations - safely using viewportHeight
  const firstSectionProgress = calculateProgress(0, viewportHeight);
  const parallaxY = firstSectionProgress * 150; // Reduced parallax effect for better focus
  
  const secondSectionStartPosition = viewportHeight * 0.5;
  const secondSectionEndPosition = viewportHeight * 1;
  const secondSectionProgress = calculateProgress(secondSectionStartPosition, secondSectionEndPosition);
  const secondSectionOpacity = secondSectionProgress;
  
  // Background gradient opacity
  const gradientOpacity = 1 - calculateProgress(viewportHeight * 1.3, viewportHeight * 2);
  
  return (
    <div className="relative overflow-hidden">
      {/* Background layers */}
      <div 
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: gradientOpacity }}
      >
        {/* Grid Pattern (base layer) */}
        <div className="absolute inset-0">
          <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_left,white,transparent,white)]",
              "opacity-60 text-white"
            )}
          />
        </div>

        {/* New Light Gradient Overlay (middle layer) - centered */}
        <div 
          className="absolute"
          style={{ 
            background: 'radial-gradient(circle, rgba(170, 200, 235, 0.3) 0%, rgba(170, 200, 235, 0) 60%)',
            width: '100vw',
            height: '100vh',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Subtle Grain Texture (top background layer) */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==")',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* First Section - Hero Content */}
      <motion.section 
        ref={firstSectionRef}
        className="h-screen flex items-center justify-center relative z-10"
        style={{
          y: parallaxY,
          opacity: 1 - firstSectionProgress * 0.7, 
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-clip-text bg-gradient-to-r ">
              Transform Career Uncertainty
            </span>
            <br />
            <span className="text-white">Into Strategic Advantage</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Navigate your professional journey with AI-powered insights that help you
            stay ahead of industry changes and position yourself for success.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex justify-center"
          >
            <a 
              href="/onboarding"  
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-lg shadow-zinc-900 rounded-full p-px text-lg font-semibold leading-6 text-white inline-flex items-center"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex items-center z-10 rounded-full bg-zinc-950 py-3 px-6 ring-1 ring-white/10">
                <span className="mr-3">Start Career Assessment</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </a>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Second Section - Value Proposition */}
      <motion.section 
        ref={secondSectionRef}
        className="min-h-screen flex items-center relative z-10 py-20"
        style={{
          opacity: Math.max(0, secondSectionOpacity),
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className={`text-blue-500 ${kaushan_script.className}`}>Certcy&nbsp;</span> is your career catalyst
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Guiding professionals through career transitions with data-driven insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <MagicCard
              className="rounded-xl" 
              gradientFrom="#3B82F6" 
              gradientTo="#38BDF8"
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-5">
                  <Brain className="text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get personalized insights about your skills and market positioning based on real-time industry data.
                </p>
              </div>
            </MagicCard>
            
            {/* Feature 2 */}
            <MagicCard 
              className="rounded-xl" 
              gradientFrom="#A855F7" 
              gradientTo="#8B5CF6"
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-5">
                  <RouteOff className="text-purple-400 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Strategic Roadmaps</h3>
                <p className="text-gray-300 leading-relaxed">
                  Develop clear action plans for upskilling, career pivots, and advancement opportunities tailored to your goals.
                </p>
              </div>
            </MagicCard>
            
            {/* Feature 3 */}
            <MagicCard 
              className="rounded-xl" 
              gradientFrom="#084531" 
              gradientTo="#01734f"
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-5">
                  <BarChart2 className="text-emerald-400 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Continuous Growth</h3>
                <p className="text-gray-300 leading-relaxed">
                  Track your progress and receive adaptive recommendations as industry demands and your skills evolve.
                </p>
              </div>
            </MagicCard>
          </div>
          
          {/* <div className="mt-12 text-center">
            <a 
              href="/learn-more"  
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
            >
              Learn how certcy works
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div> */}
        </div>
      </motion.section>
    </div>
  );
};

export default CareerHeroSection;
