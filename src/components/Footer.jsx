"use client";
import React from "react";
import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Heart,
  ChevronRight,
} from "lucide-react";
import { kaushan_script } from "@/app/fonts";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and company info */}
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <h2 className={`text-2xl font-bold ${kaushan_script.className}`}>
                Certcy
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Transforming careers through AI-powered strategies and data-driven
              insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <FooterLink text="About Us" href="/about-us" />
              {/* <FooterLink text="Features" /> */}
              <FooterLink text="Blog" href="/blog" />
              <FooterLink text="Support" href="/support" />
              <FooterLink text="Privacy Policy" href="/privacy-policy" />
              <FooterLink text="Terms of Service" href="terms-of-service" />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2">Contact</h3>
            <p className="text-gray-600 text-sm flex items-center">
              <Mail size={16} className="mr-2" />
              hello@certcy.com
            </p>

            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Follow us
              </h4>
              <div className="flex space-x-3">
                <SocialIcon icon={<Twitter size={16} />} label="Twitter" />
                <SocialIcon icon={<Linkedin size={16} />} label="LinkedIn" />
                <SocialIcon icon={<Instagram size={16} />} label="Instagram" />
              </div>
            </div>
          </div>
        </div>

        {/* Simple divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Copyright section simplified */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} Certcy. All rights reserved.
          </p>

          <div className="flex items-center text-sm text-gray-600">
            <span>Made with</span>
            <Heart size={12} className="mx-1.5 text-gray-600" />
            <span>for career enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:text-black hover:border-gray-600 transition-colors"
    >
      {icon}
    </a>
  );
}

function FooterLink({ text, href = "#" }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-black transition-colors text-sm flex items-center"
    >
      <span className="hover:underline">{text}</span>
      <ChevronRight size={12} className="ml-1 opacity-50" />
    </Link>
  );
}

export default Footer;
