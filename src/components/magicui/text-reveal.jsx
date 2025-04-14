"use client";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const TextReveal = ({
  children,
  className,
  bgColor = "#1a1a1a",
  fgColor = "#ffffff",
  sectionHeight = "100vh",
  sectionBgColor,
  staggerAmount = 0.02,
  duration = 0.5,
  startTrigger = "top 80%",
  endTrigger = "top 20%",
}) => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return;

    // Wait for DOM to be ready
    const text = new SplitType(textRef.current, {
      types: isMobile ? "words" : "chars, words", // Use only words on mobile for better performance
    });

    // Add a visibility class for CSS animations
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          sectionRef.current.classList.add("active");
        } else {
          setIsVisible(false);
          sectionRef.current.classList.remove("active");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Create the scroll-based animation
    const elements = isMobile ? text.words : text.chars;
    const mobileStaggerAmount = staggerAmount * 2; // Increase stagger for mobile

    elements.forEach((element, i) => {
      // Set initial state
      gsap.set(element, {
        color: bgColor,
        opacity: 0.3,
        scale: 0.95,
        y: isMobile ? 5 : 10, // Less movement on mobile
      });

      // Create animation with adjusted values for mobile
      const delay = i * (isMobile ? mobileStaggerAmount : staggerAmount);
      const triggerStart = isMobile
        ? `top+=${50 + i * 3}px bottom`
        : `top+=${100 + i * 5}px bottom`;
      const triggerEnd = isMobile
        ? `top+=${100 + i * 5}px 80%`
        : `top+=${200 + i * 10}px 70%`;

      gsap.to(element, {
        color: fgColor,
        opacity: 1,
        scale: 1,
        y: 0,
        duration: isMobile ? 0.3 : 0.4, // Quicker animation on mobile
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: triggerStart,
          end: triggerEnd,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      });
    });

    // Cleanup
    return () => {
      observer.disconnect();
      if (text && typeof text.revert === "function") {
        text.revert();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [
    bgColor,
    fgColor,
    duration,
    staggerAmount,
    startTrigger,
    endTrigger,
    isMobile,
  ]);

  const sectionStyle = {
    height: sectionHeight,
    backgroundColor: sectionBgColor || "transparent",
    padding: isMobile ? "0 1.5rem" : "0 clamp(3rem, 10vw, 15rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    fontSize: "clamp(1.2rem, 5vw, 5rem)", // Improved responsive font sizing
    lineHeight: isMobile ? 1.4 : 1.3, // Increase line height on mobile
    maxWidth: "100%",
    overflowWrap: "break-word",
    textAlign: isMobile ? "center" : "inherit", // Center text on mobile
  };

  return (
    <section
      ref={sectionRef}
      className={cn("reveal-section", isVisible && "visible", className)}
      style={sectionStyle}
    >
      <p
        ref={textRef}
        className="reveal-type"
        data-bg-color={bgColor}
        data-fg-color={fgColor}
        style={textStyle}
      >
        {children}
      </p>
    </section>
  );
};
