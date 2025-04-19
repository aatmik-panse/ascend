"use client";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import { NewNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { kaushan_script } from "../fonts";
import { Building, Users, Target, Award, BarChart3, Globe } from "lucide-react";
import { TextReveal } from "@/components/magicui/text-reveal";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  // Team data (replace with actual team info)
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      bio: "Former career advisor with 10+ years experience in workforce development.",
    },
    {
      name: "Maya Patel",
      role: "Chief Technology Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      bio: "AI pioneer with background at leading tech companies.",
    },
    {
      name: "David Kim",
      role: "Head of Data Science",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      bio: "PhD in Machine Learning with expertise in labor market dynamics.",
    },
    {
      name: "Sarah Thompson",
      role: "Chief Marketing Officer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      bio: "Career transition expert and startup growth strategist.",
    },
  ];

  const values = [
    {
      title: "Data-Driven Insights",
      description:
        "We leverage advanced analytics and machine learning to provide accurate, actionable career guidance.",
      icon: BarChart3,
    },
    {
      title: "User-Centered Design",
      description:
        "Every feature is built with our users' career success and experience at the forefront.",
      icon: Users,
    },
    {
      title: "Continuous Innovation",
      description:
        "We're constantly evolving our technology to stay ahead of changing career landscapes.",
      icon: Target,
    },
    {
      title: "Ethical AI",
      description:
        "We develop our AI systems with transparency, fairness, and user privacy as core principles.",
      icon: Award,
    },
    {
      title: "Global Perspective",
      description:
        "We consider workforce trends across industries and geographies for comprehensive insights.",
      icon: Globe,
    },
    {
      title: "Long-term Impact",
      description:
        "We're committed to creating lasting positive change in how people navigate their careers.",
      icon: Building,
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | Certcy</title>
        <meta
          name="description"
          content="Learn about Certcy's mission to transform career development through AI-powered insights and expert guidance."
        />
      </Head>

      <div className="fixed top-0 left-0 right-0 z-50">
        <NewNavbar />
      </div>

      <main className="min-h-screen bg-neutral-950 text-white pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40"
              )}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              >
                About{" "}
                <span className={`text-blue-400 ${kaushan_script.className}`}>
                  Certcy
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
              >
                We&apos;re on a mission to transform how professionals navigate
                career transitions with data-driven insights and expert
                guidance.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-neutral-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-blue-900/30"
                    style={{ height: "500px" }}
                  >
                    {/* <img
                      src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                      fill
                      alt="The Certcy team collaborating"
                      className="object-cover"
                    /> */}
                  </motion.div>
                  <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-blue-900/20 rounded-2xl -z-10 blur-sm"></div>
                </div>

                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text"
                  >
                    Our Story
                  </motion.h2>

                  <div className="space-y-5 text-gray-300">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      Certcy was founded in 2021 with a simple yet powerful
                      vision: to create a world where career transitions are
                      opportunities for growth rather than moments of anxiety.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Our founder, Alex Johnson, experienced firsthand the
                      challenges of navigating career changes during economic
                      downturns. After spending years advising professionals on
                      their career paths, Alex recognized that most people
                      lacked access to the data-driven insights and strategic
                      guidance needed to make confident career decisions.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      By bringing together experts in AI, data science, career
                      development, and user experience, we&apos;ve built a
                      platform that helps thousands of professionals understand
                      their risk factors, identify new opportunities, and
                      strategically position themselves for success—even in
                      uncertain times.
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section with TextReveal */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-blue-900/30 to-violet-900/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                  Our Mission
                </h2>
              </div>

              <TextReveal
                bgColor="#0f172a"
                fgColor="#ffffff"
                sectionBgColor="transparent"
                sectionHeight="auto"
                staggerAmount={0.03}
                duration={0.3}
                className="text-lg md:text-xl leading-relaxed"
                style={{ fontSize: "1.5rem" }}
              >
                At Certcy, we&apos;re building a future where career transitions
                are no longer guided by fear and uncertainty, but by clarity and
                confidence. We believe that with the right data, insights, and
                guidance, everyone can navigate the evolving career landscape
                successfully. We&apos;re committed to democratizing access to
                career intelligence and empowering professionals everywhere to
                take control of their career trajectories—no matter what
                economic challenges arise.
              </TextReveal>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-neutral-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                  Our Values
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  These core principles guide everything we do at Certcy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-neutral-800 p-8 rounded-xl shadow-md border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300"
                  >
                    <div className="mb-4 rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {value.title}
                    </h3>
                    <p className="text-gray-400">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-neutral-950">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                  Meet Our Team
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  We&apos;re a diverse group of experts passionate about
                  transforming career development.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-neutral-800 rounded-xl overflow-hidden shadow-md border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300 group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {/* <Image
                        src={member.image}
                        fill
                        alt={member.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      /> */}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1 text-white">
                        {member.name}
                      </h3>
                      <p className="text-blue-400 mb-4">{member.role}</p>
                      <p className="text-gray-400 text-sm">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-violet-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.3),transparent_70%)] pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Us on Our Mission
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Be part of the future of career development. Try Certcy today
                and transform how you navigate your professional journey.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  className="bg-white text-blue-600 font-medium py-6 px-8 rounded-lg shadow-lg hover:shadow-blue-500/10 hover:bg-white/95 transition-all duration-300 text-lg"
                >
                  <a href="/sign-up">Get Started Today</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
