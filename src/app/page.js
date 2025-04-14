"use client";
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { NewNavbar } from "@/components/Navbar";
import CareerHeroSection from "@/components/HeroSection";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { cn } from "@/lib/utils";
import { kaushan_script } from "./fonts";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { TextReveal } from "@/components/magicui/text-reveal";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter-effect";

// Container component for consistent spacing and max width
function Container({ children, className = "", maxWidth = "max-w-7xl" }) {
  return (
    <div
      className={`${maxWidth} mx-auto px-5 sm:px-6 lg:px-8 relative z-10 ${className}`}
    >
      {children}
    </div>
  );
}
// Video section data
const videos = [
  {
    title: "From Layoff to Leadership",
    duration: "12:45",
    industry: "Technology",
    thumbnail: "https://www.certcy.space/backfull.JPG",
    videoSrc: "https://www.youtube-nocookie.com/embed/hFPns5z98Mw",
    description:
      "See how Sarah transformed an unexpected layoff into a strategic career pivot",
  },
  {
    title: "Career Pivot After Recession",
    duration: "18:22",
    industry: "Finance",
    thumbnail: "https://www.certcy.space/backfull.JPG",
    videoSrc: "https://www.youtube-nocookie.com/embed/hFPns5z98Mw",
    description:
      "Learn how Michael repositioned his skills for a high-growth sector",
  },
  {
    title: "Building Resilience in Uncertainty",
    duration: "15:36",
    industry: "Healthcare",
    thumbnail: "https://www.certcy.space/backfull.JPG",
    videoSrc: "https://www.youtube-nocookie.com/embed/hFPns5z98Mw",
    description:
      "Discover Jessica's framework for maintaining career momentum in volatile markets",
  },
];
function VideoSection() {
  return (
    <>
      {/* Video Section - Updated */}
      <section className="py-24 relative overflow-hidden bg-neutral-100">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-950 ">
              <span className={`text-blue-500 ${kaushan_script.className}`}>
                Learn&nbsp;
              </span>{" "}
              from the experienced
            </h2>
            <p className="text-lg text-gray-950 max-w-3xl mx-auto">
              Discover how professionals like you navigated career challenges
              with Certcy&apos;s strategic guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
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
                      <span className="px-3 py-1 text-black bg-blue-400/30 rounded-full text-sm font-medium">
                        {video.duration}
                      </span>
                      <span className="px-3 py-1 bg-white/5 text-gray-950 rounded-full text-sm">
                        {video.industry}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-black group-hover:text-blue-400 transition-colors">
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
    </>
  );
}

// Scroll progress indicator with modern style
function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
// News cutout images for 3D Marquee
const newsImages = [
  "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
  "https://assets.aceternity.com/animated-modal.png",
  "https://assets.aceternity.com/animated-testimonials.webp",
  "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
  "https://assets.aceternity.com/github-globe.png",
  "https://assets.aceternity.com/glare-card.png",
  "https://assets.aceternity.com/layout-grid.png",
  "https://assets.aceternity.com/flip-text.png",
  "https://assets.aceternity.com/hero-highlight.png",
  "https://assets.aceternity.com/carousel.webp",
  "https://assets.aceternity.com/placeholders-and-vanish-input.png",
  "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
  "https://assets.aceternity.com/signup-form.png",
  "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
  "https://assets.aceternity.com/spotlight-new.webp",
  "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
  "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
  "https://assets.aceternity.com/tabs.png",
  "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
  "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
  "https://assets.aceternity.com/glowing-effect.webp",
  "https://assets.aceternity.com/hover-border-gradient.png",
  "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
  "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
  "https://assets.aceternity.com/macbook-scroll.png",
  "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
  "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
  "https://assets.aceternity.com/multi-step-loader.png",
  "https://assets.aceternity.com/vortex.png",
  "https://assets.aceternity.com/wobble-card.png",
  "https://assets.aceternity.com/world-map.webp",
];

// Main component
function Home() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
      {/* <ScrollProgressIndicator /> */}

      {/* Subtle Background Noise for Texture */}
      <div
        className="fixed inset-0 opacity-[0.03]  pointer-events-none z-[1]"
        aria-hidden="true"
      ></div>
      {/* /noise.png */}
      {/* Enhanced Navigation */}
      <div className="fixed top-5 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <NewNavbar />
        </div>
      </div>

      <main id="main-content">
        <CareerHeroSection />

        <txtr className="relative z-10 py-32 md:py-40">
          <div className="container  mx-auto px-6">
            <div className="h-32 w-5xl"></div>

            <TextReveal
              bgColor="#232323"
              fgColor="#f8fafc"
              sectionBgColor="transparent"
              sectionHeight="auto"
              staggerAmount={0.03}
              duration={0.5}
              className="reveal-container"
            >
              Every career is a boat, sailing into the future with hopes and
              aspirations. The ride is smooth at first. Then the storms
              hit-recession, downturns, layoffs. Most boats sink. But not this
              one. This one adjusts, changes direction, and rebuilds.
            </TextReveal>

            <div className="h-32"></div>
          </div>
        </txtr>

        {/* 3D Marquee with Career Transformation */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-6 relative z-20">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Your career is your ship.
                <span className={`text-blue-500 ${kaushan_script.className}`}>
                  Don't let it sink.
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Navigate economic uncertainty with data-driven insights and
                strategic career planning.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-colors duration-300"
              >
                Start Your Journey
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* The 3D marquee as background */}
          <div className="absolute inset-0 z-0">
            {/* Dark gradient overlay to improve text readability */}
            <div className="h-full w-full">
              <ThreeDMarquee
                className="pointer-events-none h-full w-full opacity-40"
                images={newsImages}
              />
            </div>
          </div>
        </section>

        <div className="h-32"></div>

        <VideoSection />

        <div className="h-32"></div>
      </main>
    </div>
  );
}

export default Home;
