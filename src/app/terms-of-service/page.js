"use client";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { NewNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "February 15, 2025";

  return (
    <>
      <Head>
        <title>Terms of Service | Certcy</title>
        <meta
          name="description"
          content="Certcy's Terms of Service. Please read these terms carefully before using our platform."
        />
      </Head>

      <div className="fixed top-0 left-0 right-0 z-50">
        <NewNavbar />
      </div>

      <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16">
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40"
              )}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center mb-8">
                <div className="p-3 rounded-full bg-blue-900/30">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text text-center">
                Terms of Service
              </h1>
              <p className="text-gray-400 mb-4 text-center">
                Last updated: {lastUpdated}
              </p>
              <p className="text-gray-300 mb-8">
                Please read these Terms of Service (&quot;Terms&quot;,
                &quot;Terms of Service&quot;) carefully before using the Certcy
                website and platform (the &quot;Service&quot;) operated by
                Certcy, Inc. (&quot;us&quot;, &quot;we&quot;, or
                &quot;our&quot;).
              </p>

              <p className="mb-4">
                By accessing and using the Certcy platform
                (&quot;Service&quot;), you agree to these Terms of Service
                (&quot;Terms&quot;). If you don&apos;t agree with these Terms,
                please don&apos;t use our Service.
              </p>

              <p className="mb-4">
                These &quot;Terms&quot; constitute a legally binding agreement
                between you and Certcy, Inc. (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) regarding your use of the Service.
              </p>

              <div className="prose prose-invert prose-lg max-w-none">
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-300">
                    By accessing or using the Service, you agree to be bound by
                    these Terms. If you disagree with any part of the terms,
                    then you may not access the Service.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    2. Description of Service
                  </h2>
                  <p className="text-gray-300">
                    Certcy provides a career development platform that offers
                    career insights, layoff risk assessments, skill
                    recommendations, networking tools, and related services. The
                    specific features and functionality may change over time.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    3. Accounts
                  </h2>
                  <p className="text-gray-300">
                    When you create an account with us, you must provide
                    information that is accurate, complete, and current at all
                    times. Failure to do so constitutes a breach of the Terms,
                    which may result in immediate termination of your account on
                    our Service.
                  </p>
                  <p className="mt-3 text-gray-300">
                    You are responsible for safeguarding the password that you
                    use to access the Service and for any activities or actions
                    under your password. You agree not to disclose your password
                    to any third party. You must notify us immediately upon
                    becoming aware of any breach of security or unauthorized use
                    of your account.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    4. Subscription and Payment
                  </h2>
                  <p className="text-gray-300">
                    Some parts of the Service are billed on a subscription
                    basis. You will be billed in advance on a recurring and
                    periodic basis, depending on the type of subscription plan
                    you select.
                  </p>
                  <p className="mt-3 text-gray-300">
                    At the end of each period, your subscription will
                    automatically renew under the exact same conditions unless
                    you cancel it or we cancel it. You may cancel your
                    subscription either through your online account management
                    page or by contacting our customer support team.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    5. Free Trial
                  </h2>
                  <p className="text-gray-300">
                    We may, at our sole discretion, offer a subscription with a
                    free trial for a limited period of time. You may be required
                    to enter your billing information to sign up for the free
                    trial.
                  </p>
                  <p className="mt-3 text-gray-300">
                    If you do not cancel your subscription before the end of the
                    free trial period, you will be automatically charged for the
                    subscription.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    6. Intellectual Property
                  </h2>
                  <p className="text-gray-300">
                    The Service and its original content, features, and
                    functionality are and will remain the exclusive property of
                    Certcy, Inc. and its licensors. The Service is protected by
                    copyright, trademark, and other laws of both the United
                    States and foreign countries. Our trademarks and trade dress
                    may not be used in connection with any product or service
                    without the prior written consent of Certcy, Inc.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    7. User Content
                  </h2>
                  <p className="text-gray-300">
                    Our Service allows you to post, link, store, share and
                    otherwise make available certain information, text,
                    graphics, videos, or other material. You are responsible for
                    the content that you post to the Service, including its
                    legality, reliability, and appropriateness.
                  </p>
                  <p className="mt-3 text-gray-300">
                    By posting content to the Service, you grant us the right
                    and license to use, modify, publicly perform, publicly
                    display, reproduce, and distribute such content on and
                    through the Service. You retain any and all of your rights
                    to any content you submit, post or display on or through the
                    Service.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    8. Limitation of Liability
                  </h2>
                  <p className="text-gray-300">
                    In no event shall Certcy, Inc., nor its directors,
                    employees, partners, agents, suppliers, or affiliates, be
                    liable for any indirect, incidental, special, consequential
                    or punitive damages, including without limitation, loss of
                    profits, data, use, goodwill, or other intangible losses,
                    resulting from:
                  </p>
                  <ul className="list-disc pl-6 mt-3 text-gray-300">
                    <li>
                      Your access to or use of or inability to access or use the
                      Service;
                    </li>
                    <li>
                      Any conduct or content of any third party on the Service;
                    </li>
                    <li>Any content obtained from the Service; and</li>
                    <li>
                      Unauthorized access, use or alteration of your
                      transmissions or content.
                    </li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    9. Disclaimer
                  </h2>
                  <p className="text-gray-300">
                    Your use of the Service is at your sole risk. The Service is
                    provided on an &quot;AS IS&quot; and &quot;AS
                    AVAILABLE&quot; basis. The Service is provided without
                    warranties of any kind, whether express or implied,
                    including, but not limited to, implied warranties of
                    merchantability, fitness for a particular purpose,
                    non-infringement or course of performance.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    10. Governing Law
                  </h2>
                  <p className="text-gray-300">
                    These Terms shall be governed and construed in accordance
                    with the laws of the United States and the State of
                    California, without regard to its conflict of law
                    provisions.
                  </p>
                  <p className="mt-3 text-gray-300">
                    If we don&apos;t exercise a right or provision in these
                    Terms, that doesn&apos;t mean we&apos;ve waived it.
                  </p>
                  <p className="mt-3 text-gray-300">
                    If any provision of these Terms is found unenforceable, that
                    doesn&apos;t affect the validity of the remaining
                    provisions.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    11. Changes to Terms
                  </h2>
                  <p className="text-gray-300">
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will try to provide at least 30 days&apos; notice prior
                    to any new terms taking effect. What constitutes a material
                    change will be determined at our sole discretion.
                  </p>
                  <p className="mt-3 text-gray-300">
                    By continuing to access or use our Service after those
                    revisions become effective, you agree to be bound by the
                    revised terms. If you do not agree to the new terms, please
                    stop using the Service.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                    12. Contact Us
                  </h2>
                  <p className="text-gray-300">
                    If you have any questions about these Terms, please contact
                    us at:
                  </p>
                  <p className="mt-3 font-medium text-blue-400">
                    hello@certcy.com
                  </p>
                  <p className="mt-1 text-gray-300">
                    Certcy, Inc.
                    <br />
                    123 Innovation Way
                    <br />
                    San Francisco, CA 94105
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-800">
                <p className="text-gray-400">
                  By using Certcy&apos;s services, you acknowledge that you have
                  read and understand these Terms of Service and agree to be
                  bound by them.
                </p>
                <div className="mt-6 flex space-x-6">
                  <Link
                    href="/privacy-policy"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/support"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
