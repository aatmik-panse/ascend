"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Heart,
  Shield,
  Target,
  Network,
  Brain,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { kaushan_script } from "@/app/fonts";

const theme = {
  periwinkle: "var(--color-periwinkle, #8A85FF)",
  lilac: "var(--color-lilac, #C8A2FF)",
  blue: "#3B82F6",
};

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();
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
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Top wave decoration */}
      {/* <div className="absolute top-0 left-0 right-0 h-12 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute h-full w-full text-white opacity-5"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div> */}

      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(200,162,255,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Logo and company info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center mb-6">
              <h2 className={`text-3xl font-bold ${kaushan_script.className}`}>
                Certcy
              </h2>
            </div>

            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Transforming careers into exciting journeys of growth and
              achievement through AI-powered strategies and data-driven
              insights.
            </p>

            {/* Newsletter form */}
            {/* <div className="pt-4">
              <h3 className="text-lg font-medium mb-3">Stay updated</h3>
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium transition-all flex items-center justify-center whitespace-nowrap"
                  >
                    Subscribe
                    <ArrowRight size={16} className="ml-2" />
                  </motion.button>
                </div>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute mt-2 flex items-center text-sm text-green-500"
                  >
                    <CheckCircle size={14} className="mr-1.5" />
                    <span>Thank you for subscribing!</span>
                  </motion.div>
                )}
              </form>
            </div> */}
          </div>

          {/* Navigation link columns with increased spacing */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium mb-6 text-white">Features</h3>
            <ul className="space-y-4">
              <FooterLink icon={<Shield size={16} />} text="AI Risk Shield" />
              <FooterLink icon={<Target size={16} />} text="Strategic Pivots" />
              <FooterLink icon={<Network size={16} />} text="Network Boost" />
              <FooterLink icon={<Brain size={16} />} text="Skill Tree" />
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Blog" />
              <FooterLink text="Press Kit" />
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium mb-6 text-white">Resources</h3>
            <ul className="space-y-4">
              <FooterLink text="Documentation" />
              <FooterLink text="Help Center" />
              <FooterLink text="Privacy Policy" href="/privacy-policy" />
              <FooterLink text="Terms of Service" />
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <FooterLink icon={<MessageSquare size={16} />} text="Support" />
              <FooterLink icon={<Mail size={16} />} text="hello@certcy.com" />
            </ul>
            <div className="pt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Follow us
              </h4>
              <div className="flex space-x-3">
                <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
                <SocialIcon icon={<Linkedin size={18} />} label="LinkedIn" />
                <SocialIcon icon={<Instagram size={18} />} label="Instagram" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider with enhanced styling */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800/60"></div>
          </div>
          <div className="relative flex justify-center">
            <div className=" px-4 text-sm text-blue-500">
              <Compass size={16} />
            </div>
          </div>
        </div>

        {/* Copyright section with improved layout */}
        <div className="pt-8 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">
              © {currentYear} Certcy. All rights reserved.
            </p>

            {/* <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Sitemap
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Accessibility
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cookie Settings
              </a>
            </div> */}

            <div className="flex items-center text-sm text-gray-500 group">
              <span>Made with</span>
              <Heart
                size={14}
                className="mx-1.5 transition-transform duration-300 group-hover:scale-125 text-blue-500/80"
              />
              <span>for career enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, label }) {
  return (
    <motion.a
      href="#"
      aria-label={label}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="p-2.5 rounded-full bg-gray-800 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
    >
      {icon}
    </motion.a>
  );
}

function FooterLink({ icon, text, href = "#" }) {
  return (
    <li>
      <Link
        href={href}
        className="group text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        {icon && (
          <span className="text-blue-500/80 transition-colors duration-300">
            {icon}
          </span>
        )}
        <span className="relative group-hover:translate-x-1 transition-transform duration-200">
          {text}
          <span className="absolute left-0 bottom-0 w-0 h-px bg-blue-500/50 transition-all duration-300 group-hover:w-full" />
        </span>
        {!icon && (
          <ChevronRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
      </Link>
    </li>
  );
}

export default Footer;
