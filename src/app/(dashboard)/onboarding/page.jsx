"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  Briefcase,
  Building,
  Clock,
  TrendingUp,
  DollarSign,
  Award,
  Calendar,
  Linkedin,
  AlertCircle,
  Loader2,
  CheckCircle,
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
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    experience: "",
    jobStability: 3,
    salarRange: "",
    topSkills: ["", "", ""],
    timeForGrowth: "",
    linkedinUrl: "",
    biggestConcern: "",
  });

  const inputRefs = useRef({});
  const totalQuestions = 9;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        nextStep();
      }
      if (e.key === "ArrowUp") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  useEffect(() => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion?.field && inputRefs.current[currentQuestion.field]) {
      setTimeout(() => {
        inputRefs.current[currentQuestion.field].focus();
      }, 400);
    }
    // Clear validation error when step changes
    setValidationError(false);
  }, [currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when user types
    setValidationError(false);
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setValidationError(false);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.topSkills];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      topSkills: updatedSkills,
    });

    setValidationError(false);
  };

  const handleStabilityChange = (value) => {
    setFormData({
      ...formData,
      jobStability: value,
    });

    setTimeout(() => nextStep(), 500);
  };

  // Validate the current field
  const validateCurrentField = () => {
    const currentQuestion = questions[currentStep];

    // No validation needed for welcome, complete, and confirm screens
    if (
      currentQuestion.id === "welcome" ||
      currentQuestion.id === "complete" ||
      currentQuestion.id === "confirm"
    ) {
      return true;
    }

    // Skip validation for optional fields
    if (currentQuestion.optional) {
      return true;
    }

    // Special validation for skills (require at least one skill)
    if (currentQuestion.field === "topSkills") {
      return formData.topSkills.some((skill) => skill.trim() !== "");
    }

    // For regular fields, check if they're filled
    const fieldValue = formData[currentQuestion.field];
    return fieldValue !== undefined && fieldValue.toString().trim() !== "";
  };

  const submitFormData = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Get the Supabase client to access auth tokens
      const supabase = createClient();

      // Log the form data being submitted for debugging
      console.log("Submitting form data:", JSON.stringify(formData, null, 2));

      // Validate the biggestConcern field is included
      if (formData.biggestConcern === undefined) {
        console.error("biggestConcern field is undefined");
      }

      // Get the session which contains the access token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Prepare the data payload, explicitly including all fields
      const payload = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        experience: formData.experience,
        jobStability: formData.jobStability,
        salarRange: formData.salarRange,
        topSkills: formData.topSkills.filter(Boolean),
        timeForGrowth: formData.timeForGrowth,
        linkedinUrl: formData.linkedinUrl,
        biggestConcern: formData.biggestConcern,
      };

      console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

      // Make API request with authentication header
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the access token in the Authorization header if available
          ...(session?.access_token
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save onboarding data");
      }

      // Move to the completion step after successful submission
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalQuestions + 1) {
      if (currentStep === totalQuestions) {
        // For the submit step, we always need to proceed
        submitFormData();
      } else {
        // For other steps, validate the current field
        if (validateCurrentField()) {
          setCurrentStep(currentStep + 1);
          setValidationError(false);
        } else {
          setValidationError(true);
          // Focus on the input field if validation fails
          const currentQuestion = questions[currentStep];
          if (
            currentQuestion?.field &&
            inputRefs.current[currentQuestion.field]
          ) {
            inputRefs.current[currentQuestion.field].focus();
          } else if (currentQuestion.type === "skills") {
            // For skills, focus on the first empty input
            for (let i = 0; i < 3; i++) {
              if (!formData.topSkills[i] && inputRefs.current[`skill-${i}`]) {
                inputRefs.current[`skill-${i}`].focus();
                break;
              }
            }
          }
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationError(false);
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    if (currentStep === totalQuestions + 1) return 100;
    return (currentStep / (totalQuestions + 1)) * 100;
  };

  const questions = [
    {
      id: "welcome",
      title: "Welcome to CareerCompass",
      subtitle: "Let's personalize your career growth journey",
      description: "This will take less than 2 minutes to complete",
    },
    {
      id: "jobTitle",
      title: "What is your current job title?",
      field: "jobTitle",
      placeholder: "e.g. Product Manager",
      type: "text",
    },
    {
      id: "company",
      title: "Which company do you work for?",
      field: "company",
      placeholder: "e.g. Acme Inc.",
      type: "text",
    },
    {
      id: "experience",
      title: "How many years of experience do you have?",
      field: "experience",
      type: "select",
      options: [
        { value: "0-1", label: "Less than 1 year" },
        { value: "1-3", label: "1-3 years" },
        { value: "3-5", label: "3-5 years" },
        { value: "5-10", label: "5-10 years" },
        { value: "10+", label: "10+ years" },
      ],
    },
    {
      id: "jobStability",
      title: "How stable do you feel in your current job?",
      subtitle: "1 being very unstable, 5 being very stable",
      field: "jobStability",
      type: "rating",
    },
    {
      id: "salarRange",
      title: "What's your approximate salary range?",
      subtitle: "This helps us provide relevant career advice",
      field: "salarRange",
      type: "select",
      optional: true,
      options: [
        { value: "", label: "Prefer not to say" },
        { value: "0-50k", label: "Under $50,000" },
        { value: "50k-75k", label: "$50,000 - $75,000" },
        { value: "75k-100k", label: "$75,000 - $100,000" },
        { value: "100k-150k", label: "$100,000 - $150,000" },
        { value: "150k+", label: "$150,000+" },
      ],
    },
    {
      id: "topSkills",
      title: "What are your top 3 skills?",
      field: "topSkills",
      type: "skills",
    },
    {
      id: "timeForGrowth",
      title: "How much time can you dedicate to growth each week?",
      field: "timeForGrowth",
      type: "select",
      options: [
        { value: "1-3", label: "1-3 hours/week" },
        { value: "4-7", label: "4-7 hours/week" },
        { value: "8-15", label: "8-15 hours/week" },
        { value: "15+", label: "15+ hours/week" },
      ],
    },
    {
      id: "linkedinUrl",
      title: "What's your LinkedIn URL?",
      subtitle: "Optional",
      field: "linkedinUrl",
      placeholder: "https://linkedin.com/in/yourprofile",
      type: "text",
      optional: true,
    },
    {
      id: "biggestConcern",
      title: "What's your biggest career concern right now?",
      field: "biggestConcern",
      placeholder: "e.g. Job security, skill gaps, career progression...",
      type: "textarea",
    },
    {
      id: "confirm",
      title: "Almost done!",
      subtitle: "Please review your information",
      type: "confirm",
    },
    {
      id: "complete",
      title: "Thanks for completing your profile",
      subtitle: "We've customized your experience based on your responses",
      type: "complete",
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Tab" &&
      !e.shiftKey &&
      index < 2 &&
      inputRefs.current[`skill-${index + 1}`]
    ) {
      setTimeout(() => {
        inputRefs.current[`skill-${index + 1}`].focus();
      }, 10);
    }
  };

  const getFormField = () => {
    if (
      !currentQuestion ||
      currentQuestion.id === "welcome" ||
      currentQuestion.id === "complete"
    ) {
      return null;
    }

    switch (currentQuestion.type) {
      case "text":
        return (
          <div className="w-full max-w-md mt-8">
            <Input
              ref={(el) => (inputRefs.current[currentQuestion.field] = el)}
              type={currentQuestion.inputType || "text"}
              name={currentQuestion.field}
              value={formData[currentQuestion.field]}
              onChange={handleInputChange}
              placeholder={
                currentQuestion.placeholder || "Type your answer here..."
              }
              className={cn(
                "w-full text-xl h-14 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-gray-300",
                validationError &&
                  !currentQuestion.optional &&
                  "border-red-500 focus-visible:border-b-red-500"
              )}
              required={!currentQuestion.optional}
              onKeyDown={(e) => e.key === "Enter" && nextStep()}
            />
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div className="w-full max-w-md mt-8">
            <Textarea
              ref={(el) => (inputRefs.current[currentQuestion.field] = el)}
              name={currentQuestion.field}
              value={formData[currentQuestion.field]}
              onChange={handleInputChange}
              placeholder={
                currentQuestion.placeholder || "Type your answer here..."
              }
              className={cn(
                "w-full text-xl h-32 bg-transparent border-2 border-gray-300 rounded-md px-4 py-3 focus-visible:ring-0 focus-visible:border-black",
                validationError &&
                  !currentQuestion.optional &&
                  "border-red-500 focus-visible:border-red-500"
              )}
              required={!currentQuestion.optional}
            />
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>
        );
      case "select":
        return (
          <div className="w-full max-w-md mt-8 space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleSelectChange(currentQuestion.field, option.value);
                  setTimeout(() => nextStep(), 300);
                }}
                className={cn(
                  "w-full text-left px-5 py-4 border-2 rounded-md text-lg transition-all flex items-center justify-between",
                  formData[currentQuestion.field] === option.value
                    ? "border-gray-50 bg-black text-white"
                    : "border-gray-400 hover:border-gray-500"
                )}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectChange(currentQuestion.field, option.value);
                    setTimeout(() => nextStep(), 300);
                  }
                }}
                aria-label={option.label}
              >
                <span>{option.label}</span>
                {formData[currentQuestion.field] === option.value && (
                  <CheckCircle className="h-5 w-5" />
                )}
              </button>
            ))}
            {validationError && !currentQuestion.optional && (
              <p className="text-red-500 text-sm mt-1">
                Please select an option
              </p>
            )}
          </div>
        );
      case "rating":
        return (
          <div className="w-full max-w-md mt-8">
            <div className="flex justify-between items-center gap-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleStabilityChange(value)}
                  className={cn(
                    "flex-1 aspect-square rounded-full text-2xl border-2 transition-all duration-300",
                    formData.jobStability === value
                      ? "border-black bg-black text-white"
                      : value < formData.jobStability
                      ? "border-black bg-neutral-700"
                      : "border-gray-300 hover:border-gray-500"
                  )}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStabilityChange(value);
                    }
                  }}
                  aria-label={`Stability level ${value}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="w-full max-w-md mt-8 space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center">
                <span className="w-10 h-10 rounded-full bg-neutral-800 border border-b-blue-100 flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                <Input
                  ref={(el) => (inputRefs.current[`skill-${index}`] = el)}
                  type="text"
                  value={formData.topSkills[index]}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Enter skill ${index + 1}`}
                  className={cn(
                    "flex-1 text-lg h-12 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-neutral-600",
                    validationError &&
                      index === 0 &&
                      !formData.topSkills.some(Boolean) &&
                      "border-red-500 focus-visible:border-b-red-500"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && index === 2) {
                      nextStep();
                    } else {
                      handleKeyDown(e, index);
                    }
                  }}
                />
              </div>
            ))}
            {validationError && !formData.topSkills.some(Boolean) && (
              <p className="text-red-500 text-sm mt-1">
                Please enter at least one skill
              </p>
            )}
          </div>
        );
      case "confirm":
        return (
          <div className="w-full max-w-md mt-8 bg-gray-50 rounded-lg overflow-hidden">
            {formData.jobTitle && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Job Title</span>
                <span className="font-medium">{formData.jobTitle}</span>
              </div>
            )}
            {formData.company && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Company</span>
                <span className="font-medium">{formData.company}</span>
              </div>
            )}
            {formData.experience && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Experience</span>
                <span className="font-medium">{formData.experience}</span>
              </div>
            )}
            <div className="flex justify-between px-5 py-4 border-b border-gray-200">
              <span className="text-gray-500">Job Stability</span>
              <span className="font-medium">{formData.jobStability}/5</span>
            </div>
            {formData.salarRange && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Salary Range</span>
                <span className="font-medium">{formData.salarRange}</span>
              </div>
            )}
            {formData.topSkills.some(Boolean) && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Top Skills</span>
                <span className="font-medium">
                  {formData.topSkills.filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {formData.timeForGrowth && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">Time for Growth</span>
                <span className="font-medium">{formData.timeForGrowth}</span>
              </div>
            )}
            {formData.linkedinUrl && (
              <div className="flex justify-between px-5 py-4 border-b border-gray-200">
                <span className="text-gray-500">LinkedIn</span>
                <span className="font-medium">{formData.linkedinUrl}</span>
              </div>
            )}
            {formData.biggestConcern && (
              <div className="px-5 py-4">
                <span className="text-gray-500 block mb-2">
                  Biggest Concern
                </span>
                <span className="font-medium">{formData.biggestConcern}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/25 text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        {currentStep > 0 && (
          <motion.div
            className="h-full bg-black"
            initial={{ width: `${getProgressPercentage() - 10}%` }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <div className="w-full min-h-screen flex flex-col">
        {currentStep > 0 && currentStep <= totalQuestions && (
          <div className="flex justify-between py-4 px-6">
            <button
              onClick={prevStep}
              className="text-gray-500 hover:text-black transition-colors"
              aria-label="Go back"
              tabIndex={0}
            >
              Back
            </button>
            <div className="text-gray-500 text-sm">
              {currentStep} of {totalQuestions}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-0"
              >
                <h1 className="text-3xl md:text-4xl font-medium mb-2">
                  {currentQuestion.title}
                </h1>

                {currentQuestion.subtitle && (
                  <p className="text-lg text-gray-500 mb-1">
                    {currentQuestion.subtitle}
                  </p>
                )}

                {currentQuestion.description && (
                  <p className="text-gray-500">{currentQuestion.description}</p>
                )}

                {getFormField()}

                {currentStep === totalQuestions && submissionError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-500 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{submissionError}</span>
                  </div>
                )}

                {(currentStep === 0 ||
                  currentStep === totalQuestions + 1 ||
                  currentQuestion.type === "text" ||
                  currentQuestion.type === "textarea" ||
                  currentQuestion.type === "confirm") && (
                  <div className="mt-8">
                    <Button
                      onClick={
                        currentStep === totalQuestions + 1
                          ? () => router.push("/dashboard")
                          : nextStep
                      }
                      disabled={isSubmitting}
                      className={cn(
                        "h-12 px-16 bg-black hover:bg-gray-800 text-white rounded-full font-normal text-lg w-full md:w-auto flex items-center justify-center",
                        isSubmitting && "opacity-80"
                      )}
                      tabIndex={0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : currentStep === 0 ? (
                        <>Get Started</>
                      ) : currentStep === totalQuestions ? (
                        <>Submit</>
                      ) : currentStep === totalQuestions + 1 ? (
                        <>Go to Dashboard</>
                      ) : (
                        <>
                          OK <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center pb-16 text-sm text-gray-100">
          Press{" "}
          <kbd className="px-2 py-1 bg-neutral-600 rounded text-xs mx-1">
            Enter
          </kbd>{" "}
          to continue or{" "}
          <kbd className="px-2 py-1 bg-neutral-600 rounded text-xs mx-1">↑</kbd>{" "}
          to go back
        </div>
      </div>
    </div>
  );
}
