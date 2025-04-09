"use client";
import React from "react";
import { Shield } from "lucide-react";

const theme = {
  periwinkle: "var(--color-periwinkle, #8A85FF)",
  lilac: "var(--color-lilac, #C8A2FF)",
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: `${theme.periwinkle}15` }}
          >
            <Shield className="w-8 h-8" style={{ color: theme.periwinkle }} />
          </div>
          <h1
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.periwinkle} 0%, ${theme.lilac} 100%)`,
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. Introduction
            </h2>
            <p>
              At Certcy, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our career development platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-white">
                2.1 Personal Information
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Professional information</li>
                <li>Career history and goals</li>
                <li>Profile information</li>
              </ul>

              <h3 className="text-xl font-medium text-white">2.2 Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log data and device information</li>
                <li>Usage patterns and preferences</li>
                <li>Interaction with our services</li>
                <li>Performance metrics</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To personalize your experience</li>
              <li>To improve our platform</li>
              <li>To communicate with you</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              information. You may also request a copy of your data or withdraw
              your consent at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
              <br />
              <a
                href="mailto:privacy@Certcy.com"
                className="text-blue-400 hover:text-blue-300"
              >
                privacy@Certcy.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
