"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function CareerOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [touchStartY, setTouchStartY] = useState(0);
  const formRef = useRef(null);

  // Add a boolean state to track when onboarding is completed
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // States for midpoint achievement message
  const [showMidpointMessage, setShowMidpointMessage] = useState(false);
  const [midpointMessageShownThisSession, setMidpointMessageShownThisSession] = useState(false);

  // Build initial form data for 50 questions
  const initialForm = questions.reduce((acc, q) => {
    if (q.type === "checkbox") acc[q.field] = [];
    else if (q.type === "scale") acc[q.field] = "";
    else acc[q.field] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialForm);
  const [submissionRequested, setSubmissionRequested] = useState(false);
  const inputRefs = useRef({});

  // totalQuestions = index of confirm step
  const totalQuestions = questions.findIndex((q) => q.id === "confirm");

  // Constants for question indexing
  const FIRST_QUESTION_INDEX = 1; // Index of 'q1' in the questions array
  const LAST_QUESTION_INDEX = 50;  // Index of 'q50' in the questions array
  const TOTAL_CAMPAIGN_QUESTIONS = 50;
  const TWENTY_FIFTH_QUESTION_INDEX = 25; // Index of 'q25'

  // Fix mobile viewport height issues
  useEffect(() => {
    const setCorrectHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    setCorrectHeight();
    window.addEventListener("resize", setCorrectHeight);
    return () => window.removeEventListener("resize", setCorrectHeight);
  }, []);

  // Handle background parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setBackgroundPosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      const inInput =
        e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      if (e.key === "Enter" && !e.shiftKey && !inInput) nextStep();
      if (e.key === "ArrowUp") prevStep();
      if (e.key === "ArrowDown") nextStep();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep]);

  // Touch gestures for mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Swipe up = next, swipe down = prev (with threshold)
      if (diff > 50) nextStep();
      else if (diff < -50) prevStep();
    };

    const element = formRef.current;
    if (element) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [touchStartY, currentStep]);

  useEffect(() => {
    setValidationError(false);
    const cur = questions[currentStep];
    if (cur?.field && inputRefs.current[cur.field]) {
      setTimeout(() => inputRefs.current[cur.field].focus(), 400);
    }

    // Midpoint achievement message logic
    if (currentStep === TWENTY_FIFTH_QUESTION_INDEX + 1 && !midpointMessageShownThisSession) {
      setShowMidpointMessage(true);
      setMidpointMessageShownThisSession(true);
      setTimeout(() => {
        setShowMidpointMessage(false);
      }, 5000); // Show message for 5 seconds
    }
  }, [currentStep, midpointMessageShownThisSession]);

  // Add a useEffect to redirect to dashboard after showing completion message
  useEffect(() => {
    // Check if we're on the complete step
    if (currentStep === questions.length - 1) {
      // Mark onboarding as completed
      setOnboardingCompleted(true);

      // Set a timeout to redirect to dashboard after showing completion message
      const redirectTimer = setTimeout(() => {
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
      }, 3000); // 3 second delay

      // Clear the timeout if the component unmounts
      return () => clearTimeout(redirectTimer);
    }
  }, [currentStep, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError(false);
  };

  const handleCheckboxChange = (field, option) => {
    const arr = formData[field] || [];
    const updated = arr.includes(option)
      ? arr.filter((o) => o !== option)
      : [...arr, option];
    setFormData({ ...formData, [field]: updated });
    setValidationError(false);
  };

  const handleScaleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setValidationError(false);

    // Auto-advance after scale selection with delay
    if (value) {
      setTimeout(() => {
        if (validateCurrent()) nextStep();
      }, 800);
    }
  };

  const validateCurrent = () => {
    const cur = questions[currentStep];
    if (!cur.field) return true;
    if (cur.optional) return true;
    const val = formData[cur.field];
    if (cur.type === "checkbox") return val.length > 0;
    return val.toString().trim() !== "";
  };

  const validateAll = () => {
    const missing = questions
      .filter((q) => q.field && !q.optional)
      .filter((q) => {
        const v = formData[q.field];
        if (q.type === "checkbox") return v.length === 0;
        return v.toString().trim() === "";
      })
      .map((q) => q.title);
    return { isValid: missing.length === 0, missing };
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      await new Promise((r) => setTimeout(r, 600));
      setCurrentStep(currentStep + 1);
      setSubmissionRequested(false);
    } catch (err) {
      setSubmissionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    setSubmissionRequested(true);
    const { isValid, missing } = validateAll();
    if (isValid) submitForm();
    else {
      setSubmissionError(`Please complete: ${missing.join(", ")}`);
      setValidationError(true);
      // Find first incomplete question and go there
      const firstMissingQ = questions.findIndex((q) =>
        missing.includes(q.title)
      );
      if (firstMissingQ > 0) setCurrentStep(firstMissingQ);
    }
  };

  const nextStep = () => {
    if (currentStep < totalQuestions) {
      if (validateCurrent()) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else setValidationError(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const getProgress = () =>
    currentStep === 0
      ? 0
      : currentStep > totalQuestions
      ? 100
      : Math.round((currentStep / totalQuestions) * 100);

  const current = questions[currentStep];

  const renderScale = () => {
    const val = formData[current.field];
    return (
      <div className="w-full max-w-md mt-6 px-4">
        <div className="flex justify-between mb-3 text-sm text-gray-400">
          <span>Not at all</span>
          <span>Very much</span>
        </div>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleScaleChange(current.field, num.toString())}
              className={cn(
                "w-full h-16 rounded-lg text-lg font-medium transition-all duration-300 transform",
                val === num.toString()
                  ? "bg-white text-black scale-105 shadow-lg"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderField = () => {
    if (!current.field) return null;
    const val = formData[current.field];

    switch (current.type) {
      case "text":
        return (
          <div className="w-full max-w-md mt-6">
            <Input
              ref={(el) => (inputRefs.current[current.field] = el)}
              name={current.field}
              value={val}
              onChange={handleInputChange}
              placeholder="Type your answer..."
              className={cn(
                "w-full text-xl h-14 bg-transparent border-b-2 border-gray-300 focus-visible:ring-0 focus-visible:border-white placeholder:text-gray-500",
                validationError && "border-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  nextStep();
                }
              }}
              required={!current.optional}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="w-full max-w-md mt-6">
            <Textarea
              ref={(el) => (inputRefs.current[current.field] = el)}
              name={current.field}
              value={val}
              onChange={handleInputChange}
              placeholder="Type your answer..."
              className={cn(
                "w-full text-lg h-36 bg-transparent border-2 border-gray-700 rounded-xl px-4 py-3 focus-visible:ring-0 focus-visible:border-white focus-visible:bg-gray-800/50 placeholder:text-gray-500 transition-all duration-300",
                validationError && "border-red-500"
              )}
              required={!current.optional}
            />
          </div>
        );
      case "radio":
        return (
          <div className="space-y-3 w-full max-w-md mt-6">
            {current.options.map((opt) => (
              <motion.button
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, [current.field]: opt });
                  setTimeout(() => {
                    if (validateCurrent()) nextStep();
                  }, 500);
                }}
                className={cn(
                  "w-full text-left px-5 py-4 border-2 rounded-xl text-lg flex justify-between items-center transition-all duration-300",
                  val === opt
                    ? "border-white bg-white text-black font-medium"
                    : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{opt}</span>
                {val === opt && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-3 w-full max-w-md mt-6">
            {current.options.map((opt) => (
              <motion.button
                key={opt}
                onClick={() => handleCheckboxChange(current.field, opt)}
                className={cn(
                  "w-full text-left px-5 py-4 border-2 rounded-xl text-lg flex justify-between items-center transition-all duration-300",
                  val.includes(opt)
                    ? "border-white bg-white text-black font-medium"
                    : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{opt}</span>
                {val.includes(opt) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        );
      case "scale":
        return renderScale();
      default:
        return null;
    }
  };

  const backgroundStyle = {
    backgroundImage:
      "radial-gradient(circle at 50% 50%, #3a3a3a 0%, #1a1a1a 100%)",
    backgroundPosition: `calc(50% + ${backgroundPosition.x}px) calc(50% + ${backgroundPosition.y}px)`,
  };

  return (
    <div
      ref={formRef}
      className="fixed inset-0 text-white overflow-hidden"
      style={{ height: viewportHeight }}
    >
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        // style={backgroundStyle}
      />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <motion.div
          className="h-full bg-white"
          initial={{ width: `${getProgress()}%` }}
          animate={{ width: `${getProgress()}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Container */}
      <div className="w-full h-full flex flex-col relative z-1">
        {/* Navigation */}
        {currentStep > 0 && currentStep <= totalQuestions && (
          <div className="flex justify-between py-4 px-4 sm:px-6 md:px-10">
            <motion.button
              onClick={prevStep}
              className="text-gray-400 hover:text-white flex items-center"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>
            <div className="text-gray-400 text-xs sm:text-sm">
              {currentStep} of {totalQuestions}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 overflow-y-auto">
          <div className="w-full max-w-xl mx-auto my-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col"
              >
                {/* Remaining Questions Counter */}
                {currentStep >= FIRST_QUESTION_INDEX && currentStep <= LAST_QUESTION_INDEX && (
                  <div className="mb-2 text-right text-sm text-sky-400">
                    Question {(LAST_QUESTION_INDEX - currentStep) + 1} of {TOTAL_CAMPAIGN_QUESTIONS}
                  </div>
                )}

                {/* Midpoint Achievement Message */}
                {showMidpointMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-md text-center text-sm"
                  >
                    Awesome! You're halfway there. Keep up the great work!
                  </motion.div>
                )}

                {/* Question */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4 leading-tight">
                  {current.title}
                </h1>

                {current.subtitle && (
                  <p className="text-base sm:text-xl text-gray-300 mb-2">
                    {current.subtitle}
                  </p>
                )}

                {current.description && (
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    {current.description}
                  </p>
                )}

                {/* Form Field */}
                {renderField()}

                {/* Validation Error */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-400 flex items-center"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Please answer this question</span>
                  </motion.div>
                )}

                {/* Submission Error */}
                {currentStep === totalQuestions && submissionError && (
                  <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-xl flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-10">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentStep === totalQuestions) handleConfirm();
                      else nextStep();
                    }}
                    disabled={isSubmitting}
                    className={cn(
                      "h-14 px-8 bg-white text-black rounded-full flex items-center justify-center font-medium text-lg",
                      isSubmitting && "opacity-80"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        <span>Processing...</span>
                      </>
                    ) : currentStep === 0 ? (
                      "Start"
                    ) : currentStep === totalQuestions ? (
                      "Submit"
                    ) : (
                      <>
                        Continue
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 1.5,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Hint for keyboard/mobile navigation */}
                {currentStep > 0 && currentStep < totalQuestions && (
                  <div className="mt-6 text-center text-gray-500 text-xs">
                    Use ↑↓ arrows or swipe to navigate
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="md:hidden fixed bottom-6 right-6 flex flex-col space-y-3 z-10">
        <motion.button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={cn(
            "w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center",
            currentStep === 0 && "opacity-0 pointer-events-none"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
        <motion.button
          onClick={nextStep}
          disabled={currentStep >= totalQuestions}
          className={cn(
            "w-12 h-12 bg-white text-black rounded-full flex items-center justify-center",
            currentStep >= totalQuestions && "opacity-0 pointer-events-none"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Add a transition message when redirecting */}
      {onboardingCompleted && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-black p-8 rounded-xl max-w-md text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Redirecting you now!</h2>
            <p className="text-gray-600">
              Taking you to your personalized dashboard...
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Questions array (welcome, 50 q's, confirm, complete)
const questions = [
  {
    id: "welcome",
    title: "Welcome to Certcy!",
    subtitle: "We'll analyze your profile …",
  },
  // Q1–Q50
  {
    id: "q1",
    title: "On most workdays, how do you feel about your job?",
    field: "q1",
    type: "radio",
    options: [
      "Energized and engaged",
      "Neutral — I just do it",
      "Tired and uninterested",
      "Emotionally drained or anxious",
    ],
  },
  {
    id: "q2",
    title: "How often do you feel like your potential is being underutilized?",
    field: "q2",
    type: "scale",
  },
  {
    id: "q3",
    title:
      "Describe a recent day at work that made you feel frustrated or disengaged. Why did you feel that way?",
    field: "q3",
    type: "textarea",
  },
  {
    id: "q4",
    title: "What's your main reason for considering a pivot?",
    field: "q4",
    type: "checkbox",
    options: [
      "I feel stuck and see no growth",
      "I'm not passionate about my current work",
      "I want more flexibility or a better lifestyle",
      "I'm burned out and mentally exhausted",
      "I want to follow a different passion or purpose",
      "I'm curious about other industries or roles",
      "I'm afraid of becoming irrelevant in my field",
    ],
  },
  {
    id: "q5",
    title: "Are you running away from pain or toward opportunity? Explain.",
    field: "q5",
    type: "textarea",
  },
  {
    id: "q6",
    title: "What are your top 3 professional strengths?",
    field: "q6",
    type: "textarea",
  },
  {
    id: "q7",
    title: "Which of the following energize you the most?",
    field: "q7",
    type: "checkbox",
    options: [
      "Solving complex problems",
      "Creating or designing things",
      "Helping others succeed",
      "Analyzing data or patterns",
      "Leading people or projects",
      "Communicating ideas",
      "Building things from scratch",
      "Working independently",
      "Exploring ideas and research",
    ],
  },
  {
    id: "q8",
    title:
      "What's one skill you'd love to use more in your work but currently can't? Why?",
    field: "q8",
    type: "textarea",
  },
  {
    id: "q9",
    title:
      "How clearly do you know which industry or role you want to pivot into?",
    field: "q9",
    type: "scale",
  },
  {
    id: "q10",
    title: "Which of these career pivots would interest you?",
    field: "q10",
    type: "checkbox",
    options: [
      "Something more creative",
      "Something more technical",
      "A startup or entrepreneurial path",
      "Freelance/consulting",
      "Public sector, NGOs, or mission-driven orgs",
      "A less stressful, more balanced job",
    ],
    optional: false,
  },
  {
    id: "q11",
    title:
      "Describe what your ideal workday looks like 1 year from now. Where are you? What are you doing? How do you feel?",
    field: "q11",
    type: "textarea",
  },
  {
    id: "q12",
    title:
      "How much time and effort are you willing to invest in reskilling or training?",
    field: "q12",
    type: "radio",
    options: [
      "Less than 3 months",
      "3–6 months part-time",
      "6–12 months serious effort",
      "I'd consider going back to school if needed",
    ],
  },
  {
    id: "q13",
    title: "How financially prepared are you for a transition?",
    field: "q13",
    type: "scale",
  },
  {
    id: "q14",
    title:
      "What specific new skills or certifications might you need to pivot?",
    field: "q14",
    type: "textarea",
  },
  {
    id: "q15",
    title:
      "Are you mentally prepared to start from scratch or even take a pay cut?",
    field: "q15",
    type: "radio",
    options: [
      "Yes, I'm okay with it",
      "Maybe, if the outcome is worth it",
      "No, I can't afford to go backward",
    ],
  },
  {
    id: "q16",
    title: "How do you generally handle uncertainty or starting new things?",
    field: "q16",
    type: "textarea",
  },
  {
    id: "q17",
    title: "Who will support your career change?",
    field: "q17",
    type: "checkbox",
    options: [
      "Family",
      "Friends",
      "Mentor or Coach",
      "Online Communities",
      "No one yet",
    ],
  },
  {
    id: "q18",
    title:
      "If you don't pivot now, what might your life look like in 1–2 years?",
    field: "q18",
    type: "textarea",
  },
  {
    id: "q19",
    title:
      "What's the worst-case scenario if you try and fail? Can you live with it?",
    field: "q19",
    type: "textarea",
  },
  {
    id: "q20",
    title: "What's the best-case scenario if you succeed?",
    field: "q20",
    type: "textarea",
  },
  {
    id: "q21",
    title:
      "What personal values do you feel your current role violates or ignores?",
    field: "q21",
    type: "textarea",
  },
  {
    id: "q22",
    title: "Which values must your future role absolutely align with?",
    field: "q22",
    type: "textarea",
  },
  {
    id: "q23",
    title:
      "If your career were a book, what chapter are you in right now? What's the title of the next one?",
    field: "q23",
    type: "textarea",
  },
  {
    id: "q24",
    title: "How strongly do you identify with your current role/title?",
    field: "q24",
    type: "scale",
  },
  {
    id: "q25",
    title:
      "What part of your identity are you afraid of losing if you change careers?",
    field: "q25",
    type: "textarea",
  },
  {
    id: "q26",
    title: "What stage of life are you in right now?",
    field: "q26",
    type: "radio",
    options: [
      "Early career / exploring",
      "Mid-career / stuck or plateaued",
      "Career rebuild after burnout or break",
      "Late career / seeking legacy or balance",
      "Other",
    ],
  },
  {
    id: "q27",
    title: "Why is now the right (or wrong) time to pivot?",
    field: "q27",
    type: "textarea",
  },
  {
    id: "q28",
    title: "Is there a \"deadline\" for your pivot due to personal/life factors?",
    field: "q28",
    type: "radio",
    options: [
      "Yes, within 3 months",
      "Yes, within 1 year",
      "Not really, it's open-ended",
      "I don't know",
    ],
  },
  {
    id: "q29",
    title:
      "List 5 transferable skills you could take with you to any new role or industry.",
    field: "q29",
    type: "textarea",
  },
  {
    id: "q30",
    title:
      "Which of your current skills are least valued in your industry but highly valuable elsewhere?",
    field: "q30",
    type: "textarea",
  },
  {
    id: "q31",
    title:
      "What types of roles or industries have you been told you'd be good at?",
    field: "q31",
    type: "textarea",
  },
  {
    id: "q32",
    title:
      "Who is already doing what you want to do? What can you learn from them?",
    field: "q32",
    type: "textarea",
  },
  {
    id: "q33",
    title:
      "How strong is your current professional network in your desired pivot area?",
    field: "q33",
    type: "scale",
  },
  {
    id: "q34",
    title: "What fears come up when you think about pivoting?",
    field: "q34",
    type: "textarea",
  },
  {
    id: "q35",
    title:
      "What's holding you back the most — fear of the unknown, failure, judgment, money, time, or something else?",
    field: "q35",
    type: "textarea",
  },
  {
    id: "q36",
    title:
      "What's one belief you have about career pivots that may not be true?",
    field: "q36",
    type: "textarea",
  },
  {
    id: "q37",
    title: "How much do others' opinions influence your career decisions?",
    field: "q37",
    type: "scale",
  },
  {
    id: "q38",
    title:
      "Has fear ever stopped you from making a bold move in the past? What happened?",
    field: "q38",
    type: "textarea",
  },
  {
    id: "q39",
    title:
      "Have you tried experimenting with the new field before (freelance, shadowing, side project, online course)?",
    field: "q39",
    type: "radio",
    options: [
      "Yes, actively testing it",
      "I've done a bit, but not enough",
      "Not yet, but I plan to",
      "No, I have no idea how to",
    ],
  },
  {
    id: "q40",
    title:
      "What's a small experiment or pilot you could do this month to test your pivot?",
    field: "q40",
    type: "textarea",
  },
  {
    id: "q41",
    title: "What does your version of a \"safe pivot\" look.like?",
    field: "q41",
    type: "textarea",
  },
  {
    id: "q42",
    title:
      "How long would you be willing to stay in an in-between or bridge role to reach your target?",
    field: "q42",
    type: "radio",
    options: [
      "1–3 months",
      "3–6 months",
      "6–12 months",
      "I'm not willing to wait",
    ],
  },
  {
    id: "q43",
    title:
      "Are industry trends forcing your hand (e.g. AI disruption, layoffs, role obsolescence)?",
    field: "q43",
    type: "textarea",
  },
  {
    id: "q44",
    title:
      "Are your current peers growing faster than you? How do you feel about it?",
    field: "q44",
    type: "textarea",
  },
  {
    id: "q45",
    title:
      "Has someone close to you made a pivot? What did you observe or learn?",
    field: "q45",
    type: "textarea",
  },
  {
    id: "q46",
    title:
      "What signals (in your company, industry, or economy) are telling you it's time to move?",
    field: "q46",
    type: "textarea",
  },
  {
    id: "q47",
    title:
      "When was the last time you felt truly alive at work? What were you doing?",
    field: "q47",
    type: "textarea",
  },
  {
    id: "q48",
    title:
      "If money, status, or time didn't matter, what would you love to do all day?",
    field: "q48",
    type: "textarea",
  },
  {
    id: "q49",
    title: "What do others consistently praise you for — even outside work?",
    field: "q49",
    type: "textarea",
  },
  {
    id: "q50",
    title:
      "What's your personal definition of success? Has it changed recently?",
    field: "q50",
    type: "textarea",
  },
  { id: "confirm", title: "Great! Review & Submit" },
  {
    id: "complete",
    title: "All set! 🎉",
    subtitle: "Your personalized pivot report is on its way.",
  },
];
