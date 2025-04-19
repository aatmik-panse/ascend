"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import { NewNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { motion } from "framer-motion";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with actual API call when ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending support request:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "How can Certcy help with my career transition?",
      answer:
        "Certcy provides AI-powered career insights, layoff risk assessments, skill recommendations, and personalized networking opportunities to help you navigate career transitions with confidence.",
    },
    {
      question: "Is my data secure with Certcy?",
      answer:
        "Yes, we take your privacy seriously. All personal data is encrypted, stored securely, and never shared with third parties without your explicit consent. Please see our Privacy Policy for more details.",
    },
    {
      question: "How much does Certcy cost?",
      answer:
        "Certcy offers several pricing tiers to accommodate different needs. We have a free basic plan and premium plans starting at $15/month. Visit our pricing page for detailed information.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely! You can cancel your subscription at any time through your account settings. There are no long-term commitments or cancellation fees.",
    },
    {
      question: "How accurate are the career insights and recommendations?",
      answer:
        "Our AI-powered recommendations are based on extensive labor market data, industry trends, and peer comparisons. While no prediction is 100% accurate, our algorithms are continuously improving through machine learning.",
    },
  ];

  return (
    <>
      <Head>
        <title>Support | Certcy</title>
        <meta
          name="description"
          content="Get help and support for Certcy's career evolution platform. Our team is ready to assist you."
        />
      </Head>

      <div className="fixed top-0 left-0 right-0 z-50">
        <NewNavbar />
      </div>

      <main className="min-h-screen bg-neutral-950 text-white pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40"
              )}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-blue-900/30">
                  <HelpCircle className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                We&apos;re Here To Help
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Get the support you need to navigate your career journey with
                confidence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-neutral-800 p-6 text-center rounded-xl border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300"
                >
                  <div className="rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Chat Support
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Get instant help from our support team through live chat.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-blue-800 bg-blue-900/20 text-blue-400 hover:bg-blue-800/30 hover:text-blue-300"
                  >
                    Start Chat
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-neutral-800 p-6 text-center rounded-xl border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300"
                >
                  <div className="rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Email Support
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Send us an email and we&apos;ll respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-blue-800 bg-blue-900/20 text-blue-400 hover:bg-blue-800/30 hover:text-blue-300"
                  >
                    Email Us
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-neutral-800 p-6 text-center rounded-xl border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300"
                >
                  <div className="rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Phone Support
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Call us directly for urgent matters during business hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-blue-800 bg-blue-900/20 text-blue-400 hover:bg-blue-800/30 hover:text-blue-300"
                  >
                    View Number
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-neutral-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-800"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4 text-gray-200 hover:text-blue-400 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-10 text-center">
                <p className="text-gray-400 mb-4">Still have questions?</p>
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  Contact Us <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-neutral-950 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                Get In Touch
              </h2>
              <p className="text-center text-gray-400 mb-10">
                Send us a message and we&apos;ll get back to you as soon as
                possible.
              </p>

              <Card className="bg-neutral-800 border border-blue-900/20 p-6 md:p-8 rounded-xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-neutral-900 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="bg-neutral-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className="bg-neutral-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-300">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your issue or question in detail..."
                      rows={5}
                      required
                      className="resize-none bg-neutral-900 border-gray-700 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
        <Toaster position="top-center" />
      </main>
      <Footer />
    </>
  );
}
