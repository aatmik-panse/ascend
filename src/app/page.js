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
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import ComparisonTable from "@/components/ComparisionTable";
import TracingBeamFeature from "@/components/TracingBeamFeature";

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

// Final CTA Component with animated background
function FinalCta() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

        {/* Subtle animated waves */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%233B82F6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            animationName: "wave",
            animationDuration: "25s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
        <style jsx global>{`
          @keyframes wave {
            0% {
              background-position: 0% 0;
            }
            100% {
              background-position: 100% 0;
            }
          }
        `}</style>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800"
          >
            Careers don&apos;t collapse overnight.
            <br />
            <span className="text-blue-600">
              But they rise faster when you steer them right.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 font-light"
          >
            Start with certcy. Navigate your storm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative inline-block"
          >
            {/* <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div> */}
            <button className="relative px-8 py-4 bg-white rounded-lg font-medium text-lg text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2">
              <span className={`text-blue-500 ${kaushan_script.className}`}>
                Certcy Your Career
              </span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </Container>
    </section>
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
      <div className="fixed top-0 sm:top-5 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewNavbar />
        </div>
      </div>

      <main id="main-content" className="overflow-hidden">
        <CareerHeroSection />

        <div className="relative z-10 py-16 sm:py-24 md:py-32">
          <div className="container  mx-auto px-4 sm:px-6">
            <div className="h-16 sm:h-24 md:h-32 w-full"></div>

            <TextReveal
              bgColor="#232323"
              fgColor="#f8fafc"
              sectionBgColor="transparent"
              sectionHeight="auto"
              staggerAmount={0.03}
              duration={0.3}
              className="reveal-container"
            >
              Every career is a boat, sailing into the future with hopes and
              aspirations. The ride is smooth at first. Then the storms
              hit-recession, downturns, layoffs. Most boats sink. But not this
              one. This one adjusts, changes direction, and rebuilds.
            </TextReveal>

            <div className="h-16 sm:h-24 md:h-36"></div>
          </div>
        </div>

        <VideoSection />

        {/* Add the TracingBeamFeature component here */}
        <TracingBeamFeature />

        <ComparisonTable />

        {/* 3D Marquee with Career Transformation - improved responsive layout */}
        <section className="relative flex items-center justify-center min-h-[80vh] md:h-screen overflow-hidden py-16 md:py-0">
          {/* Simple centered content with clean styling */}
          <div className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-4 sm:px-6 relative z-20">
            <div className="bg-black/50 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-xl border border-white/10 shadow-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
                Your career is your ship.
                <span
                  className={`block mt-2 text-blue-400 ${kaushan_script.className}`}
                >
                  Don&apos;t let it sink.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-blue-100/80 mx-auto max-w-xl">
                Navigate economic uncertainty with data-driven insights and
                strategic career planning.
              </p>
            </div>
          </div>

          {/* The 3D marquee as background - scaled up to fill the section better */}
          <div className="absolute inset-0 z-0 scale-110 sm:scale-125">
            {/* Simple dark gradient overlay for better contrast */}
            <div className="absolute inset-0 z-10"></div>

            <ThreeDMarquee
              className="pointer-events-none h-full w-full opacity-60"
              images={newsImages}
            />
          </div>
        </section>

        {/* Final CTA Section */}

        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
