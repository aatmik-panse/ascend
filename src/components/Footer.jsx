"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  CheckCircle 
} from 'lucide-react';

const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

function Footer() {
  const [email, setEmail] = useState('');
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
      setEmail('');
    }
  };

  
  
  return (
    <footer className="relative bg-gray-950 text-white pt-16 pb-8 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(138,133,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(200,162,255,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Top Section with Logo and Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
                }}>
                Certcy
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Transforming careers into exciting journeys of growth and achievement through AI-powered strategies.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
              <SocialIcon icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialIcon icon={<Instagram size={18} />} label="Instagram" />
              <SocialIcon icon={<Mail size={18} />} label="Email" />
            </div>
          </div>
          
          {/* Features Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Features</h3>
            <ul className="space-y-4">
              <FooterLink icon={<Shield size={16} />} text="AI Risk Shield" />
              <FooterLink icon={<Target size={16} />} text="Strategic Pivots" />
              <FooterLink icon={<Network size={16} />} text="Network Boost" />
              <FooterLink icon={<Brain size={16} />} text="Skill Tree" />
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-4">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Blog" />
              <FooterLink text="Press" />
            </ul>
          </div>
          
          {/* Resources Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Resources</h3>
            <ul className="space-y-4">
              <FooterLink text="Documentation" />
              <FooterLink text="Support" />
              <FooterLink text="Privacy Policy" href="/privacy-policy"/>
              <FooterLink text="Terms of Service" />
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800/50 pt-12 pb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Stay in the loop</h3>
            <p className="text-gray-400 text-lg mb-8">
              Get the latest updates on career strategies and platform features
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="flex-grow px-6 py-4 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 
                    focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-700/50 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="group px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 
                    hover:shadow-lg hover:shadow-periwinkle/20 hover:scale-105 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-periwinkle"
                  style={{ 
                    background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`,
                  }}
                >
                  Subscribe
                  <ArrowRight className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1" size={16} />
                </button>
              </div>
              {isSubscribed && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500/20 text-green-400 
                  rounded-full text-sm font-medium flex items-center gap-2 animate-fade-in-down">
                  <CheckCircle size={14} />
                  <span>Successfully subscribed!</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </form>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="border-t border-gray-800/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Certcy. All rights reserved.
            </p>
            <div className="flex items-center text-sm text-gray-500 group">
              <span>Made with</span>
              <Heart 
                size={14} 
                className="mx-1.5 transition-transform duration-300 group-hover:scale-125" 
                style={{ color: theme.lilac }} 
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
    <Link 
      href="#" 
      aria-label={label}
      className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-periwinkle/20
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-periwinkle"
      style={{ 
        background: `linear-gradient(135deg, ${theme.periwinkle}20, ${theme.lilac}20)`,
        color: theme.periwinkle
      }}
    >
      {icon}
    </Link>
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
          <span 
            className="transition-colors duration-300"
            style={{ color: theme.lilac }}
          >
            {icon}
          </span>
        )}
        <span className="relative">
          {text}
          <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
        </span>
      </Link>
    </li>
  );
}



export default Footer;