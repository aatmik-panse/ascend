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

  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return;

    // Wait for DOM to be ready
    const text = new SplitType(textRef.current, { types: "chars, words" });

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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Create the animation
    gsap.fromTo(
      text.chars,
      {
        color: bgColor,
        opacity: 0,
        scale: 0.9,
        y: 20,
      },
      {
        color: fgColor,
        opacity: 1,
        scale: 1,
        y: 0,
        duration: duration,
        stagger: staggerAmount,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: startTrigger,
          end: endTrigger,
          scrub: false, // Changed to false for smoother animations
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup
    return () => {
      observer.disconnect();
      if (text && typeof text.revert === "function") {
        text.revert();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [bgColor, fgColor, duration, staggerAmount, startTrigger, endTrigger]);

  const sectionStyle = {
    height: sectionHeight,
    backgroundColor: sectionBgColor || "transparent",
    padding: "0 clamp(3rem, 10vw, 15rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    fontSize: "clamp(1.5rem, 4vw, 5rem)",
    lineHeight: 1.3,
    maxWidth: "100%",
    overflowWrap: "break-word",
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
