import React from 'react';
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
  Brain 
} from 'lucide-react';

// Theme colors based on provided values
const theme = {
  periwinkle: 'var(--color-periwinkle, #8A85FF)',
  lilac: 'var(--color-lilac, #C8A2FF)',
};

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section with Logo and Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)` 
                }}>
                ascend.
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Transforming careers into exciting journeys of growth and achievement through AI-powered strategies.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>
          </div>
          
          {/* Features Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Features</h3>
            <ul className="space-y-3">
              <FooterLink icon={<Shield size={16} />} text="AI Risk Shield" />
              <FooterLink icon={<Target size={16} />} text="Strategic Pivots" />
              <FooterLink icon={<Network size={16} />} text="Network Boost" />
              <FooterLink icon={<Brain size={16} />} text="Skill Tree" />
            </ul>
          </div>
          
          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Blog" />
              <FooterLink text="Press" />
            </ul>
          </div>
          
          {/* Resources Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-6">Resources</h3>
            <ul className="space-y-3">
              <FooterLink text="Documentation" />
              <FooterLink text="Support" />
              <FooterLink text="Privacy Policy" href="/privacy-policy"/>
              <FooterLink text="Terms of Service" />
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-10 pb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Join our newsletter</h3>
            <p className="text-gray-400 text-sm mb-6">
              Stay updated with the latest career strategies and platform features
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-gray-700"
              />
              <button
                className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                style={{ 
                  background: `linear-gradient(to right, ${theme.periwinkle}, ${theme.lilac})`,
                }}
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} ascend. All rights reserved.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart size={14} className="mx-1" style={{ color: theme.lilac }} />
              <span>for career enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function SocialIcon({ icon }) {
  return (
    <Link 
      href="#" 
      className="p-2 rounded-full transition-all hover:scale-110"
      style={{ 
        background: `${theme.periwinkle}15`,
        color: theme.periwinkle
      }}
    >
      {icon}
    </Link>
  );

}

function FooterLink({ icon, text , href = ""}) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition-colors flex items-center">
        {icon && <span className="mr-2" style={{ color: theme.lilac }}>{icon}</span>}
        <span>{text}</span>
      </Link>
    </li>
  );
}

export default Footer;