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
  Plus,
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
    topSkills: ["", "", ""], // Start with 3 empty skills
    timeForGrowth: "",
    linkedinUrl: "",
    biggestConcern: "",
  });

  const inputRefs = useRef({});
  const totalQuestions = 9;

  // Add a new skill input field
  const addSkill = () => {
    setFormData({
      ...formData,
      topSkills: [...formData.topSkills, ""],
    });
    // Focus on the new skill input after it's added
    setTimeout(() => {
      const newSkillIndex = formData.topSkills.length;
      if (inputRefs.current[`skill-${newSkillIndex}`]) {
        inputRefs.current[`skill-${newSkillIndex}`].focus();
      }
    }, 10);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle global keyboard events if not inside a skill input field
      const isInSkillInput =
        e.target.tagName === "INPUT" && e.target.id?.startsWith("skill-");

      if (e.key === "Enter" && !e.shiftKey && !isInSkillInput) {
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

    // Special validation for skills (require at least three filled skills)
    if (currentQuestion.field === "topSkills") {
      const filledSkills = formData.topSkills.filter(
        (skill) => skill.trim() !== ""
      );
      return filledSkills.length >= 3;
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

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save onboarding data");
      }

      // Show a success message briefly before moving to the next step
      // This creates a more satisfying completion feeling
      await new Promise((resolve) => setTimeout(resolve, 600));

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
            for (let i = 0; i < formData.topSkills.length; i++) {
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
      index < formData.topSkills.length - 1 &&
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
                "w-full text-xl h-32 bg-transparent border-2 border-gray-300 rounded-md px-4 py-3 focus-visible:ring-0 focus-visible:border-white",
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
                      ? "border-white bg-black text-white"
                      : value < formData.jobStability
                      ? "border-gray-300 bg-neutral-900"
                      : "border-gray-300 hover:border-gray-500 bg-neutral-600"
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
            {formData.topSkills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-10 h-10 border border-b-blue-100 rounded-full bg-neutral-800 flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                <Input
                  ref={(el) => (inputRefs.current[`skill-${index}`] = el)}
                  type="text"
                  id={`skill-${index}`}
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Enter skill ${index + 1}`}
                  className={cn(
                    "flex-1 text-lg h-12 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-neutral-600",
                    validationError &&
                      formData.topSkills.filter((skill) => skill.trim() !== "")
                        .length < 3 &&
                      "border-red-500 focus-visible:border-b-red-500"
                  )}
                  onKeyDown={(e) => {
                    // Handle Enter key specifically for skill inputs
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      e.stopPropagation(); // Stop event bubbling to global handler

                      const filledSkills = formData.topSkills.filter(
                        (s) => s.trim() !== ""
                      );

                      if (filledSkills.length >= 3) {
                        // If we have enough skills, go to the next step
                        nextStep();
                      } else if (
                        formData.topSkills[index].trim() !== "" &&
                        index === formData.topSkills.length - 1
                      ) {
                        // If current field has content and it's the last one, add a new skill field
                        addSkill();
                      }
                    } else {
                      // Handle other key navigation (tab, arrows, etc)
                      handleKeyDown(e, index);
                    }
                  }}
                />
              </div>
            ))}

            <div className="flex justify-center self-center items-center">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addSkill();
                }}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mt-2 rounded-full border border-gray-100 hover:border-white px-6 py-2 h-auto"
                tabIndex={0}
                aria-label="Add another skill"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    addSkill();
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add skill
              </Button>

              {validationError &&
                formData.topSkills.filter((skill) => skill.trim() !== "")
                  .length < 3 && (
                  <p className="text-red-500 text-sm  m-4">
                    Please enter at least 3 skills
                  </p>
                )}
            </div>

            {/* Add "Continue" button for skills section to make navigation clearer */}
            <div className="mt-6 px-6">
              <Button
                onClick={nextStep}
                className="h-12 px-24 bg-black hover:bg-gray-800 text-white rounded-full font-normal text-lg w-full md:w-auto flex items-center justify-center"
                tabIndex={0}
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case "confirm":
        return (
          <div className="w-full max-w-md mt-8">
            <motion.div
              className="bg-gray-50 text-gray-800 p-6 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg leading-relaxed">
                <span className="font-semibold">Great progress!</span> As a{" "}
                <span className="font-semibold">{formData.jobTitle}</span> at{" "}
                <span className="font-semibold">{formData.company}</span> with{" "}
                <span className="font-semibold">{formData.experience}</span>{" "}
                experience, we'll help you leverage your stability level (
                {formData.jobStability}/5) and top skills (
                {formData.topSkills.filter(Boolean).join(", ")}) to reach your
                next career milestone.
              </p>

              <p className="text-lg leading-relaxed mt-4">
                You've committed to investing{" "}
                <span className="font-semibold">{formData.timeForGrowth}</span>{" "}
                weekly toward your professional growth, and we've noted your
                primary concern:{" "}
                <span className="italic">"{formData.biggestConcern}"</span>
              </p>

              <div className="mt-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  We're excited to build your personalized career growth plan!
                </p>
              </div>
            </motion.div>

            <div className="mt-8 text-center">
              <Button
                onClick={submitFormData}
                disabled={isSubmitting}
                className={cn(
                  "h-14 px-10 bg-black hover:bg-gray-800 text-white rounded-full font-normal text-lg w-full transition-all duration-300 transform hover:scale-105",
                  isSubmitting && "opacity-80"
                )}
                tabIndex={0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Building
                    your roadmap...
                  </>
                ) : (
                  <>
                    Launch My Career Journey{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
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
