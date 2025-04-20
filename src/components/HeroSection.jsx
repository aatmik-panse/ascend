"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Brain,
  Shield,
  Rocket,
  Target,
  RouteOff,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/registry/magicui/grid-pattern";
import { kaushan_script } from "@/app/fonts";
import { MagicCard } from "./magicui/magic-card";
import {
  SiSwiggy,
  SiRailway,
  SiPlanetscale,
  SiStripe,
  SiSupabase,
  SiHashnode,
  SiSaucelabs,
  SiSencha,
  SiBukalapak,
} from "react-icons/si";

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
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePosition({ x, y });
    };

    // Handle scroll for parallax and transitions
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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
  const secondSectionProgress = calculateProgress(
    secondSectionStartPosition,
    secondSectionEndPosition
  );
  const secondSectionOpacity = secondSectionProgress;

  // Background gradient opacity
  const gradientOpacity =
    1 - calculateProgress(viewportHeight * 1.3, viewportHeight * 2);

  const companyIcons = [
    { icon: SiBukalapak, name: "Bukalapak" },
    { icon: SiRailway, name: "Railway" },
    { icon: SiPlanetscale, name: "PlanetScale" },
    { icon: SiSencha, name: "Sencha" },
    { icon: SiSwiggy, name: "Swiggy" },
    { icon: SiHashnode, name: "Hashnode" },
    { icon: SiSaucelabs, name: "Sauce Labs" },
  ];

  const features = [
    {
      title: "Career Radar",
      description:
        "Spot early layoff signals from company data and industry trends—stay prepared, never surprised.",
      icon: Shield,
      gradientFrom: "#3B82F6",
      gradientTo: "#38BDF8",
      benefits: [
        "Warning for company changes",
        "Industry volatility predictions",
        "Personalized risk scores",
        "Market stability insights",
      ],
    },
    {
      title: "Pivot Engine",
      description:
        "Get smart career paths, resume boosts, and job options tailored to your strengths and goals.",
      icon: Rocket,
      gradientFrom: "#A855F7",
      gradientTo: "#8B5CF6",
      benefits: [
        "Premium job matching algorithm",
        "Advanced outreach templates",
        "Interview preparation tools",
        "Salary negotiation insights",
      ],
    },
    {
      title: "CompassBot",
      description:
        "Your smart, personal career guide available 24/7. Ask questions, get clarity, and receive contextual advice through an emotionally-aware chatbot.",
      icon: Target,
      gradientFrom: "#084531",
      gradientTo: "#01734f",
      benefits: [
        "Emerging skill trend analysis",
        "Personalized learning roadmaps",
        "Industry transition guides",
        "Expert mentorship network",
      ],
    },
  ];

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

        {/* Responsive Light Gradient Overlay (middle layer) */}
        <div
          className="absolute"
          style={{
            background:
              "radial-gradient(circle, rgba(170, 200, 235, 0.3) 0%, rgba(170, 200, 235, 0) 60%)",
            width: "100vw",
            height: "100vh",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* First Section - Hero Content - improved responsive layout */}
      <motion.section
        ref={firstSectionRef}
        className="min-h-[90vh] sm:h-screen flex items-center justify-center relative z-10 pt-20 sm:pt-24 pb-8 sm:pb-0"
        style={{
          y: parallaxY,
          opacity: 1 - firstSectionProgress * 0.7,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto px-4 md:px-8 text-center relative">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-clip-text bg-gradient-to-r from-white to-white/80">
              Some careers sink in silence.
            </span>
            <br />
            <span className="text-white">Yours won&apos;t.</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Certcy is your compass through chaos - layoffs, pivots, upskilling,
            and more. We don&apos;t save careers. We steer them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex justify-center"
          >
            <a
              href="/waitlist"
              className="bg-slate-800 no-underline group cursor-pointer relative shadow-lg shadow-zinc-900 rounded-full p-px text-sm sm:text-base md:text-lg font-semibold leading-6 text-white inline-flex items-center"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex items-center z-10 rounded-full bg-zinc-950 py-2 sm:py-3 px-4 sm:px-6 ring-1 ring-white/10">
                <span className="mr-2 sm:mr-3">Join The WaitList</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </a>
          </motion.div>

          {/* Responsive spacing */}
          <div className="gap-4 flex mt-16 sm:mt-24 md:mt-36 justify-center items-center" />

          {/* Trusted By - Responsive Version */}
          <motion.div
            className="mt-auto w-full max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="text-center">
              <p className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider mb-4 sm:mb-6">
                Trusted By
              </p>
              <div
                className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12"
                id="features"
              >
                {companyIcons.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="group"
                  >
                    <company.icon
                      className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gray-400 transition-colors duration-200 group-hover:text-gray-200"
                      aria-label={company.name}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="gap-4 flex mt-16 sm:mt-24 md:mt-36 justify-center items-center" />
      {/* Second Section - Value Proposition - improved responsiveness */}

      <div className="max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
            <span className={`text-blue-500 ${kaushan_script.className}`}>
              Certcy&nbsp;
            </span>{" "}
            is your career catalyst
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            Guiding professionals through career transitions with data-driven
            insights
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <MagicCard
              key={index}
              className="rounded-xl group hover:scale-[1.02] transition-transform duration-300"
              gradientFrom={feature.gradientFrom}
              gradientTo={feature.gradientTo}
            >
              <div className="p-6 sm:p-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300`}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center text-xs sm:text-sm text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerHeroSection;
