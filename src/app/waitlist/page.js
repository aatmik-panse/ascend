"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { addToWaitlist } from "@/utils/api";
import { NewNavbar } from "@/components/Navbar";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addToWaitlist({ email });
      toast.success("You have been added to the waitlist!");
      setEmail("");
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Join Our Waitlist | Certcy</title>
        <meta
          name="description"
          content="Be the first to experience Certcy. Join our waitlist for early access."
        />
      </Head>

      {/* Add navbar outside the main content div with fixed positioning */}
      <div className="fixed top-0 left-0 right-0 z-50 ">
        <NewNavbar />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 pt-16">
        <Toaster position="top-center" />
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Join Our Waitlist
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Be among the first to experience Certcy and unlock your career
              potential. Sign up below for early access.
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join the Waitlist"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Why Join?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-white shadow">
                <h3 className="font-medium text-lg mb-2">Early Access</h3>
                <p className="text-gray-600">
                  Be the first to experience our platform and new features.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <h3 className="font-medium text-lg mb-2">Exclusive Benefits</h3>
                <p className="text-gray-600">
                  Special pricing and promotions for our early supporters.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow">
                <h3 className="font-medium text-lg mb-2">Shape the Future</h3>
                <p className="text-gray-600">
                  Provide feedback that will influence our product development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
